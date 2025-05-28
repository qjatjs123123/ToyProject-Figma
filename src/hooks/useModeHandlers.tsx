import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { HandlerProps } from "../type/Shape";
import useModeEllipse from "./useModeEllipse";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";

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

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isCreating.current = true;
    startPoint.current = pos;

    tempShapeDispatch({
      type: mode,
      data: { startPoint: startPoint.current, pos },
    });
  };

  return {
    handleMouseDown,
  };
}
