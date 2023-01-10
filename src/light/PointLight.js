import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light } from "./Light";

export class PointLight extends Light {

  radius;

  constructor({ position = Vector3.ZERO, intensity = 1, radius = 10, color = new Color(1, 1, 1) } = {}) {
    super({ position, intensity, color });
    this.radius = radius;
  }
}
