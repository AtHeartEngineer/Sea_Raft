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
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(
      `Score: ${this.game.player.score}     Ammo: ${this.game.player.ammo}`,
      10,
      40
    );
  }
}
