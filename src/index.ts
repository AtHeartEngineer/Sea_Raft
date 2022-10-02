import "./styles.css";
import Game from "./Game";
import loadShips from "./support/load";

// Setup Canvas
const game_canvas = document.createElement("canvas");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;
game_canvas.id = "game";
document.body.appendChild(game_canvas);
const game_ctx = game_canvas.getContext("2d");

// Initialize Ship Assets
const ships = loadShips();

// Initialize Game
const game = new Game(
  game_ctx,
  "Player 1",
  {
    w: window.innerWidth,
    h: window.innerHeight,
  },
  ships
);

// Handle Resize
window.addEventListener("resize", () => {
  game_canvas.width = window.innerWidth;
  game_canvas.height = window.innerHeight;
  game.size.w = window.innerWidth;
  game.size.h = window.innerHeight;
});

// Start Game when page is loaded
window.addEventListener("load", function () {
  let lastTime = 0; // Starting Time

  // Animation Loop
  function animate(timestamp: number) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }
  animate(0);
});
