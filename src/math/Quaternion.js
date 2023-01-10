import { EPSILON } from "./Math";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";
// eslint-disable-next-line no-unused-vars

export class Quaternion extends Vector4 {

  /**
   * @param {number} [x=0] the x component
   * @param {number} [y=0] the y component
   * @param {number} [z=0] the z component
   * @param {number} [w=1] the w component
   */
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);
  }

  /**
   * Sets the components of this quaternion
   *
   * @param {number} [x=0] the x component
   * @param {number} [y=0] the y component
   * @param {number} [z=0] the z component
   * @param {number} [w=1] the w component
   */
  set(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Clones this quaternion
   * @returns {Quaternion} a copy of this quaternion
   */
  clone() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
   * Copies the values of another quaternion to this quaternion
   * @param {Quaternion} q the quaternion to copy
   * @returns {Quaternion} this quaternion
   */
  copy(q) {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }

  /**
   * Set this quaternion from the given axis and angle
   * @param {Vector3} axis the axis to set from
   * @param {number} angle the angle in radian to set from
   * @returns {Quaternion} this quaternion
   */
  setAxisAngle(axis, angle) {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);

    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    this.w = Math.cos(halfAngle);

    return this;
  }

  /**
 * Gets the rotation axis and angle for this
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as provided in the original parameter list
 *  OR functionally equivalent values.
 * @example The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param {Vector3} axis the vector to set the axis to
 * @returns {number} the angle in radian
 */
  getAxisAngle(axis) {
    const { x, y, z, w } = this;
    const angle = 2 * Math.acos(w);
    const s = Math.sin(angle / 2);

    if (s > EPSILON) {
      axis.x = x / s;
      axis.y = y / s;
      axis.z = z / s;
    }
    else {
      axis.x = 1;
      axis.y = 0;
      axis.z = 0;
    }
    return angle;
  }

  /**
   * Get angle between this and another quaternion
   * @param {Quaternion} q the quaternion to get the angle to
   * @returns {number} the angle in radian
   */
  angleTo(q) {
    const { x, y, z, w } = this;
    const dot = x * q.x + y * q.y + z * q.z + w * q.w;
    return Math.acos(2 * dot * dot - 1);
  }

  /**
   * Multiply this quaternion by another
   * @param {Quaternion} q the quaternion to multiply by
   * @returns {Quaternion} this quaternion
   */
  multiply(q) {
    const { x, y, z, w } = this;
    const { x: qx, y: qy, z: qz, w: qw } = q;

    this.x = x * qw + w * qx + y * qz - z * qy;
    this.y = y * qw + w * qy + z * qx - x * qz;
    this.z = z * qw + w * qz + x * qy - y * qx;
    this.w = w * qw - x * qx - y * qy - z * qz;

    return this;
  }

  /**
   * Rotate this quaternion by the given euler angles
   * @param {Vector3} euler the euler angles to rotate by
   * @returns {Quaternion} this quaternion
   */
  rotate(euler) {
    this.rotateX(euler.x);
    this.rotateY(euler.y);
    this.rotateZ(euler.z);
    return this;
  }

  /**
   * Rotate this quaternion by the given angle about the x axis
   * @param {number} angle the angle in radian to rotate by
   * @returns {Quaternion} this quaternion
   */
  rotateX(angle) {
    let halfAngle = angle / 2;
    let { x, y, z, w } = this;
    let qx = Math.sin(halfAngle);
    let qw = Math.cos(halfAngle);

    this.x = x * qw + w * qx;
    this.y = y * qw + z * qx;
    this.z = z * qw - y * qx;
    this.w = w * qw - x * qx;

    return this;
  }

  /**
   * Rotate this quaternion by the given angle about the y axis
   * @param {number} angle the angle in radian to rotate by
   * @returns {Quaternion} this quaternion
   */
  rotateY(angle) {
    let halfAngle = angle / 2;
    let { x, y, z, w } = this;
    let qy = Math.sin(halfAngle);
    let qw = Math.cos(halfAngle);

    this.x = x * qw - z * qy;
    this.y = y * qw + w * qy;
    this.z = z * qw + x * qy;
    this.w = w * qw - y * qy;

    return this;
  }

  /**
   * Rotate this quaternion by the given angle about the z axis
   * @param {number} angle the angle in radian to rotate by
   * @returns {Quaternion} this quaternion
   */
  rotateZ(angle) {
    let halfAngle = angle / 2;
    let { x, y, z, w } = this;
    let qz = Math.sin(halfAngle);
    let qw = Math.cos(halfAngle);

    this.x = x * qw + y * qz;
    this.y = y * qw - x * qz;
    this.z = z * qw + w * qz;
    this.w = w * qw - z * qz;

    return this;
  }

  /**
   * Calculate the exponential of a unit quaternion.
   * @returns {Quaternion} this quaternion
   */
  exp() {
    let { x, y, z, w } = this;
    let angle = Math.sqrt(x * x + y * y + z * z);
    let et = Math.exp(w);
    let s = angle > 0 ? et * Math.sin(angle) / angle : 0;

    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = et * Math.cos(angle);

    return this;
  }

  /**
   * Calculate the natural logarithm of a unit quaternion.
   * @returns {Quaternion} this quaternion
   */
  log() {
    let { x, y, z, w } = this;
    let angle = Math.sqrt(x * x + y * y + z * z);
    let s = angle > 0 ? Math.acos(w) / angle : 0;

    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = Math.log(Math.sqrt(w * w + angle * angle));

    return this;
  }

  /**
   * Calculate the power of a unit quaternion.
   * @param {number} exponent the exponent to raise the quaternion to
   * @returns {Quaternion} this quaternion
   */
  pow(exponent) {
    this.log();
    this.multiplyScalar(exponent);
    this.exp();
    return this;
  }

  getEuler() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    const sqw = w * w;
    const sqx = x * x;
    const sqy = y * y;
    const sqz = z * z;
    const unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
    const test = x * y + z * w;
    let heading;
    let attitude;
    let bank;

    if (test > 0.499 * unit) {
      // singularity at north pole
      heading = 2 * Math.atan2(x, w);
      attitude = Math.PI / 2;
      bank = 0;
    }
    else if (test < -0.499 * unit) {
      // singularity at south pole
      heading = -2 * Math.atan2(x, w);
      attitude = -Math.PI / 2;
      bank = 0;
    }
    else {
      heading = Math.atan2(2 * y * w - 2 * x * z, sqx - sqy - sqz + sqw);
      attitude = Math.asin(2 * test / unit);
      bank = Math.atan2(2 * x * w - 2 * y * z, -sqx + sqy - sqz + sqw);
    }

    return new Vector3(bank, heading, attitude);
  }

  /**
   * Create quaternion from the given euler angles
   * @param {Vector3} euler the euler angles to set from
   * @returns {Quaternion} new quaternion from the given euler angles
   */
  static fromEuler(euler) {
    const { x, y, z } = euler;
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);

    return new Quaternion(
      s1 * c2 * c3 + c1 * s2 * s3,
      c1 * s2 * c3 - s1 * c2 * s3,
      c1 * c2 * s3 + s1 * s2 * c3,
      c1 * c2 * c3 - s1 * s2 * s3,
    );
  }

}
