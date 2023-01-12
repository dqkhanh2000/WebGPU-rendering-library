import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light } from "./Light";

export class DirectionLight extends Light {

  static BUFFER_SIZE = Light.BUFFER_SIZE + 3 + 1;// size of intensity + color + direction + 1 is for padding

  direction = Vector3.DOWN;

  constructor({ direction = Vector3.DOWN, intensity = 1, color = Color.WHITE } = {}) {
    super({ intensity, color });
    this.direction = direction;
  }

  getBuffer() {
    if (!this._buffer) {
      this._buffer = new Float32Array(DirectionLight.BUFFER_SIZE);
    }
    this._buffer.set(this.color.array, 0);
    this._buffer[3] = this.intensity;
    this._buffer.set(this.direction.array, 4);
    return this._buffer;
  }
}
