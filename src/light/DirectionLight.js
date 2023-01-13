import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { Light } from "./Light";

/**
  Class representing a Directional Light.
  @extends Light
  */
export class DirectionLight extends Light {

  static BUFFER_SIZE = Light.BUFFER_SIZE + 3 + 1;// size of intensity + color + direction + 1 is for padding
  /**
   The direction of the light.
   @type {Vector3}
   @default Vector3.DOWN
   */
  direction = Vector3.DOWN;

  /**
   Creates an instance of DirectionLight.
   @param {Object} [options={}] - An object with properties to set on the light.
   @param {Vector3} [options.direction=Vector3.DOWN] - The direction of the light.
   @param {number} [options.intensity=1] - The intensity of the light.
   @param {Color} [options.color=new Color(1, 1, 1)] - The color of the light.
   */
  constructor({ direction = Vector3.DOWN, intensity = 1, color = new Color(1, 1, 1) } = {}) {
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
