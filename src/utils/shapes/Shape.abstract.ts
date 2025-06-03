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
  setSelectedIds: (data: any) => void;
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
  private prevState: any;

  constructor({ setShapes, shapes, setTempShape, tempShape }: ShapeProps<T>) {
    this.setShapes = setShapes;
    this.shapes = shapes;
    this.setTempShape = setTempShape;
    this.tempShape = tempShape;
  }

  abstract down(params: DownParams): void;
  abstract move(params: moveParams): void;

  public up() {
    this.setShapes([...this.shapes, this.tempShape]);
  }

  protected shapeMaxID = (rectArr: any[]) => {
    const maxID = rectArr.reduce((max, rect) => {
      return Math.max(max, rect.id);
    }, 1);

    return maxID + 1;
  };

  dragEnd(shapeId : string, currentPoint: Point): void {
    this.setShapes((prevShapes : any) => {
      const newRects = [...prevShapes];
      const index = newRects.findIndex(
        (r) => `${r.name} ${r.id}` === shapeId
      );

      if (index !== -1) {
        this.prevState = { ...newRects[index] };
        newRects[index] = {
          ...newRects[index],
          x: currentPoint.x,
          y: currentPoint.y,
        };
      }

      return newRects;
    });
  }

  transformEnd(): void {
    // 선택적으로 공통 구현 가능
  }
}
