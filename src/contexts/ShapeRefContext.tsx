import type Konva from "konva";
import type { Rect } from "konva/lib/shapes/Rect";
import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";

interface ShapeRefContextType {
  rectRefs: RefObject<Map<string, Rect>>;
  transformerRef: React.RefObject<Konva.Transformer | null>;
  drawingShapeRef : RefObject<Rect | null>;
  selectedIds: string[],
  setSelectedIds: (ids: string[]) => void;
}

const ShapeRefContext = createContext<ShapeRefContextType | undefined>(undefined);

export function ShapeRefProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const rectRefs = useRef(new Map());
  const transformerRef = useRef(null);
  const drawingShapeRef = useRef(null);

  return (
    <ShapeRefContext.Provider value={{ rectRefs, transformerRef, selectedIds, drawingShapeRef, setSelectedIds }}>
      {children}
    </ShapeRefContext.Provider>
  );
}

export const useShapeRefState = () => {
  const context = useContext(ShapeRefContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}