import type { Rect } from "../../type/Shape";
import type { DownParams, moveParams, Shape } from "./Shape.interface";


export class RectangleStrategy implements Shape<Rect> {
  down(params: DownParams<Rect>): void {
    const { id, startPoint, currentPoint, setter } = params;

    const rectData = {
      id,
      name: "Rectangle",
      type: "shape",
      fill: "#D9D9D9",
      stroke: "#D9D9D9",
      strokeWidth: 5,
      rotation: 0,
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };

    setter(rectData);
  }
  move(params: moveParams<Rect>): void {
    const { origin, startPoint, currentPoint, setter } = params;

    const rectData = {
      ...origin,
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };

    setter(rectData);
  }
  up(): void {
    throw new Error("Method not implemented.");
  }
  dragEnd(): void {
    throw new Error("Method not implemented.");
  }
  transformEnd(): void {
    throw new Error("Method not implemented.");
  }
}
