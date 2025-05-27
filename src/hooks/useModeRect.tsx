import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { RectType } from "../type/Shape";
import { rectangleAtom } from "../Atoms/RectangleState";
import { useAtom, useAtomValue } from "jotai";
import { rectangleMaxID } from "../Atoms/RectangleState";

interface PointProps {
  x: number;
  y: number;
}

export default function useModeRect() {
  const [creatingRect, setCreatingRect] = useState<RectType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rectangles, setRectangles] = useAtom(rectangleAtom);
  const maxID = useAtomValue(rectangleMaxID);
  const isCreating = useRef(false);
  const startPoint = useRef<PointProps>({ x: 0, y: 0 });

  useEffect(() => {
    console.log(rectangles);
  }, [rectangles]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isCreating.current = true;
    startPoint.current = pos;

    setCreatingRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      id: maxID,
      name: "Rectangle",
      fill: "rgba(0,0,255,0.3)",
    });

    setSelectedIds([`Rectangle ${maxID}`]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating.current || !startPoint.current || !creatingRect) return;

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
    if (!isCreating.current || !startPoint.current ) return;
    if (!creatingRect || creatingRect.width <= 5 || creatingRect.height <= 5) return;

    setRectangles([...rectangles, creatingRect]);
    setCreatingRect(null);
    isCreating.current = false;
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
