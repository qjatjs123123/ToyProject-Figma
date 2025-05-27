import { Stage, Layer, Rect, Transformer } from "react-konva";
import { useRef, useState } from "react";
import useModeHandlers from "./hooks/useModeHandlers";
import type { KonvaEventObject } from "konva/lib/Node";

type Mode = "RECT" | "LINE";

const App = () => {
  const [mode, setMode] = useState<Mode>("RECT"); // 전역상태?
  const { handleMouseDown } = useModeHandlers(mode);
  const transformerRef = useRef(null);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
    >
      <Layer>
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
