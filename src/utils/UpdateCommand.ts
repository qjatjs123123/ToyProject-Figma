/* eslint-disable @typescript-eslint/no-explicit-any */
export class UpdateCommand {
  private atom: any;
  private setState: any;
  private origin: any;
  private newValue: any;

  constructor(setAtom: any, origin: any, newValue: any, atom: any) {
    this.atom = atom;
    this.setState = setAtom;
    this.origin = origin;
    this.newValue = newValue;
  }

  execute() {
    this.setState((prev) =>
      prev.map((item) => (item.id === this.newValue.id ? this.newValue : item))
    );
  }

  undo() {
    this.setState((prev) =>
      prev.map((item) => (item.id === this.origin.id ? this.origin : item))
    );
  }
}
