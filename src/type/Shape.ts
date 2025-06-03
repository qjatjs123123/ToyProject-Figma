import type { KonvaEventObject } from "konva/lib/Node";
import { Ellipse } from "react-konva";

export type Mode = "Rectangle" | "Select" | "Ellipse";

export interface Ellipse {
  id: number;
  name: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill?: string;
  rotation: number;
  stroke: string;
  strokeWidth?: number;
  type: "Ellipse";
  width: number;
  height: number;
}

export interface Rect {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  rotation: number;
  type: "Rectangle";
  stroke?: string;
  strokeWidth?: number;
}

export interface Select {
  visible: boolean;
  fill?: string;
  stroke?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface EllipseType {
  id: number;
  name: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill?: string;
  rotation: number;
  stroke: string;
  strokeWidth?: number;
  type?: string;
  width: number;
  height: number;
}

export interface RectType {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  rotation: number;
  type: string;
}

export interface SelectRectangleProps {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface HandlerProps {
  handleMouseDown?: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseMove?: (e: KonvaEventObject<MouseEvent>) => void;
  handleMouseUp?: (e: KonvaEventObject<MouseEvent>) => void;
  handleStageClick?: (e: KonvaEventObject<MouseEvent>) => void;
  handleDragEnd?: (e: KonvaEventObject<MouseEvent>) => void;
  handleTransformEnd?: (e: KonvaEventObject<MouseEvent>) => void;
  creatingRect?: RectType | null;
  creatingEllipse?: EllipseType | null;
  selectionRectangle?: SelectRectangleProps | null;
}
