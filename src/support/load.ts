import { Ship } from "./interfaces";

import Frigate from "../assets/drawing_frigate.png";
import PirateShip from "../assets/drawing_pirateship.png";
import Raft from "../assets/drawing_raft.png";
import Sailboat from "../assets/drawing_sailboat.png";

export default function loadShips() {
  const ships: Ship[] = [
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
  ships.forEach((ship, index) => {
    const img = new Image();
    img.src = ship.src;
    img.id = ship.name;
    ships[index].element = img;
    document.body.appendChild(img);
    const w = ship.size.w / ship.element.naturalWidth;
    const h = ship.size.h / ship.element.naturalHeight;
    ships[index].scalar = w > h ? h : w;
    img.style.display = "none";
  });

  return ships;
}
