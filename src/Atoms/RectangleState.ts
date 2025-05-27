import { atomWithStorage } from "jotai/utils";
import type { RectType } from "../type/Shape";

export const rectangleAtom = atomWithStorage<RectType[]>('rectangleState', []);