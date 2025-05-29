import "../index.css";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import Button from "./Button";
import SelectIcon from "./SelectIcon";
import RectIcon from "./RectIcon";
import EllipseIcon from "./EllipseIcon";

const Tooltip = () => {
  const { setMode, mode } = useShapeRefState();

  const modes = [
    { key: "SELECT", icon: () => <SelectIcon /> },
    { key: "RECT", icon: (color: string) => <RectIcon color={color} /> },
    { key: "ELLIPSE", icon: (color: string) => <EllipseIcon color={color} /> },
  ] as const;

  return (
    <div className="fixed bottom-[50px] left-1/2 -translate-x-1/2 z-50 flex gap-5">
      {modes.map(({ key, icon }) => {
        const isActive = mode === key;
        const color = isActive ? "white" : "black";

        return (
          <Button
            key={key}
            className={isActive ? "primary" : ""}
            onClick={() => setMode(key)}
          >
            {icon(color)}
          </Button>
        );
      })}
    </div>
  );
};

export default Tooltip;
