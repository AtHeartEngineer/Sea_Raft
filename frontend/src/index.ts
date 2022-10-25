const s = require("./styles.css");

const game_canvas = document.createElement("canvas");
game_canvas.width = window.innerWidth;
game_canvas.height = window.innerHeight;
game_canvas.id = "game";
document.body.appendChild(game_canvas);

window.addEventListener("resize", () => {
  game_canvas.width = window.innerWidth;
  game_canvas.height = window.innerHeight;
});

import init, { start } from "sea-raft";
init().then(() => {
  start();
});
