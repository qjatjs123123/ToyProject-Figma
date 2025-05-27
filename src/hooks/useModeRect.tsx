import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { RectType } from "../type/Shape";

let rectID = 1;
interface PointProps {
  x: number,
  y: number
}

export default function useModeRect() {
  const [creatingRect, setCreatingRect] = useState<RectType>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isCreating = useRef(false);
  const startPoint = useRef<PointProps | null>(null);

  useEffect(() => {
    console.log(creatingRect);
  }, [creatingRect])

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if(!pos) return;

    isCreating.current = true;
    startPoint.current = pos;

    setCreatingRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      id: `Rectangle ${rectID}`,
      name: "rect",
      fill: "rgba(0,0,255,0.3)",
    });

    setSelectedIds([`Rectangle ${rectID++}`]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating.current || !startPoint.current || !creatingRect) {
      return;
    }

    const pos = e.target.getStage()?.getPointerPosition() as RectType;

    setCreatingRect({
      ...creatingRect,
      x: Math.min(startPoint.current.x, pos.x),
      y: Math.min(startPoint.current.y, pos.y),
      width: Math.abs(pos.x - startPoint.current.x),
      height: Math.abs(pos.y - startPoint.current.y),
    });
  };

  return {
    handleMouseDown,
    handleMouseMove
  };
}
