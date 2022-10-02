import Renderable from "./support/interfaces";
import { Size, Vector } from "./support/types";

export default class Enemy implements Renderable {
  position: Vector;
  size: Size;
  speed: Vector;
  health: number;
  shield: number;
  out_of_play: boolean;
  age: number;
  wreck_damage: number;
  damage: number;
  constructor(
    position: Vector,
    size: Size,
    speed: Vector = { x: 0, y: 0 },
    health = 100,
    shield = 100,
    damage = 10,
    wreck_damage = 20
  ) {
    this.position = position;
    this.size = size;
    this.speed = speed;
    this.health = health;
    this.shield = shield;
    this.age = 0;
    this.damage = damage;
    this.wreck_damage = wreck_damage;
    this.out_of_play = false;
  }
  update(deltaTime: number): void {
    this.age += deltaTime;
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
  }
}
