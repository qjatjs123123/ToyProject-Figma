import { Stage, Layer, Transformer, Rect } from "react-konva";
import { useState } from "react";
import useModeHandlers from "./hooks/useModeHandlers";
import { useAtomValue } from "jotai";
import { rectangleAtom } from "./Atoms/RectangleState";
import { useShapeRefState } from "./contexts/ShapeRefContext";

type Mode = "RECT" | "LINE";

const App = () => {
  const [mode, setMode] = useState<Mode>("SELECT"); // 전역상태?
  const rectangles = useAtomValue(rectangleAtom);
  const { rectRefs, transformerRef, drawingShapeRef } = useShapeRefState();
  const { handleMouseDown, handleMouseMove, handleMouseUp, creatingRect } = useModeHandlers(mode);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>

        {rectangles.map((rect) => (
          <Rect
            {...rect}
            key={`${rect.name} ${rect.id}`}
            id={`${rect.name} ${rect.id}`}
            draggable
            ref={(node) => {
              if (node) {
                rectRefs.current.set(`${rect.name} ${rect.id}`, node);
              }
            }}
          />
        ))}

        {creatingRect && (
          <Rect
            {...creatingRect}
            ref={drawingShapeRef}
            name="rect"
            id="creating"
            draggable={false}
          />
        )}

        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default App;
