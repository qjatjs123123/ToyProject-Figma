/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom, useAtomValue } from "jotai";
import SideBar from "./SideBar";
import { selectedIdsAtom } from "../Atoms/SelectedId";
import Button from "./Button";
import { ColorPickerButton } from "./ColorPickerButton";
import Input from "./Input";
import { shapeAtom } from "../Atoms/ShapeState";
import { ShapeStrategyFactory } from "../utils/shapes/ShapeStrategyFactory";
import { modeAtom } from "../Atoms/modeState";
import { HistoryManager } from "../utils/history/CommandManager";
import { UpdateHistory } from "../utils/history/UpdateHistory";
import type { ColorResult } from "react-color";
import {
  SHAPE_CONFIG,
  STROKE_WIDTH_LENGTH,
} from "../utils/constants/constants";

export const RightSideBar = () => {
  const selectedIds = useAtomValue(selectedIdsAtom);
  const mode = useAtomValue(modeAtom);
  const [shapes, setShapes] = useAtom(shapeAtom);
  const hasSelection = selectedIds.length > 0;
  const shape = hasSelection
    ? shapes.find(
        (shape: any) => `${shape.name} ${shape.id}` === selectedIds[length - 1]
      )
    : null;
  const shapeStrategy = ShapeStrategyFactory.createShape({
    mode,
    setTempShape: () => {},
    tempShape: null,
    shapes,
    setShapes,
  });

  const handleChangeProps = (value: any, props: string) => {
    selectedIds.forEach((shapeId: string) => {
      const { originData, newData } = shapeStrategy.update(shapeId, {
        [props]: value,
      });

      HistoryManager.log(
        new UpdateHistory({ shapeId, setShapes, originData, newData })
      );
    });
  };

  const handleChangeStrokeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);

    if (
      !shape ||
      isNaN(newValue) ||
      newValue < STROKE_WIDTH_LENGTH.min ||
      newValue > STROKE_WIDTH_LENGTH.max
    )
      return;

    let alpha = 0;
    const value = shape.strokeWidth;

    if (newValue < value) alpha = -1;
    else alpha = +1;

    handleChangeProps(
     shape.strokeWidth + alpha,
      SHAPE_CONFIG.strokeWidth
    );
  };

  return (
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
        <ColorPickerButton
          shape={shape}
          handleChangeColor={(color: ColorResult) => {
            handleChangeProps(color.hex, SHAPE_CONFIG.fill);
          }}
          color={shape?.fill}
        />
      </SideBar.Content>

      <SideBar.SpaceBar />
      <SideBar.Header
        className="paddingSideBar"
        style={{ fontSize: "12px" }}
        content="Stroke"
      />
      <SideBar.Content style={{ paddingLeft: "12px", marginBottom: "10px" }}>
        <ColorPickerButton
          shape={shape}
          handleChangeColor={(color: ColorResult) => {
            handleChangeProps(color.hex, SHAPE_CONFIG.stroke);
          }}
          color={shape?.stroke}
        />

        <SideBar.Header
          style={{
            color: "gray",
            marginTop: "15px",
            marginBottom: "7px",
            fontSize: "10px",
          }}
          content="Weight"
        />
        {shape ? (
          <Input onChange={handleChangeStrokeNum} value={shape?.strokeWidth} />
        ) : (
          <Button className="center relative">
            <div style={{ height: "20px" }} className="center">
              No Selected
            </div>
          </Button>
        )}
      </SideBar.Content>
    </SideBar>
  );
};
