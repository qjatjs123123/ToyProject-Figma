/* eslint-disable @typescript-eslint/no-explicit-any */
import { History, type HistoryProps } from "./history.abstract";

export class CreateHistory extends History {
  constructor(props: HistoryProps) {
    super(props)
  }
  redo(): void {
    this.setShapes!([...this.shapes!, this.tempShape]);
  }
  undo(): void {
    const deleteArr = [...this.shapes!].filter((shapes) => `${shapes.name} ${shapes.id}` !== `${this.tempShape.name} ${this.tempShape.id}`)

    this.setShapes!(deleteArr);
  }
}
