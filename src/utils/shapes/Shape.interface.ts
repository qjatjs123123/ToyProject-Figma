/* eslint-disable @typescript-eslint/no-explicit-any */
interface Point {
  x: number;
  y: number;
}

export interface DownParams<T> {
  id: number;
  startPoint: Point;
  currentPoint: Point;
  setter: (data: T) => void;
}

export interface moveParams<T> {
  origin: T | null;
  startPoint: Point;
  currentPoint: Point;
  setter: (data: T) => void;
}
export interface Shape<T> {
  down(params: DownParams<T>): void;
  move(params: moveParams<T>): void;
  up(): void;
  dragEnd() : void;
  transformEnd() : void;
}
