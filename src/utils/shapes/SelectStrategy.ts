/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Select } from "../../type/Shape";
import {
  Shape,
  type DownParams,
  type moveParams,
  type ShapeProps,
} from "./Shape.abstract";
import { SHAPE, SHAPE_INIT_DATA } from "../constants/constants";
import Konva from "konva";

export class SelectStrategy extends Shape<Select> {
  constructor(props: ShapeProps<Select>) {
    super(props);
  }
  down(params: DownParams): void {
    const { currentPoint } = params;

    const selectData = {
      name: SHAPE.Select,
      visible: true,
      x1: currentPoint.x,
      y1: currentPoint.y,
      x2: currentPoint.x,
      y2: currentPoint.y,
      fill: SHAPE_INIT_DATA.select.fill,
      stroke: SHAPE_INIT_DATA.select.stroke,
    } as Select;

    this.setTempShape(selectData);
  }
  move(params: moveParams): void {
    const { currentPoint, setSelectedIds } = params;

    const rectData = {
      ...this.tempShape!,
      x2: currentPoint.x,
      y2: currentPoint.y,
    };

    this.setTempShape(rectData);

    setSelectedIds(this.getInterSectionShapesID());
  }

  public up(): void {
    return;
  }
  getInterSectionShapesID = () => {
    const selBox = this.getSelBox();

    return [...this.shapes]
      .filter((shape) => {
        switch (shape.name) {
          case SHAPE.Rectangle:
            return Konva.Util.haveIntersection(
              selBox,
              this.getClientRect(shape)
            );
          case SHAPE.Ellipse:
            return Konva.Util.haveIntersection(
              selBox,
              this.getClientEllipse(shape)
            );
          default:
            throw new Error("s");
        }
      })
      .map((shape) => `${shape.name} ${shape.id}`);
  };

  getSelBox = () => {
    return {
      x: Math.min(this.tempShape!.x1, this.tempShape!.x2),
      y: Math.min(this.tempShape!.y1, this.tempShape!.y2),
      width: Math.abs(this.tempShape!.x2 - this.tempShape!.x1),
      height: Math.abs(this.tempShape!.y2 - this.tempShape!.y1),
    };
  };

  degToRad = (angle: number) => (angle / 180) * Math.PI;

  getCorner = (
    pivotX: number,
    pivotY: number,
    diffX: number,
    diffY: number,
    angle: number
  ) => {
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    angle += Math.atan2(diffY, diffX);
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);
    return { x, y };
  };

  getClientEllipse = (element: any) => {
    return {
      ...element,
      x: element.x - element.radiusX,
      y: element.y - element.radiusY,
    };
  };

  getClientRect = (element: any) => {
    const { x, y, width, height, rotation = 0 } = element;
    const rad = this.degToRad(rotation);

    const p1 = this.getCorner(x, y, 0, 0, rad);
    const p2 = this.getCorner(x, y, width, 0, rad);
    const p3 = this.getCorner(x, y, width, height, rad);
    const p4 = this.getCorner(x, y, 0, height, rad);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };
}
