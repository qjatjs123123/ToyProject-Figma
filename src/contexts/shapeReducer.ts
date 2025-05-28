type Position = {
  x: number;
  y: number;
};

type RectShape = {
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

type EllipseShape = {
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

type SelectionBox = {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type TempShape = RectShape | EllipseShape | SelectionBox;

type TempShapeAction =
  | {
      type: "RECT";
      data: { pos: Position; maxID: number; startPoint: Position };
    }
  | {
      type: "ELLIPSE";
      data: { pos: Position; maxID: number; startPoint: Position };
    }
  | { type: "DEFAULT"; data: { pos: Position; startPoint: Position } };

export function tempShapeReducer(
  old: TempShape | null,
  action: TempShapeAction
): TempShape {
  switch (action.type) {
    case "RECT":
      return {
        ...old,
        x: action.data.pos.x,
        y: action.data.pos.y,
        width: 0,
        height: 0,
        id: action.data.maxID,
        name: "Rectangle",
        type: "shape",
        fill: "#D9D9D9",
        rotation: 0,
      } as RectShape;

    case "ELLIPSE":
      return {
        id: action.data.maxID,
        name: "Ellipse",
        type: "shape",
        fill: "#D9D9D9",
        rotation: 0,
        stroke: "black",
        strokeWidth: 2,
        ...old,
        x: (action.data.startPoint.x + action.data.pos.x) / 2,
        y: (action.data.startPoint.y + action.data.pos.y) / 2,
        radiusX: Math.abs(action.data.pos.x - action.data.startPoint.x) / 2,
        radiusY: Math.abs(action.data.pos.y - action.data.startPoint.y) / 2,
        width: Math.abs(action.data.pos.x - action.data.startPoint.x),
        height: Math.abs(action.data.pos.y - action.data.startPoint.y),
      } as EllipseShape;
    default: // "DEFAULT"
      return {
        ...old,
        visible: true,
        x1: action.data.pos.x,
        y1: action.data.pos.y,
        x2: action.data.pos.x,
        y2: action.data.pos.y,
      } as SelectionBox;
  }
}
