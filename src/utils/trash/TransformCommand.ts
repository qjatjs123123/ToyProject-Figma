
/* eslint-disable @typescript-eslint/no-explicit-any */
export class TransformCommand {
  private setState: React.Dispatch<React.SetStateAction<any[]>>;
  private prevState: any;
  private shapeId: string;
  private node: any;
  private data: any;
  private nextState : any;

  constructor(
    setState: React.Dispatch<React.SetStateAction<any[]>>,
    shapeId: string,
    node: any,
  ) {
    this.setState = setState;
    this.shapeId = shapeId;
    this.node = node;
    this.prevState = {};
    this.nextState = null;
    this.data = {}
  }

  execute() {
    if (this.nextState) {
      this.setState(this.nextState);
      return;
    }

    this.setState((prevRects) => {
      const newRects = [...prevRects];

      const index = newRects.findIndex((r) => `${r.name} ${r.id}` === this.shapeId);

      if (index !== -1) {
        this.prevState = { ...newRects[index] };
        
        this.data = {
          x : this.node.x(),
          y : this.node.y(),
          rotation: this.node.rotation(),
          width : this.node.width(),
          height : this.node.height(),
          scaleX: this.node.scaleX(),
          scaleY : this.node.scaleY(),
        }


        newRects[index] = this.getNewData(newRects[index], this.node.className?.toString());
        
        this.node.scaleX(1);
        this.node.scaleY(1);
      }
      if (!this.nextState) this.nextState = newRects;
      return newRects;
    });

  }

  undo() {
    this.setState((prevRects) => {
      const newRects = [...prevRects];
      const index = newRects.findIndex(
        (r) => `${r.name} ${r.id}` === this.shapeId
      );

      if (index !== -1) {
        newRects[index] = { ...this.prevState };
      }

      return newRects;
    });
  }

  //  getNewData = (obj: any, node: any, className: string) => {
  //   if (className === "Rect") {
  //     return {
  //       ...obj,
  //       x: node.x(),
  //       y: node.y(),
  //       width: Math.max(5, node.width() * node.scaleX()),
  //       height: Math.max(5, node.height() * node.scaleY()),
  //       rotation: node.rotation(),
  //     };
  //   } else if (className === "Ellipse") {
  //     return {
  //       ...obj,
  //       x: node.x(),
  //       y: node.y(),
  //       width: Math.max(5, node.width() * node.scaleX()),
  //       height: Math.max(5, node.height() * node.scaleY()),
  //       radiusX: Math.abs(obj.radiusX * node.scaleX()),
  //       radiusY: Math.abs(obj.radiusY * node.scaleY()),
  //       rotation: node.rotation(),
  //     };
  //   }
  // };

  getNewData = (obj: any, className: string) => {
    if (className === "Rect") {
      return {
        ...obj,
        x: this.data.x,
        y: this.data.y,
        width: Math.max(5, this.data.width * this.data.scaleX),
        height: Math.max(5, this.data.height * this.data.scaleY),
        rotation: this.data.rotation,
      };
    } else if (className === "Ellipse") {
      return {
        ...obj,
        x: this.data.x,
        y: this.data.y,
        width: Math.max(5, this.data.width * this.data.scaleX),
        height: Math.max(5, this.data.height * this.data.scaleY),
        radiusX: Math.abs(obj.radiusX * this.data.scaleX),
        radiusY: Math.abs(obj.radiusY * this.data.scaleY),
        rotation: this.data.rotation,
      };
    }
  };
}
