/* eslint-disable @typescript-eslint/no-explicit-any */
import { History, type HistoryProps } from "./history.abstract";

export class UpdateHistory extends History {
  constructor(props: HistoryProps) {
    super(props);

  }
  redo(): void {
    this.setShapes((prevShapes: any) => {
      const newShapes = [...prevShapes];
      const index = newShapes.findIndex((r) => `${r.name} ${r.id}` === this.shapeId);

      if (index !== -1) {
        const updatedShape = {
          ...newShapes[index],
          ...this.newData,
        };

        newShapes[index] = updatedShape;
      }
      return newShapes;
    })
  }
  undo(): void {
    this.setShapes((prevShapes: any) => {
      const newShapes = [...prevShapes];
      const index = newShapes.findIndex((r) => `${r.name} ${r.id}` === this.shapeId);

      if (index !== -1) {
        const updatedShape = {
          ...newShapes[index],
          ...this.originData,
        };

        newShapes[index] = updatedShape;
      }
      return newShapes;
    })
  }
}
