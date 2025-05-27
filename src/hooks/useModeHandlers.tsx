import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";
import { useShapeRefState } from "../contexts/ShapeRefContext";
import type { HandlerProps } from "../type/Shape";

export default function useModeHandlers(): HandlerProps {
  const { mode } = useShapeRefState();

  const rectHandlers = useModeRect();
  const selectHandlers = useModeSelect();

  return mode === "RECT" ? rectHandlers : selectHandlers;
}
