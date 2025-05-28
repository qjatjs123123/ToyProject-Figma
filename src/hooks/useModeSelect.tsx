import { useEffect, useRef, useState } from "react";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import { useAtom } from "jotai";
import { rectangleAtom } from "../Atoms/RectangleState";
import { EllipseAtom } from "../Atoms/EllipseState";

interface ElementProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface SelectRectangleProps {
  visible: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const degToRad = (angle: number) => (angle / 180) * Math.PI;

const getCorner = (
  pivotX: number,
  pivotY: number,
  diffX: number,
  diffY: number,
  angle: number
) => {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  angle += Math.atan2(diffY, diffX);
  const x = pivotX + distance * Math.cos(angle);
  const y = pivotY + distance * Math.sin(angle);
  return { x, y };
};

const getClientRect = (element: ElementProps) => {
  const { x, y, width, height, rotation = 0 } = element;
  const rad = degToRad(rotation);

  const p1 = getCorner(x, y, 0, 0, rad);
  const p2 = getCorner(x, y, width, 0, rad);
  const p3 = getCorner(x, y, width, height, rad);
  const p4 = getCorner(x, y, 0, height, rad);

  const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
  const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
  const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
  const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

const initSelectionRectangleData: SelectRectangleProps = {
  visible: false,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};


export default function useModeSelect() {
  const { ellipseRefs, rectRefs, transformerRef, selectedIds, setSelectedIds } =
    useShapeRefState();
  const [selectionRectangle, setSelectionRectangle] =
    useState<SelectRectangleProps>(initSelectionRectangleData);
  const [rectangles, setRectangles] = useAtom(rectangleAtom);
  const [ellipses, setEllipse] = useAtom(EllipseAtom)
  const isSelecting = useRef(false);

  useEffect(() => {
    if (selectedIds.length && transformerRef.current) {
      const nodes = [];

      selectedIds.forEach((id) => {
        const type = id.split(" ")[0];
        let data = null;

        if (type === "Rectangle") data = rectRefs.current.get(id);
        else data = ellipseRefs.current.get(id);

        if (data) nodes.push(data);
      });
      
      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedIds]);

  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    const id = e.target.id();
    setEllipse((prevRects) => {
      const newRects = [...prevRects];
      const index = newRects.findIndex((r) => `${r.name} ${r.id}` === id);
      if (index !== -1) {
        newRects[index] = {
          ...newRects[index],
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return newRects;
    });
  };

  const handleTransformEnd = (e: KonvaEventObject<MouseEvent>) => {
    const id = e.target.id();
    const node = e.target;

    setEllipse((prevRects) => {
      const newRects = [...prevRects];

      const index = newRects.findIndex((r) => `${r.name} ${r.id}` === id);

      if (index !== -1) {
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        newRects[index] = {
          ...newRects[index],
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          radiusX: Math.abs(newRects[index].radiusX * scaleX),
          radiusY: Math.abs(newRects[index].radiusY * scaleY),
          rotation: node.rotation(),
        };
      }

      return newRects;
    });
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      return;
    }
    if (e.target.getType() !== "Shape") {
      return;
    }


    const clickedId = e.target.id();

    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      setSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      setSelectedIds(selectedIds.filter((id) => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      setSelectedIds([...selectedIds, clickedId]);
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;

    isSelecting.current = true;
    setSelectionRectangle({
      visible: true,
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
    });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isSelecting.current) {
      return;
    }

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setSelectionRectangle({
      ...selectionRectangle,
      x2: pos.x,
      y2: pos.y,
    });

    const selBox = {
      x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
      y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
      width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
      height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
    };

    const selected = [...rectangles, ...ellipses].filter((rect) => {
    
      if (rect.name === 'Ellipse') {
        const ellipseBox = {
          ...rect,
          x : rect.x - rect.radiusX,
          y : rect.y - rect.radiusY,
        }
        return Konva.Util.haveIntersection(selBox, ellipseBox);
      }
      return Konva.Util.haveIntersection(selBox, getClientRect(rect));
    });

    setSelectedIds(selected.map((rect) => `${rect.name} ${rect.id}`));
  };

  const handleMouseUp = () => {
    if (!isSelecting.current) {
      return;
    }
    isSelecting.current = false;

    setTimeout(() => {
      setSelectionRectangle({
        ...selectionRectangle,
        visible: false,
      });
    });
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleDragEnd,
    handleTransformEnd,
    selectionRectangle,
  };
}





// export default function useModeSelect() {
//   const { rectRefs, transformerRef, selectedIds, setSelectedIds } =
//     useShapeRefState();
//   const [selectionRectangle, setSelectionRectangle] =
//     useState<SelectRectangleProps>(initSelectionRectangleData);
//   const [rectangles, setRectangles] = useAtom(rectangleAtom);
//   const isSelecting = useRef(false);

//   useEffect(() => {
//     if (selectedIds.length && transformerRef.current) {
//       const nodes = selectedIds
//         .map((id) => rectRefs.current.get(id))
//         .filter((node) => node != undefined);

//       transformerRef.current.nodes(nodes);
//     } else if (transformerRef.current) {
//       transformerRef.current.nodes([]);
//     }
//   }, [selectedIds]);

//   const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
//     const id = e.target.id();
//     setRectangles((prevRects) => {
//       const newRects = [...prevRects];
//       const index = newRects.findIndex((r) => `${r.name} ${r.id}` === id);
//       if (index !== -1) {
//         newRects[index] = {
//           ...newRects[index],
//           x: e.target.x(),
//           y: e.target.y(),
//         };
//       }
//       return newRects;
//     });
//   };

//   const handleTransformEnd = (e: KonvaEventObject<MouseEvent>) => {
//     const id = e.target.id();
//     const node = e.target;

//     setRectangles((prevRects) => {
//       const newRects = [...prevRects];

//       const index = newRects.findIndex((r) => `${r.name} ${r.id}` === id);

//       if (index !== -1) {
//         const scaleX = node.scaleX();
//         const scaleY = node.scaleY();

//         node.scaleX(1);
//         node.scaleY(1);

//         newRects[index] = {
//           ...newRects[index],
//           x: node.x(),
//           y: node.y(),
//           width: Math.max(5, node.width() * scaleX),
//           height: Math.max(5, node.height() * scaleY),
//           rotation: node.rotation(),
//         };
//       }

//       return newRects;
//     });
//   };

//   const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
//     if (e.target === e.target.getStage()) {
//       setSelectedIds([]);
//       return;
//     }
//     if (!e.target.hasName("Rectangle")) {
//       return;
//     }

//     const clickedId = e.target.id();

//     const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
//     const isSelected = selectedIds.includes(clickedId);

//     if (!metaPressed && !isSelected) {
//       setSelectedIds([clickedId]);
//     } else if (metaPressed && isSelected) {
//       setSelectedIds(selectedIds.filter((id) => id !== clickedId));
//     } else if (metaPressed && !isSelected) {
//       setSelectedIds([...selectedIds, clickedId]);
//     }
//   };

//   const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
//     if (e.target !== e.target.getStage()) {
//       return;
//     }

//     const pos = e.target.getStage().getPointerPosition();
//     if (!pos) return;

//     isSelecting.current = true;
//     setSelectionRectangle({
//       visible: true,
//       x1: pos.x,
//       y1: pos.y,
//       x2: pos.x,
//       y2: pos.y,
//     });
//   };

//   const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
//     if (!isSelecting.current) {
//       return;
//     }

//     const pos = e.target.getStage()?.getPointerPosition();
//     if (!pos) return;

//     setSelectionRectangle({
//       ...selectionRectangle,
//       x2: pos.x,
//       y2: pos.y,
//     });

//     const selBox = {
//       x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
//       y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
//       width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
//       height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
//     };

//     const selected = rectangles.filter((rect) => {
//       return Konva.Util.haveIntersection(selBox, getClientRect(rect));
//     });

//     setSelectedIds(selected.map((rect) => `${rect.name} ${rect.id}`));
//   };

//   const handleMouseUp = () => {
//     if (!isSelecting.current) {
//       return;
//     }
//     isSelecting.current = false;

//     setTimeout(() => {
//       setSelectionRectangle({
//         ...selectionRectangle,
//         visible: false,
//       });
//     });
//   };

//   return {
//     handleMouseDown,
//     handleMouseMove,
//     handleMouseUp,
//     handleStageClick,
//     handleDragEnd,
//     handleTransformEnd,
//     selectionRectangle,
//   };
// }
