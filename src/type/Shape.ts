import type { KonvaEventObject } from "konva/lib/Node";

export interface EllipseType {
  id: number;
  name : string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill?: string;
  rotation?: number; 
  stroke?: string;
  strokeWidth?: number;
  type?: string;
}

export interface RectType {
  id: number;
  name : string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  rotation: number; 
  type: string;
}

export interface HandlerProps {
  handleMouseDown?: (e: KonvaEventObject<MouseEvent>) => void
  handleMouseMove?: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseUp?: (e: KonvaEventObject<MouseEvent>) => void;
  handleStageClick?: (e: KonvaEventObject<MouseEvent>) => void;
  handleDragEnd? : (e: KonvaEventObject<MouseEvent>) => void;
  handleTransformEnd? : (e: KonvaEventObject<MouseEvent>) => void;
  creatingRect?: RectType | null;
  selectionRectangle?: SelectRectangleProps | null
}

export interface SelectRectangleProps { 
  visible: boolean,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}