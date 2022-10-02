import Game from "./Game";
import Renderable from "./support/interfaces";

export default class UI implements Renderable {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }
  update() {
    // Do nothing
  }

  draw() {
    const ctx = this.game.ctx;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,60,120,1)";
    ctx.shadowBlur = 12;
    ctx.fillText(
      `Score: ${this.game.player.score}     Ammo: ${this.game.player.ammo}`,
      10,
      25,
      250
    );
    ctx.font = "16px Arial";
    ctx.shadowBlur = 0;
    const health = this.game.player.health;
    let health_symbol = "❤️";
    if (health <= 0) {
      health_symbol = "☠️";
    }
    ctx.fillText(`${health_symbol}x${health}`, 10, 50);

    if (this.game.debug) {
      ctx.save();
      ctx.font = "16px Courier New";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.shadowColor = "rgba(0,60,120,0.8)";
      ctx.shadowBlur = 12;
      const debug = [
        `Player: x: ${this.game.player.position.x}, y: ${this.game.player.position.y}, w: ${this.game.player.size.w}, h: ${this.game.player.size.h}`,
        `ship: ${this.game.player.ship.name}, speed_max: ${this.game.player.speed_max}px/frame`,
        `ammo_max: ${this.game.player.ammo_max}, ammo_refill_interval: ${this.game.player.ammo_interval}ms`,
        "",
        `Enemies: ${this.game.enemies.length}`,
        "",
        `Projectiles: ${this.game.projectiles.length}`,
      ];
      debug.forEach((line, index) => {
        ctx.fillText(line, this.game.size.w - 400, 20 + index * 15, 380);
      });
      ctx.restore();
    }
  }
}
