/* eslint-disable @typescript-eslint/no-explicit-any */
import { History, type HistoryProps } from "./History.abstract";

interface createHistoryProps extends HistoryProps {
  drawingShapeRef: any;
  setSelectedIds: any;
}

export class CreateHistory extends History {
  private drawingShapeRef;
  private setSelectedIds;

  constructor(props: createHistoryProps) {
    super(props);
    this.drawingShapeRef = props.drawingShapeRef;
    this.setSelectedIds = props.setSelectedIds;
  }
  redo(): void {
    this.setShapes!([...this.shapes!, this.tempShape]);
  }
  undo(): void {
    this.setSelectedIds([]);
    const deleteArr = [...this.shapes!].filter(
      (shapes) =>
        `${shapes.name} ${shapes.id}` !==
        `${this.tempShape.name} ${this.tempShape.id}`
    );

    this.setShapes!(deleteArr);
    this.drawingShapeRef.current = null;
  }
}
