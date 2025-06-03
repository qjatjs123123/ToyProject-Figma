/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Mode } from "../../type/Shape";
import { SHAPE } from "../constants/constants";
import { RectangleStrategy } from "./RectangleStrategy";
import { SelectStrategy } from "./SelectStrategy";
import type { ShapeProps } from "./Shape.abstract";

interface ShapeFactoryProps extends ShapeProps<any> {
  mode: Mode;
}

export class ShapeStrategyFactory {
  static createShape({
    mode,
    setTempShape,
    tempShape,
    shapes,
    setShapes,
  }: ShapeFactoryProps) {
    const props = { setTempShape, tempShape, shapes, setShapes };

    switch (mode) {
      case SHAPE.Rectangle:
        return new RectangleStrategy(props);
      default:
        return new SelectStrategy(props);
    }
  }
}
