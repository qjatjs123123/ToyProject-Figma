import "../index.css";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import Button from "./Button";
import SelectIcon from "./SelectIcon";
import RectIcon from "./RectIcon";
import EllipseIcon from "./EllipseIcon";

const modes = [
  { key: "SELECT", label: "선택" },
  { key: "RECT", label: "사각형" },
  { key: "ELLIPSE", label: "타원" },
] as const;

const Tooltip = () => {
  const { setMode, mode } = useShapeRefState();

  return (
    <div className="fixed bottom-[50px] left-1/2 -translate-x-1/2 z-50 flex gap-5">
      <Button className="primary">
        <SelectIcon />
      </Button>
      <Button className="primary">
        <RectIcon color='white'/>
      </Button>
      <Button className="primary">
        <EllipseIcon color='black'/>
      </Button>
    </div>
  );
};

export default Tooltip;
