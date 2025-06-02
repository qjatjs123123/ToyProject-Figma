import { atom } from "jotai";
import { shapeAtom } from "./ShapeState";

export const selectAtomByName = (name: string) =>
  atom((get) => {
    const shapes = get(shapeAtom);
    return shapes.filter((s) => s.name === name);
  });