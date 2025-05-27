import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { RectType } from "../type/Shape";

let rectID = 1;

export default function useModeRect() {
  const isCreating = useRef(false);
  const startPoint = useRef<unknown | null>(null);
  const [creatingRect, setCreatingRect] = useState<RectType>();

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
      id: `Rectangle ${rectID++}`,
      name: "rect",
      fill: "rgba(0,0,255,0.3)",
    });
  };

  return {
    handleMouseDown,
  };
}
