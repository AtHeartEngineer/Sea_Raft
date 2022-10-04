import Player from "./Player";
import InputHandler from "./InputHandler";
import Environment from "./Environment";
import Layer from "./Layer";
import wave1 from "./assets/wave1";
import Projectile from "./Projectile";

import type { Size, Vector } from "./support/types";
import Renderable, { Ship } from "./support/interfaces";
import UI from "./UI";
import Enemy from "./Enemy";

export default class Game {
  input: string[];
  player: Player;
  environment: Environment;
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
  font: string;
  ui: UI;
  game_time: number;
  game_paused: boolean;
  assets: Ship[];
  debug: boolean;
  mouse: Vector;
  canvas: HTMLCanvasElement;
  debug_msgs: string[];
  cheats: boolean;
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    player_name = "Player 1",
    size: Size,
    assets: Ship[],
    debug = false,
    cheats = false
  ) {
    this.canvas = canvas;
    this.ctx = context;
    this.input_handler = new InputHandler(this);
    this.input = [];
    this.size = size;
    this.environment = new Environment(this, { x: 1, y: 2 });
    this.player = new Player(
      this,
      player_name,
      assets.find((a) => a.name === "raft"),
      false
    );
    this.update_queue = [];
    this.draw_queue = [];
    this.last_timestamp = 0;
    this.game_time = 0;
    this.game_paused = false;
    this.game_over = false;
    this.projectiles = [];
    this.enemies = [];
    this.font = "20px Arial";
    this.ui = new UI(this);
    this.mouse = { x: 0, y: 0 };
    this.assets = assets;
    this.debug = debug;
    this.cheats = cheats;
    this.debug_msgs = ["Debug Messages"];

    //this.bg = new Layer(this, "rgba(0, 100, 220, .78)", 0);
    this.waves = new Layer(
      this,
      "#0066dd",
      (this.size.w * this.size.h) / 25000 /* Wave density */,
      new Path2D(wave1),
      {
        x: 0.25,
        y: 0.25,
      }
    );

    // Update Queue
    this.update_queue.push(this.environment);
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
    this.debug_msgs = [];
    if (!this.game_over && !this.game_paused) {
      const debug_msgs = [
        `Game Time:${this.game_time}`,
        `Projectiles: ${this.projectiles.length}`,
        `Enemies: ${this.enemies.length}`,
        `Center: x: ${this.size.w / 2}, y: ${this.size.h / 2}`,
        `Mouse: x: ${this.mouse.x}, y: ${this.mouse.y}`,
        "",
      ];

      this.debug_msgs.push(...debug_msgs);

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
      this.ctx.save();
      obj.draw(this.ctx);
      this.ctx.restore();
      this.ctx.resetTransform();
    });
    // Draw all projectiles
    this.projectiles.forEach((projectile) => {
      this.ctx.save();
      projectile.draw(this.ctx);
      this.ctx.restore();
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

  resize(innerWidth: number, innerHeight: number) {
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    this.size.w = innerWidth;
    this.size.h = innerHeight;
    this.player.setPosition();
    this.waves.generatePositions();
  }

  endGame() {
    throw new Error("Method not implemented.");
  }
}
