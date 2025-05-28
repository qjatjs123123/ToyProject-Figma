
import { Stage, Layer, Transformer, Rect, Ellipse } from "react-konva";
import useModeHandlers from "./hooks/useModeHandlers";
import { useAtomValue } from "jotai";
import { rectangleAtom } from "./Atoms/RectangleState";
import { useShapeRefState } from "./contexts/ShapeRefContext";
import { EllipseAtom } from "./Atoms/EllipseState";
import Tooltip from "./components/ToolTip";

const App = () => {
  const rectangles = useAtomValue(rectangleAtom);
  const ellipses = useAtomValue(EllipseAtom);
  const {
    ellipseRefs,
    rectRefs,
    transformerRef,
    drawingShapeRef,
    selectedIds,
    tempShape,
    mode,
  } = useShapeRefState();
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleDragEnd,
    handleTransformEnd,
  } = useModeHandlers();


  return (
    <>
      <Tooltip />
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
              rotation={rect.rotation}
              draggable={true}
            />
          ))}

          {tempShape && mode === "RECT" && (
            <Rect
              {...tempShape}
              ref={drawingShapeRef}
              draggable={true}
            />
          )}

          {ellipses.map((ellipse) => (
            <Ellipse
              key={`${ellipse.name} ${ellipse.id}`}
              id={`${ellipse.name} ${ellipse.id}`}
              x={ellipse.x}
              y={ellipse.y}
              radiusX={ellipse.radiusX}
              radiusY={ellipse.radiusY}
              fill={ellipse.fill}
              stroke={
                selectedIds.includes(`${ellipse.name} ${ellipse.id}`)
                  ? "#80D0FF"
                  : ""
              }
              strokeWidth={ellipse.strokeWidth}
              ref={(node) => {
                if (node) {
                  ellipseRefs.current.set(
                    `${ellipse.name} ${ellipse.id}`,
                    node
                  );
                }
              }}
              draggable={true}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
              rotation={ellipse.rotation}
            />
          ))}

          {tempShape && mode === "ELLIPSE" && (
            <Ellipse
              {...tempShape}
              ref={drawingShapeRef}
              draggable={false}
            />
          )}

          {mode === "SELECT" && tempShape && tempShape.visible && (
            <Rect
              x={Math.min(tempShape.x1, tempShape.x2)}
              y={Math.min(tempShape.y1, tempShape.y2)}
              width={Math.abs(tempShape.x2 - tempShape.x1)}
              height={Math.abs(tempShape.y2 - tempShape.y1)}
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
    </>
  );
};

export default App;
