import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { HandlerProps, Mode } from "../type/Shape";
import useModeEllipse from "./useModeEllipse";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { shapeAllData } from "../Atoms/RectangleState";
import { useAtomValue } from "jotai";

interface PointProps {
  x: number;
  y: number;
}

export default function useModeHandlers() {
  const {
    drawingShapeRef,
    ellipseRefs,
    transformerRef,
    selectedIds,
    setSelectedIds,
    setMode,
    tempShape,
    tempShapeDispatch,
    mode,
  } = useShapeRefState();
  const isCreating = useRef(false);
  const startPoint = useRef<PointProps>({ x: 0, y: 0 });
  const shapeAll = useAtomValue(shapeAllData); // 공통통

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isCreating.current = true;
    startPoint.current = pos;

    tempShapeDispatch({
      type: mode,
      data: { startPoint: startPoint.current, pos, maxID: shapeMaxID(mode) },
    });
  };

  const shapeMaxID = (mode : Mode) => {
    const maxID = shapeAll[mode].reduce((max, rect) => {
      return Math.max(max, rect.id);
    }, 1);

    return maxID + 1;
  };

  return {
    handleMouseDown,
  };
}
