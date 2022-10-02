import "./styles.css";
import Game from "./Game";
import { Asset } from "./support/interfaces";

import Frigate from "./assets/drawing_frigate.png";
import PirateShip from "./assets/drawing_pirateship.png";
import Raft from "./assets/drawing_raft.png";
import Sailboat from "./assets/drawing_sailboat.png";
// Setup Canvas
const game_canvas = document.createElement("canvas");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;
game_canvas.id = "game";
document.body.appendChild(game_canvas);
const game_ctx = game_canvas.getContext("2d");

function initializeAssets() {
  const assets: Asset[] = [
    {
      name: "raft",
      src: Raft,
      size: { w: 100, h: 40 },
      speed_max: 1,
    },
    {
      name: "sailboat",
      src: Sailboat,
      size: { w: 180, h: 100 },
      speed_max: 4,
    },
    {
      name: "frigate",
      src: Frigate,
      size: { w: 100, h: 40 },
      speed_max: 3,
    },
    {
      name: "pirateship",
      src: PirateShip,
      size: { w: 220, h: 120 },
      speed_max: 4,
    },
  ];

  assets.forEach((asset, index) => {
    const img = new Image();
    img.src = asset.src;
    img.id = asset.name;
    assets[index].element = img;
    document.body.appendChild(img);
    const w = asset.size.w / asset.element.naturalWidth;
    const h = asset.size.h / asset.element.naturalHeight;
    assets[index].scalar = w > h ? h : w;
    img.style.display = "none";
  });

  return assets;
}

// Initialize Ship Assets
const ships = initializeAssets();

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
