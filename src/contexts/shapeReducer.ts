/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Mode } from "../type/Shape";

type Position = {
  x: number;
  y: number;
};

export type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
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
  id: number;
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
};

export type TempShape = RectShape | EllipseShape | SelectionBox ;

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

export function tempShapeReducer(
  old: TempShape | null,
  action: TempShapeAction
): TempShape {

  switch (action.type) {
    case "INIT":
      return null as any;

    case "RECT":
      return {
        id: action.data.maxID,
        name: "Rectangle",
        type: "shape",
        fill: "#D9D9D9",
        stroke: "#D9D9D9",
        strokeWidth: 2,
        rotation: 0,
        ...old,
        x: Math.min(action.data.startPoint.x, action.data.pos.x),
        y: Math.min(action.data.startPoint.y, action.data.pos.y),
        width: Math.abs(action.data.pos.x - action.data.startPoint.x),
        height: Math.abs(action.data.pos.y - action.data.startPoint.y),
      } as RectShape;

    case "ELLIPSE":
      return {
        id: action.data.maxID,
        name: "Ellipse",
        type: "shape",
        fill: "#D9D9D9",
        rotation: 0,
        stroke: "#D9D9D9",
        strokeWidth: 2,
        ...old,
        x: (action.data.startPoint.x + action.data.pos.x) / 2,
        y: (action.data.startPoint.y + action.data.pos.y) / 2,
        radiusX: Math.abs(action.data.pos.x - action.data.startPoint.x) / 2,
        radiusY: Math.abs(action.data.pos.y - action.data.startPoint.y) / 2,
        width: Math.abs(action.data.pos.x - action.data.startPoint.x),
        height: Math.abs(action.data.pos.y - action.data.startPoint.y),
      } as EllipseShape;

    case "SELECT":
      return action.data.select as SelectionBox;
    default: // "DEFAULT"
      throw new Error("에러");
  }
}
