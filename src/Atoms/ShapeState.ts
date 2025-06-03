/* eslint-disable @typescript-eslint/no-explicit-any */
import { atomWithStorage } from "jotai/utils";

export interface Shape {
  fill: any;
  name: string; 
  stroke:string;
  strokeWidth: number;
}

export const shapeAtom = atomWithStorage<Shape[]>("shapeState", []);
