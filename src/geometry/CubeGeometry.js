import { BufferGeometry } from "./BufferGeometry.js";
import { Vector3 } from "../math/Vector3";

/**
 * Class representing a Cube Geometry
 * @class
 * @extends BufferGeometry
 */
class CubeGeometry extends BufferGeometry {
  /**
   * @type {Vector3}
   */
  cubeSize;

  /**
   * @param {Vector3} [cubeSize=new Vector3(1,1,1)] - The size of the cube.
   */
  constructor(cubeSize = new Vector3(1, 1, 1)) {
    const { x: hx, y: hy, z: hz } = cubeSize.clone().scale(0.5);
    const t03 = 0;
    const t13 = 1 / 3;
    const t23 = 2 / 3;
    const t33 = 3 / 3;
    const t04 = 0;
    const t14 = 1 / 4;
    const t24 = 2 / 4;
    const t34 = 3 / 4;
    const t44 = 4 / 4;
    super({
      position: new Float32Array([
        -hx, hy, -hz, hx, hy, -hz, hx, hy, hz, -hx, hy, hz,
        -hx, -hy, hz, hx, -hy, hz, hx, -hy, -hz, -hx, -hy, -hz,
        -hx, hy, hz, hx, hy, hz, hx, -hy, hz, -hx, -hy, hz,
        hx, hy, -hz, -hx, hy, -hz, -hx, -hy, -hz, hx, -hy, -hz,
        -hx, hy, -hz, -hx, hy, hz, -hx, -hy, hz, -hx, -hy, -hz,
        hx, hy, hz, hx, hy, -hz, hx, -hy, -hz, hx, -hy, hz, // right
      ]),
      uv: new Float32Array([
        t14, t03, t24, t03, t24, t13, t14, t13,
        t14, t23, t24, t23, t24, t33, t14, t33,
        t14, t13, t24, t13, t24, t23, t14, t23,
        t34, t13, t44, t13, t44, t23, t34, t23,
        t04, t13, t14, t13, t14, t23, t04, t23,
        t24, t13, t34, t13, t34, t23, t24, t23, // right
      ]),
      index: new Uint16Array([
        0, 2, 1, 0, 3, 2,
        4, 6, 5, 4, 7, 6,
        8, 10, 9, 8, 11, 10,
        12, 14, 13, 12, 15, 14,
        16, 18, 17, 16, 19, 18,
        20, 22, 21, 20, 23, 22, // right
      ]),
    });
    this.cubeSize = cubeSize;
  }
}

export { CubeGeometry };
