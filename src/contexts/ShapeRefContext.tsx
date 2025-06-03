/* eslint-disable @typescript-eslint/no-explicit-any */
import type Konva from "konva";
import type { Rect } from "konva/lib/shapes/Rect";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { type TempShape } from "../type/shapeReducer";
import { useAtom } from "jotai";
import { selectedIdsAtom } from "../Atoms/SelectedId";

interface ShapeRefContextType {
  rectRefs: RefObject<Map<string, Rect>>;
  tempShape: TempShape | null;
  transformerRef: React.RefObject<Konva.Transformer | null>;
  drawingShapeRef: RefObject<any>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  tempShapeDispatch: React.Dispatch<React.SetStateAction<any>>;
  isCreating: any;
  setIsCreating: any;
}

const ShapeRefContext = createContext<ShapeRefContextType | undefined>(
  undefined
);

export function ShapeRefProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
  const [tempShape, tempShapeDispatch] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const rectRefs = useRef(new Map());
  const transformerRef = useRef<Konva.Transformer>(null);
  const drawingShapeRef = useRef(null);

  useEffect(() => {
    const transformer = transformerRef.current;

    if (!transformer) return;

    if (selectedIds.length === 0) {
      transformer.nodes([]);
      return;
    }

    const nodes = [] as Konva.Node[];

    selectedIds.forEach((id) => {
      let data = null;

      data = rectRefs.current.get(id);

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
        setSelectedIds,
        isCreating,
        setIsCreating,
        tempShape,
        tempShapeDispatch,
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
