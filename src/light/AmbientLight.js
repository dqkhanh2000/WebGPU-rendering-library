import { Color } from "../math/Color";
import { Light } from "./Light";

export class AmbientLight extends Light {

  constructor({ intensity = 1, color = new Color(1, 1, 1) } = {}) {
    super({ intensity, color });
  }
}
