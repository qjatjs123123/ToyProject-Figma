import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { HandlerProps, Mode } from "../type/Shape";
import useModeEllipse from "./useModeEllipse";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { shapeAllData } from "../Atoms/RectangleState";
import { useAtomValue } from "jotai";
import Konva from "konva";

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

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
      if (!isCreating.current) {
        return;
      }
  
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
  
      setSelectionRectangle({
        ...selectionRectangle,
        x2: pos.x,
        y2: pos.y,
      });
  
      const selBox = {
        x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
        y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
        width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
        height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
      };
  
      const selected = [...rectangles, ...ellipses].filter((rect) => {
      
        if (rect.name === 'Ellipse') {
          const ellipseBox = {
            ...rect,
            x : rect.x - rect.radiusX,
            y : rect.y - rect.radiusY,
          }
          return Konva.Util.haveIntersection(selBox, ellipseBox);
        }
        return Konva.Util.haveIntersection(selBox, getClientRect(rect));
      });
  
      setSelectedIds(selected.map((rect) => `${rect.name} ${rect.id}`));
    };

  const shapeMaxID = (mode : Mode) => {
    const maxID = shapeAll[mode].reduce((max, rect) => {
      return Math.max(max, rect.id);
    }, 1);

    return maxID + 1;
  };

  return {
    handleMouseDown,
    handleMouseMove
  };
}


