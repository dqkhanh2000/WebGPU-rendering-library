/* eslint-disable no-dupe-class-members */
import { Color } from "../math/Color";

/**
 Class representing a Light.
 */
export class Light {

  static BUFFER_SIZE = 1 + 3; // size of intensity + color: 4 element

  /**
   The intensity of the light.
   @type {number}
   @default 1
   */
  intensity;

  /**
   The color of the light.
   @type {Color}
   @default new Color(1, 1, 1)
   */
  color;

  /**
   The position of the light.
   @type {Vector3}
   @default Vector3.ZERO
   */
  position;

  /**
   Creates an instance of Light.
   @param {Object} [options={}] - An object with properties to set on the light.
   @param {Vector3} [options.position=Vector3.ZERO] - The position of the light.
   @param {number} [options.intensity=1] - The intensity of the light.
   @param {Color} [options.color=new Color(1, 1, 1)] - The color of the light.
   */
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
