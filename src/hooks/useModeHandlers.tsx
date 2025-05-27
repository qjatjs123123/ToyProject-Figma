import useModeRect from "./useModeRect";

type Mode = 'RECT' | 'LINE'

export default function useModeHandlers(mode: Mode) {
  // 공통 로직
  

  switch (mode) {
    case "RECT":
      return useModeRect();
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
