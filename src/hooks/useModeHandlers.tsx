/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { EllipseType, Mode } from "../type/Shape";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef } from "react";
import { rectangleAtom, shapeAllData } from "../Atoms/RectangleState";
import { useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { EllipseAtom } from "../Atoms/EllipseState";
import type {
  EllipseShape,
  RectShape,
  SelectionBox,
} from "../contexts/shapeReducer";
import { DragMoveCommand } from "../utils/MoveCommand";
import { CommandManager } from "../utils/CommandManager";
// import { useProxy } from "./useProxy";
import { TransformCommand } from "../utils/TransformCommand";
import { useProxy } from "./useProxy";
import { CreateCommand } from "../utils/CreateCommand";

interface ElementProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
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

const mappingTable = {
  RECT: "Rectangle",
  ELLIPSE: "Ellipse",
};

export default function useModeHandlers() {
  const {
    selectedIds,
    setSelectedIds,
    setMode,
    tempShape,
    tempShapeDispatch,
    mode,
    isCreating,
    setIsCreating,
    drawingShapeRef,
  } = useShapeRefState();

  const startPoint = useRef<any>({ x: 0, y: 0 });
  const shapeAll = useAtomValue(shapeAllData);
  const [rectangles, setRectangles] = useAtom(rectangleAtom);
  const [ellipses, setEllipses] = useAtom(EllipseAtom);
  // const [rectanglesP, setRectanglesP] = useProxy(useAtom(rectangleAtom));
  // const [ellipsesP, setEllipsesP] = useProxy(useAtom(EllipseAtom));
  const isDragging = useRef(false);
  const isBatching = useRef(false);
  const setterFunc = {
    Rect: setRectangles,
    Ellipse: setEllipses,
  };
  const batchTimeout = useRef<number | null>(null);
  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (isDragging.current) {
      return;
    }

    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
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
    if (e.target !== e.target.getStage()) return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    setIsCreating(true);
    startPoint.current = pos;

    tempShapeDispatch({
      type: mode,
      data: {
        startPoint: startPoint.current,
        pos,
        maxID: shapeMaxID(mode),
        visible: true,
        select: {
          name: "select",
          visible: true,
          x1: pos.x,
          y1: pos.y,
          x2: pos.x,
          y2: pos.y,
        },
      },
    });

    if (mode !== "SELECT")
      setSelectedIds([`${mappingTable[mode]} ${shapeMaxID(mode)}`]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isCreating) {
      return;
    }

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (startPoint.current) isDragging.current = true;

    tempShapeDispatch({
      type: mode,
      data: {
        startPoint: startPoint.current,
        pos,
        visible: true,
        select: {
          ...tempShape,
          x2: pos.x,
          y2: pos.y,
        },
      },
    });

    handleSelectShapesByDrag();
  };

  const handleTransformEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!isBatching.current) {
      isBatching.current = true;
      CommandManager.isBatching = true;
      CommandManager.init();
    }

    const id = e.target.id();
    const className = e.target.className?.toString() as keyof typeof setterFunc;

    if (!className || !(className in setterFunc)) return;

    const command = new TransformCommand(setterFunc[className], id, e.target);
    CommandManager.execute(command);

    batchTimeout.current = setTimeout(() => {
      isBatching.current = false;
      CommandManager.isBatching = false;
      batchTimeout.current = null;
    }, 0);
  };

  // const getNewData = (obj: any, node: any, className: string) => {
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

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    startPoint.current = null;
    if (!isCreating) {
      return;
    }
    if (
      tempShape &&
      "width" in tempShape &&
      (tempShape.height < 5 || tempShape.width < 5)
    )
      return;
    setIsCreating(false);

    if (
      mode === "RECT" &&
      (tempShape as { name: string }).name === "Rectangle"
    ) {
      const command = new CreateCommand(
        [...rectangles],
        setRectangles,
        [...rectangles, tempShape as RectShape],
        drawingShapeRef,
        setSelectedIds
      );
      CommandManager.execute(command);
    } else if (mode === "ELLIPSE") {
      const command = new CreateCommand(
        [...ellipses],
        setEllipses,
        [...ellipses, tempShape as EllipseShape],
        drawingShapeRef,
        setSelectedIds
      );
      CommandManager.execute(command);
    }

    setMode("SELECT");
    tempShapeDispatch({
      type: "INIT",
      data: null as any,
    });
    selectShapesByDrageInit(e);
  };

  const selectShapesByDrageInit = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setTimeout(() => {
      isDragging.current = false;
    }, 10);
  };
  const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    if (!isBatching.current) {
      isBatching.current = true;
      CommandManager.isBatching = true;
      CommandManager.init();
    }

    const id = e.target.id();
    const className = e.target.className?.toString() as keyof typeof setterFunc;
    if (!className || !(className in setterFunc)) return;

    const newPos = { x: e.target.x(), y: e.target.y() };

    const command = new DragMoveCommand(setterFunc[className], id, newPos);
    CommandManager.execute(command);

    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current);
    }

    batchTimeout.current = setTimeout(() => {
      isBatching.current = false;
      CommandManager.isBatching = false;
      batchTimeout.current = null;
      console.log(CommandManager.isBatching, isBatching.current);
    }, 0);
  };
  // const handleDragEnd = (e: KonvaEventObject<MouseEvent>) => {
  //   const id = e.target.id();
  //   const className = e.target.className?.toString() as keyof typeof setterFunc;

  //   if (!className || !(className in setterFunc)) return;

  //   setterFunc[className]((prevRects: any) => {
  //     const newRects = [...prevRects];
  //     const index = newRects.findIndex((r) => `${r.name} ${r.id}` === id);
  //     if (index !== -1) {
  //       newRects[index] = {
  //         ...newRects[index],
  //         x: e.target.x(),
  //         y: e.target.y(),
  //       };
  //     }
  //     return newRects;
  //   });
  // };

  const handleSelectShapesByDrag = () => {
    if (mode !== "SELECT") return;

    const selBox = {
      x: Math.min(
        (tempShape as SelectionBox).x1,
        (tempShape as SelectionBox).x2
      ),
      y: Math.min(
        (tempShape as SelectionBox).y1,
        (tempShape as SelectionBox).y2
      ),
      width: Math.abs(
        (tempShape as SelectionBox).x2 - (tempShape as SelectionBox).x1
      ),
      height: Math.abs(
        (tempShape as SelectionBox).y2 - (tempShape as SelectionBox).y1
      ),
    };

    const selected = [...rectangles, ...ellipses].filter((rect) => {
      if (rect.name === "Ellipse") {
        const e = rect as EllipseType;
        const ellipseBox = {
          ...rect,
          x: rect.x - e.radiusX,
          y: rect.y - e.radiusY,
        };
        return Konva.Util.haveIntersection(selBox, ellipseBox);
      } else if (rect.name === "Rectangle") {
        return Konva.Util.haveIntersection(selBox, getClientRect(rect));
      }
    });

    setSelectedIds(selected.map((rect) => `${rect.name} ${rect.id}`));
  };

  const shapeMaxID = (mode: Mode) => {
    const maxID = shapeAll[mode].reduce((max, rect) => {
      return Math.max(max, rect.id);
    }, 1);

    return maxID + 1;
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleDragEnd,
    handleTransformEnd,
  };
}
