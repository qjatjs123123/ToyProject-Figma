/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { KonvaEventObject } from "konva/lib/Node";
import { useMemo, useRef } from "react";
import { useAtom } from "jotai";
import { ShapeStrategyFactory } from "../utils/shapes/ShapeStrategyFactory";
import { shapeAtom } from "../Atoms/ShapeState";
import { selectAtomByName } from "../Atoms/selectAtomByName";
import { SHAPE } from "../utils/constants/constants";
import { HistoryManager } from "../utils/history/CommandManager";
import { CreateHistory } from "../utils/history/CreateHistory";
import { UpdateHistory } from "../utils/history/UpdateHistory";

export default function useModeHandlers() {
  const {
    selectedIds,
    setSelectedIds,
    setMode,
    tempShape,
    tempShapeDispatch,
    mode,
    isCreating,
    setIsCreating,
    drawingShapeRef,
  } = useShapeRefState();

  const startPoint = useRef<any>({ x: 0, y: 0 });
  const [shapes, setShapes] = useAtom(shapeAtom);
  const selectedShapeAtom = useMemo(() => selectAtomByName(mode), [mode]);
  const [selectByNameArr] = useAtom(selectedShapeAtom);

  const isDragging = useRef(false);

  const shapeStrategy = ShapeStrategyFactory.createShape({
    mode,
    setTempShape: tempShapeDispatch,
    tempShape,
    shapes,
    setShapes,
  });

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (isDragging.current) {
      return;
    }

    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      return;
    }

    const clickedId = e.target.id();

    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      setSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      setSelectedIds(selectedIds.filter((id) => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      setSelectedIds([...selectedIds, clickedId]);
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    setIsCreating(true);
    startPoint.current = pos;
    shapeStrategy.down({
      selectByNameArr,
      startPoint: startPoint.current,
      currentPoint: pos,
      setSelectedIds,
    });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating) {
      return;
    }

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (startPoint.current) isDragging.current = true;

    shapeStrategy.move({
      startPoint: startPoint.current,
      currentPoint: pos,
      setSelectedIds,
    });
  };

  const handleTransformEnd = (e: KonvaEventObject<MouseEvent>) => {
    const shapeId = e.target.id();
    const shapeName = e.target.className?.toString();

    if (!shapeName) return;

    const { originData, newData } = shapeStrategy.transformEnd(shapeId, e.target);
    HistoryManager.log(
      new UpdateHistory({ shapeId, setShapes, originData, newData })
    );
  };

  const handleMouseUp = () => {
    if (!isCreating) return;
    if (tempShape && (tempShape.height < 5 || tempShape.width < 5)) return;
    console.log(drawingShapeRef)
    // if (mode !== SHAPE.Select)
      HistoryManager.log(new CreateHistory({ tempShape, shapes, setShapes, drawingShapeRef, setSelectedIds }));

    shapeStrategy.up();

    startPoint.current = null;
    setIsCreating(false);
    setMode(SHAPE.Select);
    tempShapeDispatch(null);
    setTimeout(() => {
      isDragging.current = false;
    }, 10);
  };

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (mode !== SHAPE.Select) return;

    const shapeId = e.target.id();
    const newPos = { x: e.target.x(), y: e.target.y() };

    const { originData, newData } = shapeStrategy.dragEnd(shapeId, newPos);
    HistoryManager.log(
      new UpdateHistory({ shapeId, setShapes, originData, newData })
    );
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleDragEnd,
    handleTransformEnd,
  };
}
