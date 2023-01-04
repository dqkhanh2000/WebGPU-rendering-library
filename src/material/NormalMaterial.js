import { ShaderMaterial } from "./ShaderMaterial.js";
import vertexShader from "../shaders/normal/vert.wgsl?raw";
import fragmentShader from "../shaders/normal/frag.wgsl?raw";

class NormalMaterial extends ShaderMaterial {
  constructor() {
    super({
      name: "NormalMaterial",
      vertexShader,
      fragmentShader,
    });
  }
}

export { NormalMaterial };
