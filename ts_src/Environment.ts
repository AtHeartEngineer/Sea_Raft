import Game from "./Game";
import Renderable from "./support/interfaces";
import { Vector } from "./support/types";
import { normalizeVector } from "./support/utils";

export default class Environment implements Renderable {
  game: Game;
  current: Vector;
  current_interval: number;
  current_strength: number;
  current_counter: number;
  current_volatility: number;
  wind: { x: number; y: number };
  constructor(
    game: Game,
    current: Vector,
    current_strength = 1,
    current_volatility = 0.1,
    current_interval = 500,
    current_counter = 0
  ) {
    this.game = game;
    this.current = normalizeVector(current); //direction of the water current
    this.current_strength = current_strength; //strength of the water current
    this.current_volatility = current_volatility; //how much the current can change
    this.current_interval = current_interval; //how often the current changes
    this.current_counter = current_counter; //how long since the current changed
    this.wind = { x: 0, y: 0 }; //direction of the wind
  }
  update(timeDelta: number) {
    //update the current
    this.current_counter += timeDelta;
    if (this.current_counter > this.current_interval) {
      this.current_counter = 0;
      const shift = {
        x: (Math.random() - 0.5) * this.current_volatility,
        y: (Math.random() - 0.5) * this.current_volatility,
      };
      this.current.x += shift.x;
      this.current.y += shift.y;
      this.current = normalizeVector(this.current);
    }
    this.game.debug_msgs.push(`Current: ${this.current.x}, ${this.current.y}`);
  }

  draw() {
    //nothing to draw
  }
}
