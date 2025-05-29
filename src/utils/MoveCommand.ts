/* eslint-disable @typescript-eslint/no-explicit-any */
export class DragMoveCommand {
  private setState: React.Dispatch<React.SetStateAction<any[]>>;
  private prevState: any[] ;
  private shapeId: string;
  private newPos: { x: number; y: number };

  constructor(
    setState: React.Dispatch<React.SetStateAction<any[]>>,
    shapeId: string,
    newPos: { x: number; y: number }
  ) {
    this.setState = setState;
    this.shapeId = shapeId;
    this.newPos = newPos;
    this.prevState = [];
  }

  execute() {
    this.setState((prevRects) => {
      const newRects = [...prevRects];
      this.prevState = [...prevRects];
      const index = newRects.findIndex((r) => `${r.name} ${r.id}` === this.shapeId);
      if (index !== -1) {
        newRects[index] = {
          ...newRects[index],
          x: this.newPos.x,
          y: this.newPos.y,
        };
      }
      return newRects;
    });
  }

  undo() {
    this.setState(this.prevState);
  }
}
