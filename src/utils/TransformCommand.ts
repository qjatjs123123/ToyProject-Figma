
/* eslint-disable @typescript-eslint/no-explicit-any */
export class TransformCommand {
  private setState: React.Dispatch<React.SetStateAction<any[]>>;
  private prevState: any;
  private shapeId: string;
  private node: any;

  constructor(
    setState: React.Dispatch<React.SetStateAction<any[]>>,
    shapeId: string,
    node: any,
  ) {
    this.setState = setState;
    this.shapeId = shapeId;
    this.node = node;
    this.prevState = {};
  }

  execute() {
    this.setState((prevRects) => {
      const newRects = [...prevRects];

      const index = newRects.findIndex((r) => `${r.name} ${r.id}` === this.shapeId);

      if (index !== -1) {
        this.prevState = { ...newRects[index] };
        newRects[index] = this.getNewData(newRects[index], this.node, this.node.className?.toString());
        this.node.scaleX(1);
        this.node.scaleY(1);
      }

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

  getNewData = (obj: any, node: any, className: string) => {
    if (className === "Rect") {
      return {
        ...obj,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * node.scaleX()),
        height: Math.max(5, node.height() * node.scaleY()),
        rotation: node.rotation(),
      };
    } else if (className === "Ellipse") {
      return {
        ...obj,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * node.scaleX()),
        height: Math.max(5, node.height() * node.scaleY()),
        radiusX: Math.abs(obj.radiusX * node.scaleX()),
        radiusY: Math.abs(obj.radiusY * node.scaleY()),
        rotation: node.rotation(),
      };
    }
  };
}
