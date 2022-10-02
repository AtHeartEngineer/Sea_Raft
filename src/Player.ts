import Game from "./Game";
import Projectile from "./Projectile";
import Renderable, { Ship } from "./support/interfaces";

import type { Vector, Size } from "./support/types";

export default class Player implements Renderable {
  game: Game;
  position: Vector;
  name: string;
  size: Size;
  color: string;
  currect_vector: Vector;
  speed_max: number;
  last_direction: Vector;
  age: number;
  ammo: number;
  ammo_max: number;
  ammo_timer: number;
  ammo_interval: number;
  score: number;
  health: number;
  shield: number;
  shot_timer: number;
  shot_interval: number;
  ship: Ship;
  asset_scalar: { x: number; y: number };
  constructor(
    game: Game,
    name: string,
    ship: Ship,
    position: Vector = { x: 50, y: 50 },
    color = "#cc6600"
  ) {
    this.game = game;
    this.position = position;
    this.name = name;
    this.size = { w: 75, h: 45 }; // collision box dimensions
    this.color = color;
    this.setShip(ship);

    this.currect_vector = { x: 0, y: 0 };
    this.last_direction = { x: 0, y: 0 };
    this.age = 0;
    this.ammo = 20;
    this.ammo_max = 50;
    this.ammo_timer = 0;
    this.ammo_interval = 250;
    this.shot_timer = 0;
    this.shot_interval = 100;
    this.score = 0;
    this.health = 100;
    this.shield = 0;
  }

  setShip(ship: Ship) {
    this.ship = ship;
    this.size = this.ship.size;
    this.speed_max = this.ship.speed_max;
  }

  update(deltaTime: number) {
    // Updates Age
    this.age += deltaTime;
    this.shot_timer += deltaTime;

    // Updates Ammo
    this.ammo_timer += deltaTime;
    if (this.ammo_timer > this.ammo_interval) {
      this.ammo_timer = 0;
      this.ammo = Math.min(this.ammo + 1, this.ammo_max);
    }

    // Handle Input
    // TODO: handle opposing key presses
    if (
      this.game.input.indexOf("ArrowUp") > -1 ||
      this.game.input.indexOf("w") > -1
    ) {
      this.currect_vector.y = -this.speed_max;
    } else if (
      this.game.input.indexOf("ArrowDown") > -1 ||
      this.game.input.indexOf("s") > -1
    ) {
      this.currect_vector.y = this.speed_max;
    } else {
      this.currect_vector.y = 0;
    }

    if (
      this.game.input.indexOf("ArrowLeft") > -1 ||
      this.game.input.indexOf("a") > -1
    ) {
      this.currect_vector.x = -this.speed_max;
    } else if (
      this.game.input.indexOf("ArrowRight") > -1 ||
      this.game.input.indexOf("d") > -1
    ) {
      this.currect_vector.x = this.speed_max;
    } else {
      this.currect_vector.x = 0;
    }

    // Handle Last Direction
    if (
      this.currect_vector.x >= 1 ||
      this.currect_vector.y >= 1 ||
      this.currect_vector.x <= -1 ||
      this.currect_vector.y <= -1
    ) {
      this.last_direction = {
        x: this.currect_vector.x,
        y: this.currect_vector.y,
      };
    }

    // Move Player
    this.position.y += this.currect_vector.y;
    this.position.x += this.currect_vector.x;

    // Check if player is hitting boundaries
    if (this.position.y + this.size.h > this.game.size.h) {
      this.position.y = this.game.size.h - this.size.h;
      this.currect_vector.y = 0;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
      this.currect_vector.y = 0;
    }
    if (this.position.x + this.size.w > this.game.size.w) {
      this.position.x = this.game.size.w - this.size.w;
      this.currect_vector.x = 0;
    }
    if (this.position.x < 0) {
      this.position.x = 0;
      this.currect_vector.x = 0;
    }

    // Check if player is shooting
    if (this.game.input.indexOf(" ") > -1) {
      this.shoot();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const i = this.ship;
    ctx.save();
    ctx.translate(
      this.position.x + (i.scalar * i.element.width) / 2,
      this.position.y + (i.scalar * i.element.height) / 2
    );
    ctx.rotate(Math.atan2(this.last_direction.y, this.last_direction.x));
    ctx.drawImage(
      i.element,
      -(i.scalar * i.element.width) / 2,
      -(i.scalar * i.element.height) / 2,
      i.element.naturalWidth * i.scalar,
      i.element.naturalHeight * i.scalar
    );
    if (this.game.debug) {
      ctx.strokeStyle = "red";
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        0 - this.size.w / 2,
        0 - this.size.h / 2,
        this.size.w,
        this.size.h
      );
    }
    ctx.restore();
  }

  shoot(velocity = 3) {
    if (this.ammo > 0 && this.shot_timer > this.shot_interval) {
      this.ammo--;

      // Calculate direction of projectile
      const speed: Vector = { x: 0, y: 0 };
      if (this.last_direction.x > 0) {
        speed.x = velocity;
      } else if (this.last_direction.x < 0) {
        speed.x = -velocity;
      } else {
        speed.x = 0;
      }
      if (this.last_direction.y > 0) {
        speed.y = velocity;
      } else if (this.last_direction.y < 0) {
        speed.y = -velocity;
      } else {
        speed.y = 0;
      }

      // If no direction, shoot right
      if (speed.x === 0 && speed.y === 0) {
        speed.x = velocity;
      }

      // Create projectile
      const position: Vector = {
        x: this.position.x + this.size.w / 2,
        y: this.position.y + this.size.h / 2,
      };
      const projectile = new Projectile(this.game, position, speed);
      this.game.projectiles.push(projectile);
      this.shot_timer = 0;
    }
  }
}
