import { Camera } from "./Camera.js";

/**
 * A class representing a perspective camera, that can be used to create a 3D scene.
 * @extends Camera
 */
class PerspectiveCamera extends Camera {

  /**
   * The field of view of the camera, in degrees.
   * @type {number}
   */
  fov;

  /**
   * The aspect ratio of the camera.
   * @type {number}
   */
  aspect;

  /**
   * The distance to the near clipping plane.
   * @type {number}
   */
  near;

  /**
   * The distance to the far clipping plane.
   * @type {number}
   */
  far;

  /**
   * @param {Object} props - An object containing properties for the camera.
   * @param {number} [props.fov=45] - The field of view of the camera, in degrees.
   * @param {number} [props.aspect=0.75] - The aspect ratio of the camera.
   * @param {number} [props.near=0.1] - The distance to the near clipping plane.
   * @param {number} [props.far=1000] - The distance to the far clipping plane.
   * @param {Vector3} props.position - The position of the camera in 3D space.
   * @param {Vector3} props.lookAt - The point in 3D space the camera is pointing at.
   * @param {Vector3} props.up - The up direction of the camera.
   */
  constructor(props) {
    super({
      position : props.position,
      lookAt   : props.lookAt,
      up       : props.up,
    });
    this.fov = props.fov ?? 45;
    this.aspect = props.aspect ?? 0.75;
    this.near = props.near ?? 0.1;
    this.far = props.far ?? 1000;
  }

  /**
   * Update the view, projection and inverse matrices of the camera 
   * @param {Object} device - The device to update the camera matrix to 
   */
  updateMatrix(device) {
    if (this.needsUpdateViewMatrix) {
      this.viewMatrix.lookAt(this.position, this.lookAt, this.up);
      this.uniform.set(device, Camera.UniformKeys.VIEW_MATRIX, this.viewMatrix.elements.buffer);
      const cameraPosBuffer = this.position.array.buffer;
      this.uniform.set(device, Camera.UniformKeys.CAMERA_POS, cameraPosBuffer);
    }
    if (this.needsUpdateProjectionMatrix) {
      this.projectionMatrix.perspective(this.fov * Math.PI / 180, this.aspect, this.near, this.far);
      this.uniform.set(device, Camera.UniformKeys.PROJECTION_MATRIX, this.projectionMatrix.elements.buffer);
    }
    if (this.needsUpdateViewMatrix || this.needsUpdateProjectionMatrix) {
      const VPInvMatrix = this.projectionMatrix.clone().multiply(this.viewMatrix).invert();
      this.uniform.set(device, Camera.UniformKeys.VIEW_PROJECTION_INVERSE, VPInvMatrix.elements.buffer);
    }
    this.needsUpdateViewMatrix = false;
    this.needsUpdateProjectionMatrix = false;
  }
}

export { PerspectiveCamera };
