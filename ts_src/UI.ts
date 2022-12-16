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
    ctx.font = this.game.font;
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,60,120,1)";
    ctx.shadowBlur = 12;
    ctx.fillText(
      `Score: ${this.game.player.score}     Ammo: ${this.game.player.ammo}`,
      10,
      25,
      250
    );
    ctx.font = this.game.font;
    ctx.shadowBlur = 0;
    const health = this.game.player.health;
    let health_symbol = "❤️";
    if (health <= 0) {
      health_symbol = "☠️";
    }
    ctx.fillText(`${health_symbol}x${health}`, 10, 50);

    if (this.game.debug) {
      this.drawDebug();
    }
  }

  drawDebug() {
    const ctx = this.game.ctx;
    ctx.save();
    ctx.font = "16px Courier New";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.shadowColor = "rgba(0,60,120,0.8)";
    ctx.shadowBlur = 12;
    this.game.debug_msgs.forEach((line, index) => {
      ctx.fillText(line, this.game.size.w - 400, 20 + index * 15, 380);
    });
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    const size = 16;
    ctx.fillRect(
      this.game.size.w / 2 - 1,
      this.game.size.h / 2 - size / 2,
      2,
      size
    );
    ctx.fillRect(
      this.game.size.w / 2 - size / 2,
      this.game.size.h / 2 - 1,
      size,
      2
    );
    ctx.fillStyle = "rgba(255,0,0,0.85)";
    ctx.fillRect(
      this.game.player.position.x - 2,
      this.game.player.position.y - 2,
      4,
      4
    );
    ctx.restore();
  }
}
