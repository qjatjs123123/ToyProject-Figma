/* eslint-disable @typescript-eslint/no-explicit-any */
export class CreateCommand {
  private atom: any;
  private setState: any;
  private newAtom: any;

  constructor(atom: any, setAtom: any, newAtom: any) {
    this.atom = atom;
    this.setState = setAtom;
    this.newAtom = newAtom;
  }

  execute() {
    this.setState(this.newAtom);
  }

  undo() {
    this.setState(this.atom);
  }
}
