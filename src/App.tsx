import { Stage, Layer, Transformer, Rect } from "react-konva";
import { useState } from "react";
import useModeHandlers from "./hooks/useModeHandlers";
import { useAtomValue } from "jotai";
import { rectangleAtom } from "./Atoms/RectangleState";
import { useShapeRefState } from "./contexts/ShapeRefContext";

type Mode = "RECT" | "SELECT";

const App = () => {
  const [mode, setMode] = useState<Mode>("SELECT"); // 전역상태?
  const rectangles = useAtomValue(rectangleAtom);
  const { rectRefs, transformerRef, drawingShapeRef } = useShapeRefState();
  const { handleMouseDown, handleMouseMove, handleMouseUp, creatingRect, selectionRectangle } = useModeHandlers(mode);

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

        { (selectionRectangle && selectionRectangle.visible) && (
          <Rect
            x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
            y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
            width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
            height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
            fill="rgba(40, 108, 255, 0.36)"
            stroke="#80D0FF"
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
