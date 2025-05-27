import { Stage, Layer, Transformer } from "react-konva";
import { useRef, useState } from "react";
import useModeHandlers from "./hooks/useModeHandlers";

type Mode = "RECT" | "LINE";

const App = () => {
  const [mode, setMode] = useState<Mode>("RECT"); // 전역상태?
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useModeHandlers(mode);
  const transformerRef = useRef(null);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
