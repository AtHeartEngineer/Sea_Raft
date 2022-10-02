import Game from "./Game";
import Renderable from "./support/interfaces";

import type { CoordinateArray, Vector } from "./support/types";

export default class Layer implements Renderable {
  game: Game;
  path: Path2D;
  color: string;
  count: number;
  scale: Vector;
  positions: CoordinateArray;

  constructor(
    game: Game,
    color = "#0066cc",
    count?: number,
    path?: Path2D,
    scale?: Vector
  ) {
    this.game = game;
    this.path = path;
    this.color = color;
    this.count = count;
    this.scale = scale;
    this.positions = [];
    this.generatePositions();
  }

  generatePositions(): void {
    if (this.count == 0) {
      return;
    } else if (this.count == 1) {
      this.positions[0] = {
        x: Math.random() * this.game.size.w,
        y: Math.random() * this.game.size.h,
      };
    } else if (this.count > 1) {
      let count = this.count;
      this.positions = [];
      while (count) {
        this.positions.push({
          x: Math.floor(Math.random() * this.game.size.w),
          y: Math.floor(Math.random() * this.game.size.h),
        });
        count--;
      }
    }
  }

  update(): void {
    // TODO
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.path) {
      this.positions.forEach((position) => {
        ctx.translate(position.x, position.y);
        if (this.scale) {
          ctx.scale(this.scale.x, this.scale.y);
        }
        ctx.fillStyle = this.color;
        ctx.fill(this.path);
        ctx.resetTransform();
      });
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, this.game.size.w, this.game.size.h);
    }
  }
}
