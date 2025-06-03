import type { Rect } from "../../type/Shape";
import { SHAPE, SHAPE_INIT_DATA } from "../constants/constants";
import {
  Shape,
  type DownParams,
  type moveParams,
  type ShapeProps,
} from "./Shape.abstract";


export class RectangleStrategy extends Shape<Rect> {
  constructor(props: ShapeProps<Rect>) {
    super(props);
  }

  down(params: DownParams): void {
    const { selectByNameArr, startPoint, currentPoint,setSelectedIds } = params;

    const id = this.shapeMaxID(selectByNameArr)
    const rectData = {
      id,
      name: SHAPE.Rectangle,
      type: "shape",
      fill: SHAPE_INIT_DATA.rectangle.fill,
      stroke: SHAPE_INIT_DATA.rectangle.stroke,
      strokeWidth: SHAPE_INIT_DATA.rectangle.strokeWidth,
      rotation: SHAPE_INIT_DATA.rectangle.rotation,
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };

    this.setTempShape(rectData);
    setSelectedIds([`${SHAPE.Rectangle} ${id}`])
  }
  move(params: moveParams): void {
    const { startPoint, currentPoint } = params;

    const rectData = {
      ...this.tempShape!,
      x: Math.min(startPoint.x, currentPoint.x),
      y: Math.min(startPoint.y, currentPoint.y),
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };

    this.setTempShape(rectData);
  }

  dragEnd(): void {
    throw new Error("Method not implemented.");
  }
  transformEnd(): void {
    throw new Error("Method not implemented.");
  }
}
