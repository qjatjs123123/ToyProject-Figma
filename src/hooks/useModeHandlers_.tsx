import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { HandlerProps } from "../type/Shape";
import useModeEllipse from "./useModeEllipse";

export default function useModeHandlers(): HandlerProps {
  const { mode } = useShapeRefState();

  const rectHandlers = useModeRect();
  const selectHandlers = useModeSelect();
  const ellipseHandlers = useModeEllipse();

  switch (mode) {
    case "RECT":
      return rectHandlers
    case "ELLIPSE":
      return ellipseHandlers
    default:
      return selectHandlers
  }
}
