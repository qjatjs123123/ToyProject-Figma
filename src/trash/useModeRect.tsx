import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { RectType } from "../type/Shape";
import { rectangleAtom } from "../Atoms/RectangleState";
import { useAtom, useAtomValue } from "jotai";
import { rectangleMaxID } from "../Atoms/RectangleState";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import { Rect } from "konva/lib/shapes/Rect";

interface PointProps {
  x: number;
  y: number;
}

export default function useModeRect() {
  const [creatingRect, setCreatingRect] = useState<RectType | null>(null);
  const [rectangles, setRectangles] = useAtom(rectangleAtom);
  const maxID = useAtomValue(rectangleMaxID);

  const startPoint = useRef<PointProps>({ x: 0, y: 0 });
  const {
    isCreating,
    setIsCreating,
    drawingShapeRef,
    rectRefs,
    transformerRef,
    selectedIds,
    setSelectedIds,
    setMode,
  } = useShapeRefState();

  useEffect(() => {
    if (selectedIds.length && transformerRef.current) {
      const nodes = selectedIds
        .map((id) => rectRefs.current.get(id))
        .filter((node) => node instanceof Rect);

      if (nodes.length > 0) transformerRef.current.nodes(nodes);

      if (nodes.length == 0 && drawingShapeRef.current)
        transformerRef.current.nodes([drawingShapeRef.current]);
    }
  }, [selectedIds, creatingRect]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    console.log("down")
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    
    setIsCreating(true);
    startPoint.current = pos;

    setCreatingRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      id: maxID,
      name: "Rectangle",
      type: "shape",
      fill: "#D9D9D9",
      rotation: 0,
    });

    setSelectedIds([`Rectangle ${maxID}`]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating || !startPoint.current || !creatingRect) return;

    const pos = e.target.getStage()?.getPointerPosition() as RectType;

    setCreatingRect({
      ...creatingRect,
      x: Math.min(startPoint.current.x, pos.x),
      y: Math.min(startPoint.current.y, pos.y),
      width: Math.abs(pos.x - startPoint.current.x),
      height: Math.abs(pos.y - startPoint.current.y),
    });
  };

  const handleMouseUp = () => {
    if (!isCreating || !startPoint.current) return;
    if (!creatingRect || creatingRect.width <= 5 || creatingRect.height <= 5)
      return;

    setRectangles([...rectangles, creatingRect]);
    setCreatingRect(null);
    setIsCreating(false);
    setMode("SELECT");
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    transformerRef,
    rectRefs,
    creatingRect,
  };
}
