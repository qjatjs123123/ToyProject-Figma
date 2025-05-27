import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { EllipseType } from "../type/Shape";

interface PointProps {
  x: number;
  y: number;
}

export default function useModeEllipse() {
  const [creatingEllipse, setCreatingEllipse] = useState<EllipseType | null>(
    null
  ); // 공통 로직
  const isCreating = useRef(false); // 공통로직직
  const startPoint = useRef<PointProps>({ x: 0, y: 0 }); // 공통 로직

  useEffect(() => {
    console.log(creatingEllipse)
  }, [creatingEllipse])

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isCreating.current = true;
    startPoint.current = pos;

    setCreatingEllipse({
      x: pos.x,
      y: pos.y,
      radiusX: 0,
      radiusY: 0,
      id: 1,
      name: "Ellipse",
      type: "shape",
      fill: "#D9D9D9",
      rotation: 0,
      stroke: 'black',
      strokeWidth: 2
    });
    

  };

  return {
    handleMouseDown,
  };
}
