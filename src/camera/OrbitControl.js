import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

/**
 * A class for controlling camera orbit using mouse input.
 */
class OrbitControl {
  /**
   * The camera to be controlled.
   * @type {Object}
   */
  camera;

  /**
   * The canvas element to listen for mouse input on.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The target point for the camera to orbit around.
   * @type {Vector3}
   */
  target = Vector3.ZERO;

  /**
   * The factor to multiply delta mouse movement by when changing the azimuth angle.
   * @type {number}
   */
  rotateAzimuthFactor = 2;

  /**
   * The factor to multiply delta mouse movement by when changing the polar angle.
   * @type {number}
   */
  rotatePolarFactor = 2;

  /**
   * The factor to multiply delta mouse wheel movement by when changing the camera distance from the target.
   * @type {number}
   */
  zoomFactor = 1.0;

  /**
   * The current distance of the camera from the target.
   * @private
   * @type {number}
   */
  _radius = 0;

  /**
   * The current azimuth angle of the camera (rotation around the Y-axis).
   * @private
   * @type {number}
   */
  _azimuthAngle = 0;

  /**
   * The current polar angle of the camera (rotation around the X-axis).
   * @private
   * @type {number}
   */
  _polarAngle = 0;

  /**
   * A callback function for removing event listeners when disabling orbit rotation.
   * @private
   * @type {Function}
   */
  _disableRotateCallback;

  /**
   * @param {Object} camera - The camera to be controlled.
   * @param {HTMLCanvasElement} canvas - The canvas element to listen for mouse input on.
   */
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this._init();
  }

  /**
   * Initialize the orbit control by setting the initial camera position,
   * and adding event listeners for mouse input.
   */
  _init() {
    const p0 = this.camera.lookAt;
    const p1 = this.camera.position;
    const p01 = p1.clone().sub(p0);
    this._radius = p01.length();
    this._azimuthAngle = Math.atan(p01.x / p01.z);
    this._polarAngle = Math.acos(p01.y / this._radius);
    let isActive = false;
    const startPos = Vector2.ZERO;
    const currentPos = Vector2.ZERO;
    const deltaPos = Vector2.ZERO;
    const onMouseDown = (ev) => {
      startPos.set(ev.x, ev.y);
      isActive = true;
    };
    const onMouseUp = () => {
      isActive = false;
    };
    const onMouseMove = (ev) => {
      if (isActive) {
        currentPos.set(ev.x, ev.y);
        deltaPos.set(currentPos.x - startPos.x, currentPos.y - startPos.y);
        startPos.copy(currentPos);
        deltaPos.div(new Vector2(this.canvas.clientWidth, this.canvas.clientHeight));
        this._azimuthAngle -= deltaPos.x * this.rotateAzimuthFactor * Math.PI;
        this._polarAngle -= deltaPos.y * this.rotatePolarFactor * Math.PI;
        this._polarAngle = Math.min(Math.max(this._polarAngle, 0.1), Math.PI - 0.1);
      }
    };
    const onMouseWheel = (ev) => {
      this._radius += ev.deltaY * this.zoomFactor * 0.01;
      this._radius = Math.max(this._radius, 0);
    };
    this.canvas.addEventListener("mousedown", onMouseDown);
    this.canvas.addEventListener("mouseup", onMouseUp);
    this.canvas.addEventListener("mousemove", onMouseMove);
    this.canvas.addEventListener("wheel", onMouseWheel);
    this._disableRotateCallback = () => {
      this.canvas.removeEventListener("mousedown", onMouseDown);
      this.canvas.removeEventListener("mouseup", onMouseUp);
      this.canvas.removeEventListener("mousemove", onMouseMove);
      this.canvas.removeEventListener("wheel", onMouseWheel);
    };
  }

    /**
   * Disables the rotate function by removing event listeners for mouse input.
   */
  _disableRotate() {
    this._disableRotateCallback?.();
  }

  /**
   * Update the camera position based on the current orbit angles and distance from the target.
   */
  update() {
    const sinTheta = Math.sin(this._polarAngle);
    const cosTheta = Math.cos(this._polarAngle);
    const sinPhi = Math.sin(this._azimuthAngle);
    const cosPhi = Math.cos(this._azimuthAngle);
    this.camera.position.x = this._radius * sinTheta * sinPhi + this.target.x;
    this.camera.position.y = this._radius * cosTheta + this.target.y;
    this.camera.position.z = this._radius * sinTheta * cosPhi + this.target.z;
    this.camera.needsUpdateViewMatrix = true;
  }

  /**
   * Remove event listeners and perform any other necessary cleanup.
   */
  destory() {
    this._disableRotate();
  }
}

export { OrbitControl };
