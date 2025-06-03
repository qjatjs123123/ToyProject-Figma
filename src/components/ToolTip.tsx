import "../index.css";
import Button from "./Button";
import SelectIcon from "./SelectIcon";
import RectIcon from "./RectIcon";
import EllipseIcon from "./EllipseIcon";
import { SHAPE } from "../utils/constants/constants";
import { modeAtom } from "../Atoms/modeState";
import { useAtom } from "jotai";

const Tooltip = () => {
  const [mode, setMode] = useAtom(modeAtom);

  const modes = [
    { key: SHAPE.Select, icon: () => <SelectIcon /> },
    { key: SHAPE.Rectangle, icon: (color: string) => <RectIcon color={color} /> },
    { key: SHAPE.Ellipse, icon: (color: string) => <EllipseIcon color={color} /> },
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
