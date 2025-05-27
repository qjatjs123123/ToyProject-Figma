import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import type { EllipseType } from "../type/Shape";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import { useAtom, useAtomValue } from "jotai";
import { EllipseAtom, EllipseMaxID } from "../Atoms/EllipseState";

interface PointProps {
  x: number;
  y: number;
}

export default function useModeEllipse() {
  const [creatingEllipse, setCreatingEllipse] = useState<EllipseType | null>(
    null
  ); // 공통 로직
  const [ellipses, setEllipses] = useAtom(EllipseAtom);
  const maxID = useAtomValue(EllipseMaxID); // 공통통
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
      id: maxID,
      name: "Ellipse",
      type: "shape",
      fill: "#D9D9D9",
      rotation: 0,
      stroke: "black",
      strokeWidth: 2,
    });

    // 모드 따라 다르게,
    setSelectedIds([`Ellipse ${maxID}`]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating.current || !startPoint.current || !creatingEllipse) return;

    const pos = e.target.getStage()?.getPointerPosition() as EllipseType;


    //여기만 다르게
    setCreatingEllipse({
      ...creatingEllipse,
      x: (startPoint.current.x + pos.x) / 2,
      y: (startPoint.current.y + pos.y) / 2,
      radiusX: Math.abs(pos.x - startPoint.current.x) / 2,
      radiusY: Math.abs(pos.y - startPoint.current.y) / 2,
    });
  };

  const handleMouseUp = () => {
    if (!isCreating.current || !startPoint.current) return;

    // 여기도 다름
    if (
      !creatingEllipse ||
      creatingEllipse.radiusX <= 5 ||
      creatingEllipse.radiusY <= 5
    )
      return;


    setEllipses([...ellipses, creatingEllipse]);
    setCreatingEllipse(null);
    isCreating.current = false;
    // setMode("SELECT");
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    creatingEllipse,
  };
}
