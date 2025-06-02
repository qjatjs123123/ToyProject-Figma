/* eslint-disable @typescript-eslint/no-explicit-any */
interface Point {
  x: number;
  y: number;
}

export interface DownParams {
  selectByNameArr: any[];
  startPoint: Point;
  currentPoint: Point;
  setSelectedIds: (data: any) => void;
}

export interface moveParams<> {
  startPoint: Point;
  currentPoint: Point;
}

export interface ShapeProps<T> {
  setShapes: (data: any) => void;
  shapes: any[];
  setTempShape: (data: T) => void;
  tempShape: T | null;
}

export abstract class Shape<T> {
  protected setTempShape;
  protected tempShape;
  protected shapes;
  protected setShapes;

  constructor({ setShapes, shapes, setTempShape, tempShape }: ShapeProps<T>) {
    this.setShapes = setShapes;
    this.shapes = shapes;
    this.setTempShape = setTempShape;
    this.tempShape = tempShape;
  }

  abstract down(params: DownParams): void;
  abstract move(params: moveParams): void;

  protected up() {
    this.setShapes([...this.shapes, this.tempShape]);
  }

  protected shapeMaxID = (rectArr: any[]) => {
    const maxID = rectArr.reduce((max, rect) => {
      return Math.max(max, rect.id);
    }, 1);

    return maxID + 1;
  };

  dragEnd(): void {
    // 선택적으로 공통 구현 가능
  }

  transformEnd(): void {
    // 선택적으로 공통 구현 가능
  }
}
