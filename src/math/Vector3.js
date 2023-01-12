import { Vector2 } from "./Vector2";

/**
 * A 3D vector class with various vector operations.
 * @class
 * @param {number} [x=0] - The x-coordinate of the vector.
 * @param {number} [y=0] - The y-coordinate of the vector.
 * @param {number} [z=0] - The z-coordinate of the vector.
 */
export class Vector3 extends Vector2 {
  /**
   * Constructs a new Vector3.
   *
   * @param {number} x - The x component of the vector.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   */
  constructor(x = 0, y = 0, z = 0) {
    super(x, y);
    this._z = z;
    this._array = new Float32Array([this.x, this.y, this.z]);
  }

  /**
   * Sets the x, y, and z components of the vector.
   *
   * @param {number} x - The x component of the vector.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   * @returns {Vector3} The vector with the new components.
   */
  set(x, y, z) {
    super.set(x, y);
    this.z = z;
    return this;
  }

  /**
   * Adds a vector to this vector.
   *
   * @param {Vector3} v - The vector to add.
   * @returns {Vector3} The result of the addition.
   */
  add(v) {
    super.add(v);
    this.z += v.z;
    return this;
  }

  /**
   * Subtracts a vector from this vector.
   *
   * @param {Vector3} v - The vector to subtract.
   * @returns {Vector3} The result of the subtraction.
   */
  sub(v) {
    super.sub(v);
    this.z -= v.z;
    return this;
  }

  /**
   * Multiplies this vector by another vector.
   *
   * @param {Vector3} v - The vector to multiply by.
   * @returns {Vector3} The result of the multiplication.
   */
  mul(v) {
    super.mul(v);
    this.z *= v.z;
    return this;
  }

  /**
   * Divides this vector by another vector.
   *
   * @param {Vector3} v - The vector to divide by.
   * @returns {Vector3} The result of the division.
   */
  div(v) {
    super.div(v);
    this.z /= v.z;
    return this;
  }

  /**
   * Scales this vector by a scalar value.
   *
   * @param {number} s - The scalar value to scale by.
   * @returns {Vector3} The result of the scaling.
   */
  scale(s) {
    super.scale(s);
    this.z *= s;
    return this;
  }

  /**
   * Calculates the length of the vector.
   *
   * @returns {number} The length of the vector.
   */
  length() {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Normalizes the vector.
   *
   * @returns {Vector3} The normalized vector.
   */
  normalize() {
    const len = this.length();
    if (len === 0) {
      throw new Error("Cannot normalize a zero-length vector.");
    }
    this.scale(1 / len);
    return this;
  }

  /**
   * Calculates the dot product of this vector and another vector.
   *
   * @param {Vector3} v - The other vector.
   * @returns {number} The dot product of the two vectors.
   */
  dot(v) {
    return super.dot(v) + this.z * v.z;
  }

  /**
   * Calculates the cross product of this vector and another vector.
   *
   * @param {Vector3} v - The other vector.
   * @returns {Vector3} The cross product of the two vectors.
   */
  cross(v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  }

  /**
   * Calculates the distance between this vector and another vector.
   *
   * @param {Vector3} v - The other vector.
   * @returns {number} The distance between the two vectors.
   */
  distance(v) {
    return Math.sqrt(
      (v.x - this.x) ** 2 + (v.y - this.y) ** 2 + (v.z - this.z) ** 2,
    );
  }

  /**
   * Calculates the angle between this vector and another vector.
   *
   * @param {Vector3} v - The other vector.
   * @returns {number} The angle between the two vectors.
   */
  angle(v) {
    return Math.acos(
      this.dot(v) / (this.length() * v.length()),
    );
  }

  /**
   * Check this vector is equal to another vector.
   * @param {Vector3} v - The other vector.
   */
  equals(v) {
    return super.equals(v) && this.z === v.z;
  }

  /**
   * Return a new vector that is the result of the linear interpolation between this vector and another vector.
   * @param {Vector3} v - The other vector.
   * @param {number} t - The interpolation factor.
   * @returns {Vector3} The interpolated vector.
   */
  lerp(v, t) {
    return new Vector3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t,
    );
  }

  /**
   * Returns a new vector that is the result of the spherical linear interpolation between this vector and another vector.
   * @param {Vector3} v - The other vector.
   * @param {number} t - The interpolation factor.
   * @returns {Vector3} The interpolated vector.
   */
  slerp(v, t) {
    const dot = this.dot(v);
    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);
    const s0 = Math.sin((1 - t) * theta) / sinTheta;
    const s1 = Math.sin(t * theta) / sinTheta;
    return new Vector3(
      this.x * s0 + v.x * s1,
      this.y * s0 + v.y * s1,
      this.z * s0 + v.z * s1,
    );
  }

  /**
   * Creates a copy of the vector.
   *
   * @returns {Vector3} A copy of the vector.
   */
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Copies the values of another vector into this vector.
   * @param {Vector3} v - The other vector.
   * @returns {Vector3} This vector.
   */
  copy(v) {
    super.copy(v);
    this.z = v.z;
    return this;
  }

  /**
   * Converts the vector to an array.
   *
   * @returns {number[]} An array representation of the vector.
   */
  toArray() {
    return [this.x, this.y, this.z];
  }

  /**
   * Convert this vector to a Float32Array.
   * @returns {Float32Array} - A Float32Array containing the x and y coordinates of the vector.
   */
  get array() {
    this._array[0] = this.x;
    this._array[1] = this.y;
    this._array[2] = this.z;
    return this._array;
  }

  /**
   * Converts the vector to an object.
   *
   * @returns {{x: number, y: number, z: number}} An object representation of the vector.
   */
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  /**
   * Returns a string representation of the vector.
   *
   * @returns {string} A string representation of the vector.
   */
  toString() {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }

  /**
   * The getter for the z coordinate.
   * @returns {number} - The z coordinate.
   */
  get z() {
    return this._z;
  }

  /**
   * The setter for the z coordinate.
   * @param {number} value - The new z coordinate.
   */
  set z(value) {
    this._z = value;
    this._array[2] = value;
    this.onChange ?? this.onChange();
  }

  /**
   * Adds two vectors.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @returns {Vector3} The result of the addition.
   */
  static add(v1, v2) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  /**
   * Subtracts two vectors and returns the result as a new vector.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @returns {Vector3} The result of the subtraction.
   */
  static sub(v1, v2) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  /**
   * Multiplies two vectors and returns the result as a new vector.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @returns {Vector3} The result of the multiplication.
   */
  static mul(v1, v2) {
    return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
  }

  /**
   * Divides two vectors and returns the result as a new vector.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @returns {Vector3} The result of the division.
   */
  static div(v1, v2) {
    return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
  }

  /**
   * Scales a vector and returns the result as a new vector.
   *
   * @param {Vector3} v - The vector to scale.
   * @param {number} s - The scalar value to scale by.
   * @returns {Vector3} The result of the scaling.
   */
  static scale(v, s) {
    return new Vector3(v.x * s, v.y * s, v.z * s);
  }

  /**
   * Calculates the distance between two vectors and returns the result.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @returns {number} The distance between the two vectors.
   */
  static distance(v1, v2) {
    return Math.sqrt(
      (v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2 + (v2.z - v1.z) ** 2,
    );
  }

  /**
   * Calculates the angle between two vectors and returns the result.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @returns {number} The angle between the two vectors.
   */
  static angle(v1, v2) {
    return Math.acos(
      v1.dot(v2) / (v1.length() * v2.length()),
    );
  }

  /**
   * Creates a vector from an array.
   *
   * @param {number[]} arr - The array to create the vector from.
   * @returns {Vector3} The created vector.
   */
  static fromArray(arr) {
    return new Vector3(arr[0], arr[1], arr[2]);
  }

  /**
   * Creates a vector from an object.
   *
   * @param {{x: number, y: number, z: number}} obj - The object to create the vector from.
   * @returns {Vector3} The created vector.
   */
  static fromObject(obj) {
    return new Vector3(obj.x, obj.y, obj.z);
  }

  static get ZERO() {
    return new Vector3(0, 0, 0);
  }

  static get ONE() {
    return new Vector3(1, 1, 1);
  }

  static get UP() {
    return new Vector3(0, 1, 0);
  }

  static get DOWN() {
    return new Vector3(0, -1, 0);
  }

  static get LEFT() {
    return new Vector3(-1, 0, 0);
  }

  static get RIGHT() {
    return new Vector3(1, 0, 0);
  }

  static get FORWARD() {
    return new Vector3(0, 0, 1);
  }

  static get BACK() {
    return new Vector3(0, 0, -1);
  }
}
