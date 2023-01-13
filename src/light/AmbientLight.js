import { Color } from "../math/Color";
import { Light } from "./Light";

/**
  Class representing an ambient light.
  @extends Light
  */
export class AmbientLight extends Light {

 
  /**
    @constructor
    @param {Object} [options={ intensity: 1, color: new Color(1, 1, 1) }]
    @param {number} [options.intensity=1] - The intensity of the light.
    @param {Color} [options.color=new Color(1, 1, 1)] - The color of the light.
    */ constructor({ intensity = 1, color = Color.WHITE } = {}) { 
    super({ intensity, color });
  }

}
