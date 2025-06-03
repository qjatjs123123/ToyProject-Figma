/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Rect } from "../../type/Shape";
import { SHAPE, SHAPE_INIT_DATA } from "../constants/constants";
import {
  Shape,
  type DownParams,
  type moveParams,
  type resultParams,
  type ShapeProps,
} from "./Shape.abstract";

export class RectangleStrategy extends Shape<Rect> {
  constructor(props: ShapeProps<Rect>) {
    super(props);
  }

  down(params: DownParams): void {
    const { selectByNameArr, startPoint, currentPoint, setSelectedIds } =
      params;

    const id = this.shapeMaxID(selectByNameArr);
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
    setSelectedIds([`${SHAPE.Rectangle} ${id}`]);
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

  transformEnd(shapeId: string, data: any): resultParams {
    const result = { originData: null, newData: null } as resultParams;

    this.setShapes((prevShapes: any) => {
      const newShapes = [...prevShapes];
      const index = newShapes.findIndex((r) => `${r.name} ${r.id}` === shapeId);

      if (index !== -1) {
        result.originData = { ...newShapes[index] };

        const updatedShape = {
          ...newShapes[index],
          x: data.x(),
          y: data.y(),
          width: Math.max(5, data.width() * data.scaleX()),
          height: Math.max(5, data.height() * data.scaleY()),
          rotation: data.rotation(),
        };

        data.scaleX(1);
        data.scaleY(1);
        
        newShapes[index] = updatedShape;
        result.newData = updatedShape;
      }

      return newShapes;
    });
    console.log(result);
    return result;
  }
}
