/* eslint-disable @typescript-eslint/no-explicit-any */
import { SketchPicker, type ColorResult } from "react-color";
import { useState } from "react";
import Button from "./Button";

interface ColorPickerButtonProps {
  shape: any;
  handleChangeColor: (color: ColorResult) => void;
  color: string | undefined;
}

export const ColorPickerButton = ({
  shape,
  handleChangeColor,
  color,
}: ColorPickerButtonProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Button
      className="center relative"
      onClick={() => setShowPicker(!showPicker)}
    >
      {shape ? (
        <div className="color-display">
          <div className="color-box" style={{ backgroundColor: color }} />
          <span>{color}</span>
          {showPicker && (
            <div
              style={{
                position: "absolute",
                left: "-235px",
                top: "0",
              }}
            >
              <SketchPicker
                color={shape?.fill}
                onChangeComplete={(color: ColorResult) => {
                  handleChangeColor(color);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ height: "20px" }} className="center">
          No Selected
        </div>
      )}
    </Button>
  );
};
