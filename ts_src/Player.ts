import Game from "./Game";
import Projectile from "./Projectile";
import Renderable, { Ship } from "./support/interfaces";
import emojis, { flags } from "./support/emojis";
import type { Vector, Size } from "./support/types";
import { normalizeVector, scaleValue } from "./support/utils";

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
  mobile: boolean;
  constructor(
    game: Game,
    name: string,
    ship: Ship,
    mobile = false,
    color = "#cc6600",
    position?: Vector
  ) {
    this.game = game;
    this.name = name;
    this.size = { w: 32, h: 32 }; // collision box dimensions
    this.setPosition(position);
    this.color = color;
    this.setShip(ship);
    this.mobile = mobile;
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
    if (this.game.debug) {
      console.log("Player created");
    }
    if (this.game.cheats) {
      this.ammo_interval = 5;
      this.ammo_max = 1000;
      this.shot_interval = 25;
    }
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

    if (this.mobile) {
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
    }

    // Handle Cheats
    if (this.game.cheats) {
      this.ammo = this.ammo_max;
      this.health = 100;
      this.shield = 100;
    }

    // Check if player is shooting
    if (this.game.input.indexOf(" ") > -1) {
      this.shoot();
    }

    // Check if player is dead
    if (this.health <= 0) {
      this.game.endGame();
    }

    if (this.game.debug) {
      const debug_msgs = [
        `Player: x: ${this.position.x}, y: ${this.position.y}, w: ${this.size.w}, h: ${this.size.h}`,
        `ship: ${this.ship.name}, speed_max: ${this.speed_max}px/frame`,
        `ammo: ${this.ammo}`,
        `ammo_max: ${this.ammo_max}, ammo_refill_interval: ${this.ammo_interval}ms`,
      ];
      debug_msgs.forEach((msg) => {
        this.game.debug_msgs.push(msg);
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const i = this.ship;
    ctx.save();
    if (i.element) {
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
    } else {
      ctx.font = `${this.size.h}px Arial`;
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(Math.atan2(this.last_direction.y, this.last_direction.x));
      ctx.fillText(emojis.sailboat, (-1 * this.size.w) / 2, this.size.h / 3);
    }
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

      let direction: Vector;

      // Calculate direction of projectile
      if (this.mobile) {
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
        direction = speed;
      } else {
        // If not mobile, shoot in direction of mouse
        const x_vel = scaleValue(
          this.game.mouse.x - this.game.size.w / 2,
          [-this.game.size.w / 2, this.game.size.w / 2],
          [-1, 1]
        );
        const y_vel = scaleValue(
          this.game.mouse.y - this.game.size.h / 2,
          [-this.game.size.h / 2, this.game.size.h / 2],
          [-1, 1]
        );
        const normalized = normalizeVector({ x: x_vel, y: y_vel });
        direction = {
          x: normalized.x * velocity,
          y: normalized.y * velocity,
        };
      }

      // Create projectile
      const position: Vector = {
        x: this.position.x + (direction.x ? Math.sign(direction.x) : 0),
        y: this.position.y + (direction.y ? Math.sign(direction.y) : 0),
      };
      const projectile = new Projectile(this.game, position, direction);
      this.game.projectiles.push(projectile);
      this.shot_timer = 0;
    }
  }

  setPosition(position?: Vector) {
    this.currect_vector = { x: 0, y: 0 };
    this.last_direction = { x: 0, y: 0 };
    this.position = position
      ? position
      : {
          x: this.game.size.w / 2,
          y: this.game.size.h / 2,
        };
  }
}
