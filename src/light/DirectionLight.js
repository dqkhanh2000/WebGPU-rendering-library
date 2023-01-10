import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light } from "./Light";

export class DirectionLight extends Light {

  direction = Vector3.DOWN;

  constructor({ direction = Vector3.DOWN, intensity = 1, color = new Color(1, 1, 1) } = {}) {
    super({ intensity, color });
    this.direction = direction;
  }
}
