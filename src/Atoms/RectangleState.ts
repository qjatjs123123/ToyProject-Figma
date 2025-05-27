import { atomWithStorage } from "jotai/utils";
import type { RectType } from "../type/Shape";
import { atom } from "jotai";

export const rectangleAtom = atomWithStorage<RectType[]>("rectangleState", []);

export const rectangleMaxID = atom((get) => {
  const rectangles = get(rectangleAtom);

  const maxID = rectangles.reduce((max, rect) => {
    return Math.max(max, rect.id);
  }, 1);

  return maxID + 1;
});
