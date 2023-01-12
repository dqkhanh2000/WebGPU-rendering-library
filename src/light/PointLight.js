import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light } from "./Light";

export class PointLight extends Light {

  static BUFFER_SIZE = Light.BUFFER_SIZE + 3 + 1; // size of intensity + color + position + radius

  radius;

  constructor({ position = Vector3.ZERO, intensity = 1, radius = 10, color = Color.WHITE } = {}) {
    super({ intensity, color });
    this.position = position;
    this.radius = radius;
  }


  getBuffer() {
    if (!this._buffer) {
      this._buffer = new Float32Array(PointLight.BUFFER_SIZE);
    }
    this._buffer.set(this.color.array, 0);
    this._buffer.set(this.position.array, 4);
    this._buffer[7] = this.radius;
    return this._buffer;
  }
}
