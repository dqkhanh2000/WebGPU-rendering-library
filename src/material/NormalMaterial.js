import { ShaderMaterial } from "./ShaderMaterial.js";
import vertexShader from "../shaders/normal/vert.wgsl?raw";
import fragmentShader from "../shaders/normal/frag.wgsl?raw";

/**
 Class representing a NormalMaterial
 @extends ShaderMaterial
 */
class NormalMaterial extends ShaderMaterial {
  /**
   Creates an instance of NormalMaterial.
   It sets the vertexShader and fragmentShader as the shaders passed in the constructor
   */
  constructor() {
    super({
      name: "NormalMaterial",
      vertexShader,
      fragmentShader,
    });
  }
}

export { NormalMaterial };
