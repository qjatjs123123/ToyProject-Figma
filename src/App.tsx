import { Stage, Layer, Transformer, Rect, Ellipse } from "react-konva";
import useModeHandlers from "./hooks/useModeHandlers";
import { useAtom, useAtomValue } from "jotai";
import { rectangleAtom } from "./Atoms/RectangleState";
import { useShapeRefState } from "./contexts/ShapeRefContext";
import { EllipseAtom } from "./Atoms/EllipseState";
import Tooltip from "./components/ToolTip";
import SideBar from "./components/SideBar";
import RectIcon from "./components/RectIcon";
import EllipseIcon from "./components/EllipseIcon";
import Button from "./components/Button";
import { SketchPicker } from "react-color";
import { useEffect, useState } from "react";
import Input from "./components/Input";
import { CommandManager } from "./utils/CommandManager";
import { UpdateCommand } from "./utils/UpdateCommand";
import { SHAPE } from "./utils/constants/constants";
type ShapeName = "Rectangle" | "Ellipse";

const shapeItemMap: Record<ShapeName, (color: string) => React.ReactElement> = {
  Rectangle: (color: string) => <RectIcon color={color} />,
  Ellipse: (color: string) => <EllipseIcon color={color} />,
};

const App = () => {
  const [rectangles, setRectangles] = useAtom(rectangleAtom);
  const [ellipses, setEllipses] = useAtom(EllipseAtom);
  const [showPicker, setShowPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const {
    ellipseRefs,
    rectRefs,
    transformerRef,
    drawingShapeRef,
    selectedIds,
    tempShape,
    setSelectedIds,
    getShapeObject,
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
  console.log(mode, SHAPE.Select,tempShape);
  const handleChangeColor = (selectedColor, shape) => {
    CommandManager.init();
    CommandManager.isBatching = true;
    selectedIds.forEach((id: string) => {
      const shape = getShapeObject(id)[0];
      if (shape.name === "Ellipse") {
        const command = new UpdateCommand(
          setEllipses,
          { ...shape },
          { ...shape, fill: selectedColor.hex },
          ellipses
        );
        CommandManager.execute(command);
      } else if (shape.name === "Rectangle") {
        const command = new UpdateCommand(
          setRectangles,
          { ...shape },
          { ...shape, fill: selectedColor.hex },
          rectangles
        );
        CommandManager.execute(command);
      }
    });
    setTimeout(() => {
      CommandManager.isBatching = false;
    }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        CommandManager.undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        CommandManager.redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChangeSrokeColor = (selectedColor, shape) => {
    CommandManager.init();
    CommandManager.isBatching = true;
    selectedIds.forEach((id: string) => {
      const shape = getShapeObject(id)[0];
      if (shape.name === "Ellipse") {
        const command = new UpdateCommand(
          setEllipses,
          { ...shape },
          { ...shape, stroke: selectedColor.hex },
          ellipses
        );
        CommandManager.execute(command);
      } else if (shape.name === "Rectangle") {
        const command = new UpdateCommand(
          setRectangles,
          { ...shape },
          { ...shape, stroke: selectedColor.hex },
          rectangles
        );
        CommandManager.execute(command);
      }
    });
    setTimeout(() => {
      CommandManager.isBatching = false;
    }, 0);
  };

  const handleChangeStrokeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    const shape = getShapeObject(selectedIds[selectedIds.length - 1])[0];

    if (isNaN(newValue) || newValue <= 4 || newValue >= 51) return;

    let alpha = 0;
    const value = shape.strokeWidth;

    if (newValue < value) alpha = -1;
    else alpha = +1;

    CommandManager.init();
    CommandManager.isBatching = true;
    selectedIds.forEach((id: string) => {
      const shape = getShapeObject(id)[0];
      if (shape.name === "Ellipse") {
        const command = new UpdateCommand(
          setEllipses,
          { ...shape },
          { ...shape, strokeWidth: shape.strokeWidth + alpha },
          ellipses
        );
        CommandManager.execute(command);
      } else if (shape.name === "Rectangle") {
        const command = new UpdateCommand(
          setRectangles,
          { ...shape },
          { ...shape, strokeWidth: shape.strokeWidth + alpha },
          rectangles
        );
        CommandManager.execute(command);
      }
    });
    setTimeout(() => {
      CommandManager.isBatching = false;
    }, 0);
  };

  return (
    <>
      <SideBar className="leftSideBarLayout flex_col">
        <SideBar.Header content="제목1" type="big" className="paddingSideBar" />
        <SideBar.SpaceBar />
        <SideBar.Header
          content="Shapes"
          style={{ marginTop: "10px", marginBottom: "10px" }}
          className="paddingSideBar paddingSideBarMedium"
        />
        <SideBar.SpaceBar />
        <SideBar.Content className="overflow-y">
          {[...rectangles, ...ellipses].map(({ name, id }) => (
            <div
              key={`${name} ${id}`}
              onClick={() => setSelectedIds([...selectedIds, `${name} ${id}`])}
              className={`shape-item${
                selectedIds.includes(`${name} ${id}`) ? " primary" : ""
              }`}
            >
              {shapeItemMap[name as ShapeName]("black")}
              <span>
                {name} {id}
              </span>
            </div>
          ))}
        </SideBar.Content>
      </SideBar>

      <SideBar className="rightSideBarLayout flex_col">
        <SideBar.Header
          className="paddingSideBar"
          content={<Button className="btnPad">Design</Button>}
        />
        <SideBar.SpaceBar />
        <SideBar.Header
          className="paddingSideBar"
          content={
            selectedIds.length === 1
              ? selectedIds[0].split(" ")[0]
              : `${selectedIds.length} selected`
          }
        />
        <SideBar.SpaceBar />
        <SideBar.Header
          className="paddingSideBar"
          style={{ fontSize: "12px" }}
          content="Position"
        />
        <SideBar.SpaceBar />
        <SideBar.Header
          className="paddingSideBar"
          style={{ fontSize: "12px" }}
          content="Fill"
        />
        <SideBar.Content style={{ paddingLeft: "12px", marginBottom: "10px" }}>
          <Button
            className="center relative"
            onClick={() => setShowPicker(!showPicker)}
          >
            {selectedIds.length > 0 ? (
              (() => {
                const shape = getShapeObject(
                  selectedIds[selectedIds.length - 1]
                )[0];
                const fillColor = shape?.fill || "";

                return (
                  <div className="color-display">
                    <div
                      className="color-box"
                      style={{ backgroundColor: fillColor }}
                    />
                    <span>{fillColor}</span>
                    {showPicker && (
                      <div
                        style={{
                          position: "absolute",
                          left: "-235px",
                          top: "0",
                        }}
                      >
                        <SketchPicker
                          color={fillColor}
                          onChangeComplete={(color) =>
                            handleChangeColor(color, shape)
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div style={{ height: "20px" }} className="center">
                No Selected
              </div>
            )}
          </Button>
        </SideBar.Content>

        <SideBar.SpaceBar />
        <SideBar.Header
          className="paddingSideBar"
          style={{ fontSize: "12px" }}
          content="Stroke"
        />
        <SideBar.Content style={{ paddingLeft: "12px", marginBottom: "10px" }}>
          <Button
            className="center relative"
            onClick={() => setShowStrokePicker(!showStrokePicker)}
          >
            {selectedIds.length > 0 ? (
              (() => {
                const shape = getShapeObject(
                  selectedIds[selectedIds.length - 1]
                )[0];
                const strokeColor = shape?.stroke || "";

                return (
                  <div className="color-display">
                    <div
                      className="color-box"
                      style={{ backgroundColor: strokeColor }}
                    />
                    <span>{strokeColor}</span>
                    {showStrokePicker && (
                      <div
                        style={{
                          position: "absolute",
                          left: "-235px",
                          top: "0",
                        }}
                      >
                        <SketchPicker
                          color={strokeColor}
                          onChangeComplete={(color) =>
                            handleChangeSrokeColor(color, shape)
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div style={{ height: "20px" }} className="center">
                No Selected
              </div>
            )}
          </Button>
          <SideBar.Header
            style={{
              color: "gray",
              marginTop: "15px",
              marginBottom: "7px",
              fontSize: "10px",
            }}
            content="Weight"
          />
          {selectedIds.length > 0 ? (
            <Input
              onChange={handleChangeStrokeNum}
              value={
                getShapeObject(selectedIds[selectedIds.length - 1])[0]
                  ?.strokeWidth ?? ""
              }
            />
          ) : (
            <Button className="center relative">
              <div style={{ height: "20px" }} className="center">
                No Selected
              </div>
            </Button>
          )}
        </SideBar.Content>
      </SideBar>

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
                selectedIds.includes(`${rect.name} ${rect.id}`)
                  ? "#80D0FF"
                  : rect.stroke
              }
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
              rotation={rect.rotation}
              draggable={true}
            />
          ))}

          {tempShape && mode === SHAPE.Rectangle && (
            <Rect {...tempShape} ref={drawingShapeRef} draggable={true} />
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
                  : ellipse.stroke
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
            <Ellipse {...tempShape} ref={drawingShapeRef} draggable={false} />
          )}

          {mode === SHAPE.Select && tempShape && tempShape.visible && (
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
    </>
  );
};

export default App;
