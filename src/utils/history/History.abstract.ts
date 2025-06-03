/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HistoryProps {
  tempShape?: any;
  shapes?: any[];
  setShapes: React.Dispatch<React.SetStateAction<any>>;
  shapeId?: string;
  originData? : any;
  newData? : any;
}

export abstract class History {
  protected tempShape;
  protected shapes;
  protected setShapes;
  protected shapeId;
  protected originData;
  protected newData;

  constructor({ tempShape, shapes, setShapes, shapeId, originData, newData }: HistoryProps) {
    this.tempShape = tempShape;
    this.shapes = shapes;
    this.setShapes = setShapes;
    this.shapeId = shapeId;
    this.originData = originData;
    this.newData = newData
  }

  abstract redo(): void;
  abstract undo(): void;
}
