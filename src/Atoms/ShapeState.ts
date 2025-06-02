import { atomWithStorage } from "jotai/utils";

export interface Shape {
  name: string; 
}

export const shapeAtom = atomWithStorage<Shape[]>("shapeState", []);
