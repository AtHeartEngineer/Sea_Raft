import { Vector } from "./types";

export function scaleValue(
  value: number,
  from: number[],
  to: number[],
  debug = false
): number {
  const scale = (to[1] - to[0]) / (from[1] - from[0]);
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  const result = capped * scale + to[0];
  if (debug) {
    console.log(`scaleValue(${value}, ${from}, ${to}) = ${result}`);
  }
  return result;
}

export function getDistance(p1: Vector, p2: Vector): number {
  const y = p2.x - p1.x;
  const x = p2.y - p1.y;
  return Math.sqrt(x * x + y * y);
}

export function normalizeVector(vector: Vector): Vector {
  const distance = getDistance({ x: 0, y: 0 }, vector);
  return { x: vector.x / distance, y: vector.y / distance };
}
