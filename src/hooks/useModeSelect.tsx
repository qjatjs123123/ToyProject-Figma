import { useEffect, useRef, useState } from "react";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { useAtomValue } from "jotai";
import { rectangleAtom } from "../Atoms/RectangleState";

interface ElementProps {
  x : number,
  y : number,
  width : number,
  height : number,
  rotation: number
}

interface SelectRectangleProps { 
  visible: boolean,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

const degToRad = (angle : number) => (angle / 180) * Math.PI;

const getCorner = (pivotX : number, pivotY : number, diffX : number, diffY : number, angle : number) => {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  angle += Math.atan2(diffY, diffX);
  const x = pivotX + distance * Math.cos(angle);
  const y = pivotY + distance * Math.sin(angle);
  return { x, y };
};

const getClientRect = (element : ElementProps) => {
  const { x, y, width, height, rotation = 0 } = element;
  const rad = degToRad(rotation);

  const p1 = getCorner(x, y, 0, 0, rad);
  const p2 = getCorner(x, y, width, 0, rad);
  const p3 = getCorner(x, y, width, height, rad);
  const p4 = getCorner(x, y, 0, height, rad);

  const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
  const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
  const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
  const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

const initSelectionRectangleData : SelectRectangleProps = {
  visible: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
}
export default function useModeSelect() {
  const { rectRefs, transformerRef, selectedIds, setSelectedIds } = useShapeRefState();
  const [selectionRectangle, setSelectionRectangle] = useState<SelectRectangleProps>(initSelectionRectangleData);
  const rectangles = useAtomValue(rectangleAtom);
  const isSelecting = useRef(false);

  useEffect(() => {
    if (selectedIds.length && transformerRef.current) {
      const nodes = selectedIds
        .map(id => rectRefs.current.get(id))
        .filter(node => node != undefined);
      
      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedIds])

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) {
      return;
    }
  
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isSelecting.current = true;
    setSelectionRectangle({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isSelecting.current) {
      return;
    }
    
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x,
      y2: pos.y,
    });

  };

  const handleMouseUp = () => {
    if (!isSelecting.current) {
      return;
    }
    isSelecting.current = false;
    
    setTimeout(() => {
      setSelectionRectangle({
        ...selectionRectangle,
        visible: false,
      });
    });

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };

    const selected = rectangles.filter(rect => {
      return Konva.Util.haveIntersection(selBox, getClientRect(rect));
    });
    
    setSelectedIds(selected.map(rect => `${rect.name} ${rect.id}`));
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    selectionRectangle
  }
}