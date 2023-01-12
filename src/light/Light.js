/* eslint-disable no-dupe-class-members */
import { Color } from "../math/Color";

export class Light {

  static BUFFER_SIZE = 1 + 3; // size of intensity + color: 4 element

  intensity;

  color;

  constructor({ intensity = 1, color = new Color(1, 1, 1) } = {}) {
    this.intensity = intensity;
    this.color = color;
  }

  getBuffer() {
    if (!this._buffer) {
      this._buffer = new Float32Array(Light.BUFFER_SIZE);
    }
    this._buffer.set(this.color.glArray, 0);
    this._buffer[3] = this.intensity;
    return this._buffer;
  }
}
