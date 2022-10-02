import { Vector, Size } from "./types";

export default interface Renderable {
  position?: Vector;
  size?: Size;
  update(deltaTime?: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Asset {
  name: string;
  src: string;
  element?: HTMLImageElement;
  size?: Size;
  scalar?: number;
  speed_max?: number;
}
