/* eslint-disable react-hooks/rules-of-hooks */
import type { HandlerProps } from "../type/Shape";
import useModeRect from "./useModeRect";
import useModeSelect from "./useModeSelect";

type Mode = "RECT" | "SELECT";

export default function useModeHandlers(mode: Mode): HandlerProps {
  switch (mode) {
    case "RECT":
      return useModeRect();
    case "SELECT":
      return useModeSelect();
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
