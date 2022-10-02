import Player from "./Player";
import InputHandler from "./InputHandler";
import Layer from "./Layer";
import wave1 from "./assets/wave1";
import Projectile from "./Projectile";

import type { Size } from "./support/types";
import Renderable, { Ship } from "./support/interfaces";
import UI from "./UI";
import Enemy from "./Enemy";

export default class Game {
  input: string[];
  player: Player;
  input_handler: InputHandler;
  size: Size;
  ctx: CanvasRenderingContext2D;
  update_queue: Renderable[];
  draw_queue: Renderable[];
  last_timestamp: number;
  game_over: boolean;
  waves: Layer;
  bg: Layer;
  projectiles: Projectile[];
  enemies: Enemy[];
  ui: UI;
  game_time: number;
  game_paused: boolean;
  assets: Ship[];
  debug: boolean;
  constructor(
    context: CanvasRenderingContext2D,
    player_name = "Player 1",
    size: Size,
    assets: Ship[]
  ) {
    this.player = new Player(
      this,
      player_name,
      assets.find((a) => a.name === "raft")
    );
    this.input_handler = new InputHandler(this);
    this.input = [];
    this.size = size;
    this.ctx = context;
    this.update_queue = [];
    this.draw_queue = [];
    this.last_timestamp = 0;
    this.game_time = 0;
    this.game_paused = false;
    this.game_over = false;
    this.projectiles = [];
    this.enemies = [];
    this.ui = new UI(this);
    this.assets = assets;
    this.debug = true;

    //this.bg = new Layer(this, "rgba(0, 100, 220, .78)", 0);
    this.waves = new Layer(this, "#0066dd", 17, new Path2D(wave1), {
      x: 0.25,
      y: 0.25,
    });

    // Update Queue
    this.update_queue.push(this.waves);
    this.update_queue.push(this.player);

    // Draw Queue
    //this.draw_queue.push(this.bg)
    this.draw_queue.push(this.waves);
    this.draw_queue.push(this.player);
    this.ctx.save();
    this.draw_queue.push(this.ui);
    this.ctx.restore();
  }

  // tick
  update(deltaTime: number) {
    if (!this.game_over && !this.game_paused) {
      this.game_time += deltaTime;

      // Update all objects in the update queue
      this.update_queue.forEach((obj) => obj.update(deltaTime));

      // Update all Enemies
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
        if (this.checkCollisions(this.player, enemy)) {
          enemy.out_of_play = true;
          this.player.health -= enemy.wreck_damage;
          this.projectiles.forEach((projectile) => {
            if (this.checkCollisions(enemy, projectile)) {
              projectile.out_of_play = true;
              if (enemy.shield > 0) {
                enemy.shield -= projectile.damage;
              } else {
                enemy.health -= projectile.damage;
              }
              if (enemy.health <= 0) {
                enemy.out_of_play = true;
              }
            }
          });
        }
      });

      // Update projectiles
      this.projectiles.forEach((projectile) => projectile.update(deltaTime));

      // remove out of play projectiles
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.out_of_play
      );
    }
  }

  draw() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.size.w, this.size.h);
    // Draw all objects in the draw queue
    this.draw_queue.forEach((obj) => {
      obj.draw(this.ctx);
      this.ctx.resetTransform();
    });
    // Draw all projectiles
    this.projectiles.forEach((projectile) => {
      projectile.draw(this.ctx);
      this.ctx.resetTransform();
    });
  }

  checkCollisions(rect1: Renderable, rect2: Renderable) {
    return (
      rect1.position.x < rect2.position.x + rect2.size.w &&
      rect1.position.x + rect1.size.w > rect2.position.x &&
      rect1.position.y < rect2.position.y + rect2.size.h &&
      rect1.position.y + rect1.size.h > rect2.position.y
    );
  }
}
