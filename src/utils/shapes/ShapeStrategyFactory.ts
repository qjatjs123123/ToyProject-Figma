import type { Mode, Rect } from "../../type/Shape";
import { RectangleStrategy } from "./RectangleStrategy";
import type { ShapeProps } from "./Shape.abstract";

interface ShapeFactoryProps extends ShapeProps<Rect> {
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
      case "Rectangle":
        return new RectangleStrategy(props);
      default:
        return new RectangleStrategy(props);
    }
  }
}
