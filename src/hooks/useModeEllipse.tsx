import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { EllipseType } from "../type/Shape";
import { useShapeRefState } from "../contexts/ShapeRefContext";

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
  const {
    drawingShapeRef,
    rectRefs,
    transformerRef,
    selectedIds,
    setSelectedIds,
    setMode,
  } = useShapeRefState();

  useEffect(() => {
    console.log(creatingEllipse);
  }, [creatingEllipse]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isCreating.current = true;
    startPoint.current = pos;

    // 여기만 다르면 됨 그리는 도구마다 다름 인자로 받기기
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
      stroke: "black",
      strokeWidth: 2,
    });

    // 모드 따라 다르게,
    setSelectedIds([`Ellipse ${1}`]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating.current || !startPoint.current || !creatingEllipse) return;

    const pos = e.target.getStage()?.getPointerPosition() as EllipseType;

    setCreatingEllipse({
      ...creatingEllipse,
      x: Math.min(startPoint.current.x, pos.x),
      y: Math.min(startPoint.current.y, pos.y),
      radiusX: Math.abs(pos.x - startPoint.current.x),
      radiusY: Math.abs(pos.y - startPoint.current.y),
    });

  };


  return {
    handleMouseDown,
    handleMouseMove,
  };
}
