import { Vector3 } from "./Vector3";


/**
 * A 4D vector class with various vector operations.
 * @class
 * @param {number} [x=0] - The x-coordinate of the vector.
 * @param {number} [y=0] - The y-coordinate of the vector.
 * @param {number} [z=0] - The z-coordinate of the vector.
 * @param {number} [w=0] - The w-coordinate of the vector.
 */
export class Vector4 extends Vector3 {
  /**
   * Constructs a new Vector4.
   *
   * @param {number} x - The x component of the vector.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   * @param {number} w - The w component of the vector.
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super(x, y, z);
    this._w = w;
    this._array = new Float32Array([this.x, this.y, this.z, this.w]);
  }

  /**
   * Sets the x, y, z and w components of the vector.
   *
   * @param {number} x - The x component of the vector.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   * @param {number} w - The w component of the vector.
   * @returns {Vector4} The vector with the new components.
   */
  set(x, y, z, w) {
    super.set(x, y, z);
    this.w = w;
    return this;
  }

  /**
   * Adds a vector to this vector.
   *
   * @param {Vector4} v - The vector to add.
   * @returns {Vector4} The result of the addition.
   */
  add(v) {
    super.add(v);
    this.w += v.w;
    return this;
  }

  /**
   * Subtracts a vector from this vector.
   *
   * @param {Vector4} v - The vector to subtract.
   * @returns {Vector4} The result of the subtraction.
   */
  sub(v) {
    super.sub(v);
    this.w -= v.w;
    return this;
  }

  /**
   * Multiplies this vector by another vector.
   *
   * @param {Vector4} v - The vector to multiply by.
   * @returns {Vector4} The result of the multiplication.
   */
  mul(v) {
    super.mul(v);
    this.w *= v.w;
    return this;
  }

  /**
   * Divides this vector by another vector.
   *
   * @param {Vector4} v - The vector to divide by.
   * @returns {Vector4} The result of the division.
   */
  div(v) {
    super.div(v);
    this.w /= v.w;
    return this;
  }

  /**
   * Scales this vector by a scalar value.
   *
   * @param {number} s - The scalar value to scale by.
   * @returns {Vector4} The result of the scaling.
   */
  scale(s) {
    super.scale(s);
    this.w *= s;
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
   * @returns {Vector4} The normalized vector.
   */
  normalize() {
    const len = this.length();
    if (len === 0) {
      throw new Error("Cannot normalize a zero length vector");
    }
    this.scale(1 / len);
    return this;
  }

  /**
   * Calculates the dot product of this vector and another vector.
   *
   * @param {Vector4} v - The other vector.
   * @returns {number} The dot product of the two vectors.
   */
  dot(v) {
    return super.dot(v) + this.w * v.w;
  }

  /**
   * Calculates the cross product of this vector and another vector.
   *
   * @param {Vector4} v - The other vector.
   * @returns {Vector4} The cross product of the two vectors.
   */
  cross(v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    const w = 0;
    return new Vector4(x, y, z, w);
  }

  /**
   * Calculates the distance between this vector and another vector.
   *
   * @param {Vector4} v - The other vector.
   * @returns {number} The distance between the two vectors.
   */
  distance(v) {
    return this.sub(v).length();
  }

  /**
   * Calculates the angle between this vector and another vector.
   *
   * @param {Vector4} v - The other vector.
   * @returns {number} The angle between the two vectors.
   */
  angle(v) {
    const dot = this.dot(v);
    const len = this.length() * v.length();
    return Math.acos(dot / len);
  }

  /**
   * Check this vector is equal to another vector.
   * @param {Vector4} v - The other vector.
   */
  equals(v) {
    return super.equals(v) && this.w === v.w;
  }

  /**
   * Return a new vector that is the result of the linear interpolation between this vector and another vector.
   * @param {Vector4} v - The other vector.
   * @param {number} t - The interpolation factor.
   * @returns {Vector4} The interpolated vector.
   */
  lerp(v, t) {
    return new Vector3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t,
      this.w + (v.w - this.w) * t,
    );
  }

  /**
   * Returns a new vector that is the result of the spherical linear interpolation between this vector and another vector.
   * @param {Vector4} v - The other vector.
   * @param {number} t - The interpolation factor.
   * @returns {Vector4} The interpolated vector.
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
      this.w * s0 + v.w * s1,
    );
  }

  /**
   * Creates a copy of the vector.
   *
   * @returns {Vector4} A copy of the vector.
   */
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  /**
   * Copies the values of another vector into this vector.
   * @param {Vector4} v - The other vector.
   * @returns {Vector4} This vector.
   */
  copy(v) {
    super.copy(v);
    this.w = v.w;
    return this;
  }

  /**
   * Converts the vector to an array.
   *
   * @returns {number[]} An array representation of the vector.
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * Convert this vector to a Float32Array.
   * @returns {Float32Array} - A Float32Array containing the x and y coordinates of the vector.
   */
  get array() {
    this._array[0] = this.x;
    this._array[1] = this.y;
    this._array[2] = this.z;
    this._array[3] = this.w;
    return this._array;
  }

  /**
   * Converts the vector to an object.
   *
   * @returns {{x: number, y: number, z: number, w: number}} An object representation of the vector.
   */
  toObject() {
    return { x: this.x, y: this.y, z: this.z, w: this.w };
  }

  /**
   * Returns a string representation of the vector.
   *
   * @returns {string} A string representation of the vector.
   */
  toString() {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }

  /**
   * The getter for the w component.
   * @returns {number} - The w component.
   */
  get w() {
    return this._w;
  }

  /**
   * The setter for the w component.
   * @param {number} w - The new w component.
   */
  set w(w) {
    this._w = w;
    this._array[3] = w;
    this.onChange ?? this.onChange();
  }

  /**
   * Adds two vectors.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @returns {Vector4} The result of the addition.
   */
  static add(v1, v2) {
    return new Vector4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
  }

  /**
   * Subtracts two vectors and returns the result as a new vector.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @returns {Vector4} The result of the subtraction.
   */
  static sub(v1, v2) {
    return new Vector4(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
  }

  /**
   * Multiplies two vectors and returns the result as a new vector.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @returns {Vector4} The result of the multiplication.
   */
  static mul(v1, v2) {
    return new Vector4(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z, v1.w * v2.w);
  }

  /**
   * Divides two vectors and returns the result as a new vector.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @returns {Vector4} The result of the division.
   */
  static div(v1, v2) {
    return new Vector4(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z, v1.w / v2.w);
  }

  /**
   * Scales a vector and returns the result as a new vector.
   *
   * @param {Vector4} v - The vector to scale.
   * @param {number} s - The scalar value to scale by.
   * @returns {Vector4} The result of the scaling.
   */
  static scale(v, s) {
    return new Vector4(v.x * s, v.y * s, v.z * s, v.w * s);
  }

  /**
   * Calculates the distance between two vectors and returns the result.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @returns {number} The distance between the two vectors.
   */
  static distance(v1, v2) {
    return Math.sqrt(
      (v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2 + (v2.z - v1.z) ** 2 + (v2.w - v1.w) ** 2,
    );
  }

  /**
   * Calculates the angle between two vectors and returns the result.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @returns {number} The angle between the two vectors.
   */
  static angle(v1, v2) {
    const dot = v1.dot(v2);
    const len = v1.length() * v2.length();
    return Math.acos(dot / len);
  }

  /**
   * Creates a vector from an array.
   *
   * @param {number[]} arr - The array to create the vector from.
   * @returns {Vector4} The created vector.
   */
  static fromArray(arr) {
    return new Vector4(arr[0], arr[1], arr[2], arr[3]);
  }

  /**
   * Creates a vector from an object.
   *
   * @param {{x: number, y: number, z: number, w: number}} obj - The object to create the vector from.
   * @returns {Vector4} The created vector.
   */
  static fromObject(obj) {
    return new Vector4(obj.x, obj.y, obj.z, obj.w);
  }

  static get ZERO() {
    return new Vector4(0, 0, 0, 0);
  }

  static get ONE() {
    return new Vector4(1, 1, 1, 1);
  }

}
