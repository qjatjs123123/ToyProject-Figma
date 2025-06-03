/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HistoryProps {
  tempShape?: any;
  shapes: any[];
  setShapes: (shapes: any[]) => void;
  shapeId?: string
}

export abstract class History {
  protected tempShape;
  protected shapes;
  protected setShapes;
  protected shapeId;

  constructor({ tempShape, shapes, setShapes, shapeId }: HistoryProps) {
    this.tempShape = tempShape;
    this.shapes = shapes;
    this.setShapes = setShapes;
    this.shapeId = shapeId;
  }

  abstract redo(newData: any): void;
  abstract undo(): void;
}
