import type { Mode } from "../../type/Shape";

export const SHAPE: Record<Mode, Mode> = {
  Rectangle: "Rectangle",
  Ellipse: "Ellipse",
  Select: "Select",
};

export const SHAPE_INIT_DATA = {
  rectangle: {
    fill: "#D9D9D9",
    stroke: "D9D9D9",
    strokeWidth: 5,
    rotation: 0,
  },
  ellipse: {
    fill: "#D9D9D9",
    stroke: "D9D9D9",
    strokeWidth: 5,
    rotation: 0,
  },
  select: {
    fill: "rgba(40, 108, 255, 0.36)",
    stroke: "#80D0FF",
  }
} ;

export const MAX_HISTORY = 40;