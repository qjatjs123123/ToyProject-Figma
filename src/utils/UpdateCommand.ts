/* eslint-disable @typescript-eslint/no-explicit-any */
export class UpdateCommand {
  private atom : any;
  private setState: any;
  private shapeId: string;
  private isCreateing: boolean;

  constructor(atom: any, shapeId: string ,setAtom: any) {
    this.atom = atom;
    this.setState = setAtom;
    this.shapeId = shapeId;
    this.isCreateing = false;
  }

  execute() {
    this.setState((prevRects) => {
      const newRects = [...prevRects];

      const index = newRects.findIndex((r) => `${r.name} ${r.id}` === this.shapeId);

      if (index !== -1) {

      } else {
        this.isCreateing = true;
        
      }
    })

  }

  undo() {

  }
}
