import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";

export class Light {
  intensity;

  color;

  position;

  constructor({ position = Vector3.ZERO, intensity = 1, color = new Color(1, 1, 1) } = {}) {
    this.position = position;
    this.intensity = intensity;
    this.color = color;
  }
}
