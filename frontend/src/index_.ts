import "./styles.css";
import Game from "./Game";
import loadShipsFromImages, { loadShipsFromEmojis } from "./support/load";

// Setup Canvas
const game_canvas = document.createElement("canvas");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;
game_canvas.id = "game";
document.body.appendChild(game_canvas);
const game_ctx = game_canvas.getContext("2d");

// Initialize Ship Assets
const ships = loadShipsFromEmojis();

// Initialize Game
const game = new Game(
  game_canvas,
  game_ctx,
  "Player 1",
  {
    w: window.innerWidth,
    h: window.innerHeight,
  },
  ships,
  true,
  true
);

// Handle Resize
window.addEventListener("resize", () => {
  game.resize(window.innerWidth, window.innerHeight);
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
