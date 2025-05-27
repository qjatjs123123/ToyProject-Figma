import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";

type Mode = "RECT" | "SELECT";

export default function useModeHandlers(mode: Mode) {
  // 공통 로직

  switch (mode) {
    case "RECT":
      return useModeRect();
    case "SELECT":
      return useModeSelect();
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
