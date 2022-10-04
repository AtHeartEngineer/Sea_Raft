import Game from "./Game";

export default class InputHandler {
  game: Game;
  constructor(game: Game) {
    this.game = game;
    window.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "w" ||
        event.key === "ArrowLeft" ||
        event.key === "a" ||
        event.key === "ArrowDown" ||
        event.key === "s" ||
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "Escape" ||
        event.key === " "
      ) {
        if (this.game.input.indexOf(event.key) == -1) {
          this.game.input.push(event.key);
        }
        event.preventDefault();
      }
    });
    window.addEventListener("keyup", (event) => {
      if (this.game.input.indexOf(event.key) > -1) {
        this.game.input.splice(this.game.input.indexOf(event.key), 1);
      }
    });
    this.game.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      this.game.mouse = { x: event.clientX, y: event.clientY };
    });
  }
}
