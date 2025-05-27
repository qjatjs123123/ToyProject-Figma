import { atomWithStorage } from "jotai/utils";
import type { EllipseType } from "../type/Shape";
import { atom } from "jotai";

export const EllipseAtom = atomWithStorage<EllipseType[]>("EllipseState", []);


// 공통 로직
export const EllipseMaxID = atom((get) => {
  const ellipse = get(EllipseAtom);

  const maxID = ellipse.reduce((max, rect) => {
    return Math.max(max, rect.id);
  }, 1);

  return maxID + 1;
});
