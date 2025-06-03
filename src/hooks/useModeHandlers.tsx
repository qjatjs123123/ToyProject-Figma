/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { EllipseType, Mode, Rectangle } from "../type/Shape";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useMemo, useRef } from "react";
import { rectangleAtom, shapeAllData } from "../Atoms/RectangleState";
import { useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { EllipseAtom } from "../Atoms/EllipseState";
import type {
  EllipseShape,
  RectShape,
  SelectionBox,
} from "../contexts/shapeReducer";
import { DragMoveCommand } from "../utils/MoveCommand";
import { CommandManager } from "../utils/CommandManager";
import { TransformCommand } from "../utils/TransformCommand";
import { CreateCommand } from "../utils/CreateCommand";
import { ShapeStrategyFactory } from "../utils/shapes/ShapeStrategyFactory";
import { shapeAtom } from "../Atoms/ShapeState";
import { selectAtomByName } from "../Atoms/selectAtomByName";
import { SHAPE } from "../utils/constants/constants";
import { HistoryManager } from "../utils/history/CommandManager";
import { CreateHistory } from "../utils/history/CreateHistory";
import { DragHistory } from "../utils/history/DragHistory";

const mappingTable = {
  RECT: "Rectangle",
  ELLIPSE: "Ellipse",
};

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
  const shapeAll = useAtomValue(shapeAllData);
  const [shapes, setShapes] = useAtom(shapeAtom);
  const [rectangles, setRectangles] = useAtom(rectangleAtom);
  const [ellipses, setEllipses] = useAtom(EllipseAtom);
  const selectedShapeAtom = useMemo(() => selectAtomByName(mode), [mode]);
  const [selectByNameArr] = useAtom(selectedShapeAtom);

  const isDragging = useRef(false);
  const isBatching = useRef(false);
  const setterFunc = {
    Rect: setRectangles,
    Ellipse: setEllipses,
  };
  const batchTimeout = useRef<number | null>(null);
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
    if (!isBatching.current) {
      isBatching.current = true;
      CommandManager.isBatching = true;
      CommandManager.init();
    }

    const id = e.target.id();
    const className = e.target.className?.toString() as keyof typeof setterFunc;

    if (!className || !(className in setterFunc)) return;

    const command = new TransformCommand(setterFunc[className], id, e.target);
    CommandManager.execute(command);

    batchTimeout.current = setTimeout(() => {
      isBatching.current = false;
      CommandManager.isBatching = false;
      batchTimeout.current = null;
    }, 0);
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating) return;
    if (tempShape && (tempShape.height < 5 || tempShape.width < 5)) return;

    if (mode !== SHAPE.Select)
      HistoryManager.log(new CreateHistory({ tempShape, shapes, setShapes }));

    shapeStrategy.up();

    startPoint.current = null;
    setIsCreating(false);
    setMode(SHAPE.Select);
    tempShapeDispatch(null);
    selectShapesByDrageInit(e);
  };

  const selectShapesByDrageInit = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

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
      new DragHistory({ shapeId, setShapes, originData, newData })
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
