import type { Mode } from "../../type/Shape";
import { RectangleStrategy } from "./RectangleStrategy";

export class ShapeStrategyFactory {

  static createShape(mode : Mode) {
    switch (mode) {
      case 'Rectangle':
        return new RectangleStrategy();
      default:
        return new RectangleStrategy();
    }
  }
}