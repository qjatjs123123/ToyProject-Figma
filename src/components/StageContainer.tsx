/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stage, Layer, Transformer, Rect, Ellipse } from "react-konva";
import { useAtomValue } from "jotai";
import { modeAtom } from "../Atoms/modeState";
import { shapeAtom } from "../Atoms/ShapeState";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import useModeHandlers from "../hooks/useModeHandlers";
import { SHAPE } from "../utils/constants/constants";

const shapeComponentMap = {
  Rectangle: Rect,
  Ellipse: Ellipse,
  // 필요 시 추가 가능
} satisfies Record<string, React.ElementType>;

type ShapeName = keyof typeof shapeComponentMap;

const StageContainer = () => {
  const mode = useAtomValue(modeAtom);
  const shapes = useAtomValue(shapeAtom);
  const { rectRefs, transformerRef, drawingShapeRef, selectedIds, tempShape } =
    useShapeRefState();
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleStageClick,
    handleDragEnd,
    handleTransformEnd,
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
        {shapes.map((shape: any) => {
          const key = `${shape.name} ${shape.id}`;
          const ShapeComponent = shapeComponentMap[shape.name as ShapeName];

          if (!ShapeComponent) return null;

          return (
            <ShapeComponent
              key={key}
              {...shape}
              id={key}
              ref={(node: any) => {
                if (node) {
                  rectRefs.current.set(key, node);
                }
              }}
              stroke={selectedIds.includes(key) ? "#80D0FF" : shape.stroke}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
              rotation={shape.rotation}
              draggable={true}
              radiusX={shape.radiusX}
              radiusY={shape.radiusY}
            />
          );
        })}

        {tempShape &&
          tempShape.type === "Rectangle" &&
          mode === SHAPE.Rectangle && (
            <Rect {...tempShape} id="" ref={drawingShapeRef} draggable={true} />
          )}

        {tempShape &&
          tempShape.type === "Ellipse" &&
          mode === SHAPE.Ellipse && (
            <Ellipse
              {...tempShape}
              id=""
              ref={drawingShapeRef}
              draggable={false}
            />
          )}

        {mode === SHAPE.Select &&
          tempShape &&
          tempShape.type === "Select" &&
          tempShape.visible && (
            <Rect
              x={Math.min(tempShape.x1, tempShape.x2)}
              y={Math.min(tempShape.y1, tempShape.y2)}
              width={Math.abs(tempShape.x2 - tempShape.x1)}
              height={Math.abs(tempShape.y2 - tempShape.y1)}
              fill={tempShape.fill}
              stroke={tempShape.stroke}
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

export default StageContainer;
