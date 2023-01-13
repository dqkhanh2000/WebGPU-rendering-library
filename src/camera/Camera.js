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

  /**
   * Keys for accessing uniform values
   * @static
   * @type {Object}
   */
  static UniformKeys = {
    VIEW_MATRIX             : "ViewMatrix",
    PROJECTION_MATRIX       : "ProjectionMatrix",
    CAMERA_POS              : "CameraPos",
    VIEW_PROJECTION_INVERSE : "ViewProjectionInverseMatrix",
  };

  /**
   * Flag to indicate whether viewMatrix needs to be updated
   * @type {Boolean}
   */
  needsUpdateViewMatrix;

  /**
   * Flag to indicate whether projectionMatrix needs to be updated
   * @type {Boolean}
   */
  needsUpdateProjectionMatrix;

  /**
   * Create a new Camera object
   * @param {Object} props 
   * @param {Vector3} props.position - the position of the camera
   * @param {Vector3} [props.lookAt=Vector3.ZERO] - the point the camera is looking at
   * @param {Vector3} [props.up=Vector3.UP] - the up vector for the camera
   */
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

  /**
   * Destroys the Camera object
   *
   */
  destroy() {
    this.uniform.destroy();
  }
}

export { Camera };
