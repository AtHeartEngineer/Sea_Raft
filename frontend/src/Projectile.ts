import Game from "./Game";
import Renderable from "./support/interfaces";
import type { Vector, Size } from "./support/types";

export default class Projectile implements Renderable {
  game: Game;
  size: Size;
  position: Vector;
  vector: Vector;
  color: string;
  out_of_play: boolean;
  age: number;
  damage: number;
  constructor(
    game: Game,
    position: Vector,
    speed: Vector,
    damage = 10,
    color = "#333",
    size: Size = { w: 3, h: 3 }
  ) {
    this.game = game;
    this.size = size;
    this.position = position;
    this.vector = speed;
    this.damage = damage;
    this.color = color;
    this.out_of_play = false;
    this.age = 0;
  }

  update(deltaTime: number) {
    this.age += deltaTime;
    this.position.y += this.vector.y;
    this.position.x += this.vector.x;
    if (
      this.position.x < 0 ||
      this.position.x > this.game.size.w ||
      this.position.y < 0 ||
      this.position.y > this.game.size.h
    ) {
      this.out_of_play = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.out_of_play) {
      return;
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
}
