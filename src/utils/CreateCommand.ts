export class CreateCommand {
  constructor(private stateRef, private newShape) {}

  execute() {
    this.stateRef.current = [...this.stateRef.current, this.newShape];
  }

  undo() {
    this.stateRef.current = this.stateRef.current.filter(
      (shape) => shape.id !== this.newShape.id
    );
  }
}
