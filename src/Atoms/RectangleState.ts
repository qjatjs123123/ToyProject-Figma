import { atomWithStorage } from "jotai/utils";
import type { RectType } from "../type/Shape";
import { atom } from "jotai";
import { EllipseAtom } from "./EllipseState";

export const rectangleAtom = atomWithStorage<RectType[]>("rectangleState", []);

export const rectangleMaxID = atom((get) => {
  const rectangles = get(rectangleAtom);

  const maxID = rectangles.reduce((max, rect) => {
    return Math.max(max, rect.id);
  }, 1);

  return maxID + 1;
});

export const shapeAllData = atom((get) => {
  const rectangles = get(rectangleAtom);
  const ellipses = get(EllipseAtom);

  return {
    "RECT" : rectangles,
    "ELLIPSE": ellipses,
    "SELECT": []
  }
});
