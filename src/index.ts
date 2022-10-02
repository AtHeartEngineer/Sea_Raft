import "./styles.css";
import Game from "./Game";
import { Asset } from "./support/interfaces";

import Boat from "./assets/boat.svg";
import Raft from "./assets/raft.svg";
import Ship from "./assets/ship.png";

// Setup Canvas
const game_canvas = document.createElement("canvas");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;
game_canvas.id = "game";
document.body.appendChild(game_canvas);
const game_ctx = game_canvas.getContext("2d");

function initializeAssets() {
  const assets: Asset[] = [
    { name: "boat", src: Boat, element: undefined },
    { name: "raft", src: Raft, element: undefined },
    { name: "ship", src: Ship, element: undefined },
  ];

  assets.forEach((asset, index) => {
    const img = new Image();
    img.src = asset.src;
    img.id = asset.name;
    img.style.display = "none";
    assets[index].element = img;
    document.body.appendChild(img);
  });

  return assets;
}

// Initialize Assets
const assets = initializeAssets();

// Initialize Game
const game = new Game(
  game_ctx,
  "Player 1",
  {
    w: window.innerWidth,
    h: window.innerHeight,
  },
  assets
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
