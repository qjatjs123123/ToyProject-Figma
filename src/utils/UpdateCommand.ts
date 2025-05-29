export class UpdateCommand {
  constructor(private stateRef, private shapeId, private prevProps, private nextProps) {}

  execute() {
    this.stateRef.current = this.stateRef.current.map((shape) =>
      shape.id === this.shapeId ? { ...shape, ...this.nextProps } : shape
    );
  }

  undo() {
    this.stateRef.current = this.stateRef.current.map((shape) =>
      shape.id === this.shapeId ? { ...shape, ...this.prevProps } : shape
    );
  }
}
