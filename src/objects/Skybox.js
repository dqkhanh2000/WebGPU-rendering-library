import { SkyboxMaterial } from "../material/SkyboxMaterial.js";
import { BufferGeometry } from "../geometry/BufferGeometry.js";
import { Mesh } from "./Mesh.js";

/**
 A Skybox represents a six-sided cube with a skybox material and a specific texture.
 @property {BufferGeometry} geometry - The geometry of the skybox, which is a cube
 @property {SkyboxMaterial} material - The material of the skybox, with the specific texture
 */
class Skybox extends Mesh {
  /**
   * Creates a new Skybox
   * @param {Object} texture - The texture to be applied to the skybox
   */
  constructor(texture) {
    const geometry = new BufferGeometry({
      position: new Float32Array([
        -1, -1, 1,
        1, -1, 1,
        -1, 1, 1,
        -1, 1, 1,
        1, -1, 1,
        1, 1, 1,
      ]),
      index: new Uint16Array([
        0, 1, 2,
        3, 4, 5,
      ]),
    });
    const material = new SkyboxMaterial(texture);
    super({ geometry, material });
  }
}

export { Skybox };
