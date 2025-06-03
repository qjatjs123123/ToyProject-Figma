/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ellipse } from "../../type/Shape";
import { SHAPE, SHAPE_INIT_DATA } from "../constants/constants";
import {
  Shape,
  type DownParams,
  type moveParams,
  type resultParams,
} from "./Shape.abstract";

export class EllipseStrategy extends Shape<Ellipse> {
  down(params: DownParams): void {
    const { selectByNameArr, startPoint, currentPoint, setSelectedIds } =
      params;

    const id = this.shapeMaxID(selectByNameArr);
    const ellipseData = {
      id,
      name: SHAPE.Ellipse,
      type: SHAPE.Ellipse,
      fill: SHAPE_INIT_DATA.ellipse.fill,
      stroke: SHAPE_INIT_DATA.ellipse.stroke,
      strokeWidth: SHAPE_INIT_DATA.ellipse.strokeWidth,
      rotation: SHAPE_INIT_DATA.ellipse.rotation,
      x: (startPoint.x + currentPoint.x) / 2,
      y: (startPoint.y + currentPoint.y) / 2,
      radiusX: Math.abs(currentPoint.x - startPoint.x) / 2,
      radiusY: Math.abs(currentPoint.y - startPoint.y) / 2,
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };

    this.setTempShape(ellipseData as Ellipse);
    setSelectedIds([`${SHAPE.Ellipse} ${id}`]);
  }
  move(params: moveParams): void {
    const { startPoint, currentPoint } = params;
    const ellipseData = {
      ...this.tempShape!,
      x: (startPoint.x + currentPoint.x) / 2,
      y: (startPoint.y + currentPoint.y) / 2,
      radiusX: Math.abs(currentPoint.x - startPoint.x) / 2,
      radiusY: Math.abs(currentPoint.y - startPoint.y) / 2,
      width: Math.abs(currentPoint.x - startPoint.x),
      height: Math.abs(currentPoint.y - startPoint.y),
    };

    this.setTempShape(ellipseData);
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
          radiusX: Math.abs(data.radiusX() * data.scaleX()),
          radiusY: Math.abs(data.radiusY() * data.scaleY()),
          rotation: data.rotation(),
        };

        data.scaleX(1);
        data.scaleY(1);

        newShapes[index] = updatedShape;
        result.newData = updatedShape;
      }

      return newShapes;
    });
    return result;
  }
}
