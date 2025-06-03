/* eslint-disable @typescript-eslint/no-explicit-any */
export class CreateCommand {
  private atom: any;
  private setState: any;
  private newAtom: any;
  private drawingShapeRef: any;
  private setter: any;

  constructor(atom: any, setAtom: any, newAtom: any,  drawingShapeRef : any, setter: any) {
    this.atom = atom;
    this.setState = setAtom;
    this.newAtom = newAtom;
    this.drawingShapeRef = drawingShapeRef;
    this.setter = setter;
  }

  execute() {
    this.setState(this.newAtom);
  }

  undo() {
    this.setter([]);
    this.setState(this.atom);
    this.drawingShapeRef.current = null;
  }
}
