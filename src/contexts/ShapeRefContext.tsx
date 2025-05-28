import type Konva from "konva";
import type { Rect } from "konva/lib/shapes/Rect";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ReactNode, RefObject } from "react";
import { tempShapeReducer } from "./shapeReducer";

type Mode = "RECT" | "SELECT" | "ELLIPSE";

interface ShapeRefContextType {
  rectRefs: RefObject<Map<string, Rect>>;
  ellipseRefs: RefObject<Map<string, Rect>>;
  transformerRef: React.RefObject<Konva.Transformer | null>;
  drawingShapeRef: RefObject<Rect | null>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  mode: Mode;
}

const ShapeRefContext = createContext<ShapeRefContextType | undefined>(
  undefined
);

export function ShapeRefProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("RECT"); // 전역상태?
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tempShape, tempShapeDispatch] = useReducer(tempShapeReducer, null);
  const rectRefs = useRef(new Map());
  const ellipseRefs = useRef(new Map());
  const transformerRef= useRef<Konva.Transformer>(null);
  const drawingShapeRef = useRef(null);

  useEffect(() => {
    console.log(tempShape);
  }, [tempShape]);

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
      else if(type === "Ellipse") data = ellipseRefs.current.get(id);

      if (data) nodes.push(data);
    });

    transformerRef.current?.nodes(nodes);
   
  }, [selectedIds]);

  return (
    <ShapeRefContext.Provider
      value={{
        rectRefs,
        transformerRef,
        selectedIds,
        drawingShapeRef,
        ellipseRefs,
        setSelectedIds,
        setMode,
        tempShape,
        tempShapeDispatch,
        mode,
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
