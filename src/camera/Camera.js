

import { UniformBuffer } from "../buffer/UniformBuffer.js";
import { Matrix4 } from "../math/Matrix4.js";
import { Vector3 } from "../math/Vector3.js";

/**
 * The base camera class.
 */
class Camera {

  /**
   * The camera position.
   * @type {Vector3}
   */
  position;

  /**
   * The camera look at position.
   * @type {Vector3}
   * @default Vector3.ZERO
   */
  lookAt;

  /**
   * The camera up vector.
   * @type {Vector3}
   * @default Vector3.UP
   */
  up;

  /**
   * The camera view matrix.
   * @type {Matrix4}
   * @default Matrix4.IDENTITY
   */
  viewMatrix;

  /**
   * The camera projection matrix.
   * @type {Matrix4}
   * @default Matrix4.IDENTITY
   */
  projectionMatrix;

  /**
   * The camera uniform buffer.
   * @type {UniformBuffer}
   */
  uniform;

  static UniformKeys = {
    VIEW_MATRIX             : "ViewMatrix",
    PROJECTION_MATRIX       : "ProjectionMatrix",
    CAMERA_POS              : "CameraPos",
    VIEW_PROJECTION_INVERSE : "ViewProjectionInverseMatrix",
  };

  needsUpdateViewMatrix;

  needsUpdateProjectionMatrix;

  constructor(props) {
    this.position = props.position ?? new Vector3(3, 3, 3);
    this.lookAt = props.lookAt ?? new Vector3(0, 0, 0);
    this.up = props.up ?? Vector3.UP;
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.needsUpdateViewMatrix = true;
    this.needsUpdateProjectionMatrix = true;
    this.uniform = new UniformBuffer({
      binding : 0,
      name    : "CameraUniform",
      items   : [
        { name: Camera.UniformKeys.VIEW_MATRIX, size: Float32Array.BYTES_PER_ELEMENT * 16 },
        { name: Camera.UniformKeys.PROJECTION_MATRIX, size: Float32Array.BYTES_PER_ELEMENT * 16 },
        { name: Camera.UniformKeys.CAMERA_POS, size: Float32Array.BYTES_PER_ELEMENT * 4 },
        { name: Camera.UniformKeys.VIEW_PROJECTION_INVERSE, size: Float32Array.BYTES_PER_ELEMENT * 16 },
      ],
    });
  }

  destroy() {
    this.uniform.destroy();
  }
}

export { Camera };
