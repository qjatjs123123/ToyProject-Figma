/* eslint-disable @typescript-eslint/no-explicit-any */
import type Konva from "konva";
import type { Rect } from "konva/lib/shapes/Rect";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode, RefObject } from "react";
import {
  type TempShape,
} from "./shapeReducer";
import { useAtom, useAtomValue } from "jotai";
import { SHAPE } from "../utils/constants/constants";
import type { Mode } from "../type/Shape";
import { shapeAtom } from "../Atoms/ShapeState";
import { selectedIdsAtom } from "../Atoms/SelectedId";

interface ShapeRefContextType {
  rectRefs: RefObject<Map<string, Rect>>;
  ellipseRefs: RefObject<Map<string, Rect>>;
  tempShape: TempShape | null;
  transformerRef: React.RefObject<Konva.Transformer | null>;
  drawingShapeRef: RefObject<Rect | null>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  tempShapeDispatch: React.Dispatch<React.SetStateAction<any>>;
  mode: Mode;
  isCreating: any;
  setIsCreating: any;
  getShapeObject: any;
}

const ShapeRefContext = createContext<ShapeRefContextType | undefined>(
  undefined
);

export function ShapeRefProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
  const [tempShape, tempShapeDispatch] = useState();
  const [isCreating, setIsCreating] = useState(false);
  const shapes = useAtomValue(shapeAtom);
  const rectRefs = useRef(new Map());
  const ellipseRefs = useRef(new Map());
  const transformerRef = useRef<Konva.Transformer>(null);
  const drawingShapeRef = useRef(null);

  const getShapeObject = (id: string) => {
    const type = id.split(" ")[0];
    const num = id.split(" ")[1];

    if (type === "Rectangle")
      return shapes.filter((item : any) => item.id === Number(num));
    else if (type === "Ellipse")
      return shapes.filter((item: any) => item.id === Number(num));
    return null;
  };

  useEffect(() => {
    const transformer = transformerRef.current;

    if (!transformer) return;

    if (selectedIds.length === 0) {
      transformer.nodes([]);
      return;
    }

    const nodes = [] as Konva.Node[];

    selectedIds.forEach((id) => {
      const type = id.split(" ")[0];
      let data = null;

      if (type === "Rectangle") data = rectRefs.current.get(id);
      else if (type === "Ellipse") data = ellipseRefs.current.get(id);

      if (data) nodes.push(data);
    });

    if (isCreating && drawingShapeRef.current) {
      transformerRef.current?.nodes([drawingShapeRef.current]);
    } else {
      transformerRef.current?.nodes(nodes);
    }
  }, [selectedIds, isCreating]);

  return (
    <ShapeRefContext.Provider
      value={{
        rectRefs,
        transformerRef,
        selectedIds,
        drawingShapeRef,
        ellipseRefs,
        setSelectedIds,
        isCreating,
        setIsCreating,
        tempShape,
        tempShapeDispatch,
        getShapeObject,
      }}
    >
      {children}
    </ShapeRefContext.Provider>
  );
}

export const useShapeRefState = () => {
  const context = useContext(ShapeRefContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
