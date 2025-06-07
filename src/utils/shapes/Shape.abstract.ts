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
  setShapes: React.Dispatch<React.SetStateAction<any>>;
  shapes: any[];
  setTempShape: (data: T) => void | null;
  tempShape: T | null;
}

export interface resultParams {
  originData: any;
  newData: any;
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

  public up() {
    this.setShapes([...this.shapes, this.tempShape]);
  }

  protected shapeMaxID = (rectArr: any[]) => {
    const maxID = rectArr.reduce((max, rect) => {
      return Math.max(max, rect.id);
    }, 1);

    return maxID + 1;
  };

  dragEnd(shapeId: string, currentPoint: Point): resultParams {
    const result = { originData: null, newData: null } as resultParams;

    this.setShapes((prevShapes: any) => {
      const newShapes = [...prevShapes];
      const index = newShapes.findIndex((r) => `${r.name} ${r.id}` === shapeId);

      if (index !== -1) {
        result.originData = { ...newShapes[index] };

        const updatedShape = {
          ...newShapes[index],
          x: currentPoint.x,
          y: currentPoint.y,
        };

        newShapes[index] = updatedShape;
        result.newData = updatedShape;
      }

      return newShapes;
    });

    return result;
  }

  update(shapeId: string, updateProps: any): resultParams {
    const result = { originData: null, newData: null } as resultParams;

    this.setShapes((prevShapes: any) => {
      const newShapes = [...prevShapes];
      const index = newShapes.findIndex((r) => `${r.name} ${r.id}` === shapeId);

      if (index !== -1) {
        result.originData = { ...newShapes[index] };

        const updatedShape = {
          ...newShapes[index],
          ...updateProps,
        };

        newShapes[index] = updatedShape;
        result.newData = updatedShape;
      }

      return newShapes;
    });

    return result;
  }

  abstract transformEnd(shapeId: string, data: any): resultParams;
}
