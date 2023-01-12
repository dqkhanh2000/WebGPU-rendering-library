import { Color } from "../math/Color";
import { Light } from "./Light";

export class AmbientLight extends Light {

  constructor({ intensity = 1, color = Color.WHITE } = {}) {
    super({ intensity, color });
  }

}
