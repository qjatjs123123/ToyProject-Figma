/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ellipse, Mode, Rect } from "./Shape";

type Position = {
  x: number;
  y: number;
};

export type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  name: "Rectangle";
  type: "shape";
  fill: string;
  rotation: number;
  stroke: string;
  strokeWidth: number;
};

export type EllipseShape = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  width: number;
  height: number;
  id: string;
  name: "Ellipse";
  type: "shape";
  fill: string;
  rotation: number;
  stroke: string;
  strokeWidth: number;
};

export type SelectionBox = {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  x:number,
  y:number
  fill:string,
  stroke: string,
  type: "Select";
};

export type TempShape = Rect | Ellipse | SelectionBox 

export type TempShapeAction = {
  type: Mode | "INIT";
  data: {
    pos: Position;
    maxID?: number;
    startPoint: Position;
    visible: boolean;
    select?: object
  } ;
};
