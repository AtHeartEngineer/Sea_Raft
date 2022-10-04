import Game from "./Game";
import Renderable from "./support/interfaces";

import type { CoordinateArray, Vector } from "./support/types";
import { getDistance } from "./support/utils";

export default class Layer implements Renderable {
  game: Game;
  path: Path2D;
  color: string;
  count: number;
  scale: Vector;
  positions: CoordinateArray;
  max_closeness: number;
  update_interval: number;
  update_timer: number;

  constructor(
    game: Game,
    color = "#0066cc",
    count?: number,
    path?: Path2D,
    scale?: Vector,
    max_closeness = 0.05
  ) {
    this.game = game;
    this.path = path;
    this.color = color;
    this.count = count;
    this.scale = scale;
    this.max_closeness = max_closeness; // 5% of the screen width/height
    this.positions = [];
    this.update_interval = 250;
    this.update_timer = 0;
    this.generatePositions();
  }

  addPosition(position?: Vector): void {
    let satisfied = false;
    while (!satisfied) {
      if (position) {
        satisfied = true;
        break;
      }
      const range = Math.max(this.game.size.w, this.game.size.h);
      const max_closeness = range * this.max_closeness;
      const x = Math.random() * range;
      const y = Math.random() * range;
      if (x > this.game.size.w || y > this.game.size.h) {
        continue;
      }
      const new_position: Vector = { x: x, y: y };
      let too_close = false;
      this.positions.forEach((_position) => {
        if (too_close == false) {
          const distance = getDistance(_position, new_position);
          if (distance < max_closeness) {
            too_close = true;
          }
        }
      });
      if (!too_close) {
        position = new_position;
        satisfied = true;
      }
    }
    this.positions.push(position);
  }

  generatePositions(): void {
    if (this.count == 0) {
      return;
    } else if (this.count == 1) {
      this.addPosition();
    } else if (this.count > 1) {
      let count = this.count;
      this.positions = [];
      while (count) {
        this.addPosition();
        count--;
      }
    }
  }

  update(deltaTime: number): void {
    this.update_timer += deltaTime;
    this.game.debug_msgs.push(`Waves: ${this.positions.length}`);
    if (this.update_timer > this.update_interval) {
      this.update_timer = 0;
      this.positions.forEach((position, index) => {
        position.x += this.game.environment.current.x;
        position.y += this.game.environment.current.y;

        // Remove if off screen
        if (
          position.x > this.game.size.w ||
          position.x < 0 ||
          position.y > this.game.size.h ||
          position.y < 0
        ) {
          this.positions.splice(index, 1);
        }
      });

      // Add positions if needed
      while (this.positions.length < this.count) {
        console.log("Adding position ", this.positions.length);
        this.addPosition();
      }
    }
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
