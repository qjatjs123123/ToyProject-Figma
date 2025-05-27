import './App.css'
import { Stage, Layer, Transformer, Rect } from "react-konva";
import useModeHandlers from "./hooks/useModeHandlers";
import { useAtomValue } from "jotai";
import { rectangleAtom } from "./Atoms/RectangleState";
import { useShapeRefState } from "./contexts/ShapeRefContext";

const App = () => {
  const rectangles = useAtomValue(rectangleAtom);
  const { rectRefs, transformerRef, drawingShapeRef, selectedIds } =
    useShapeRefState();
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleDragEnd,
    handleTransformEnd,
    creatingRect,
    selectionRectangle,
  } = useModeHandlers();

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
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
            stroke={
              selectedIds.includes(`${rect.name} ${rect.id}`) ? "#80D0FF" : ""
            }
            onDragEnd={handleDragEnd}
            onTransformEnd={handleTransformEnd}
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

        {selectionRectangle && selectionRectangle.visible && (
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
