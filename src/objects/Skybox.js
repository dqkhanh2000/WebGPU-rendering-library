import { SkyboxMaterial } from "../material/SkyboxMaterial.js";
import { BufferGeometry } from "../geometry/BufferGeometry.js";
import { Mesh } from "./Mesh.js";

class Skybox extends Mesh {
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
