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
  | { type: "RECT"; data: RectShape }
  | { type: "ELLIPSE"; data: { pos: Position; maxID: number } }
  | { type: "DEFAULT"; data: { pos: Position } };


export function tempShapeReducer(old: TempShape | null, action: TempShapeAction): TempShape {
  switch (action.type) {
    case "RECT":
      return action.data;

    case "ELLIPSE":
      return {
        x: action.data.pos.x,
        y: action.data.pos.y,
        radiusX: 0,
        radiusY: 0,
        width: 0,
        height: 0,
        id: action.data.maxID,
        name: "Ellipse",
        type: "shape",
        fill: "#D9D9D9",
        rotation: 0,
        stroke: "black",
        strokeWidth: 2,
      };

    default: // "DEFAULT"
      return {
        visible: true,
        x1: action.data.pos.x,
        y1: action.data.pos.y,
        x2: action.data.pos.x,
        y2: action.data.pos.y,
      };
  }
}
