/**
 * A 2D vector class with various vector operations.
 * @class
 * @param {number} [x=0] - The x-coordinate of the vector.
 * @param {number} [y=0] - The y-coordinate of the vector.
 */
export class Vector2 {

  /**
   * Constructs a new Vector3.
   *
   * @param {number} x - The x component of the vector.
   * @param {number} y - The y component of the vector.
   */
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
    this._array = new Float32Array([this.x, this.y]);
  }

  /**
   * The event handler for when the vector is changed.
   * @param {Function} callback - The callback function.
   */
  onChange(callback) {
    this._onChange = callback;
    return this;
  }

  /**
   * Set the x and y coordinates of the vector.
   * @param {number} x - The new x-coordinate of the vector.
   * @param {number} y - The new y-coordinate of the vector.
   * @returns {Vector2} - The updated vector.
   */
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Add another vector to this vector.
   * @param {Vector2} v - The vector to add.
   * @returns {Vector2} - The updated vector.
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtract another vector from this vector.
   * @param {Vector2} v - The vector to subtract.
   * @returns {Vector2} - The updated vector.
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiply this vector by another vector.
   * @param {Vector2} v - The vector to multiply by.
   * @returns {Vector2} - The updated vector.
   */
  mul(v) {
    this.x *= v.x;
    this.y *= v.y;
    this._onChange && this._onChange();
    return this;
  }

  /**
   * Divide this vector by another vector.
   * @param {Vector2} v - The vector to divide by.
   * @returns {Vector2} - The updated vector.
   */
  div(v) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  /**
   * Scale this vector by a scalar value.
   * @param {number} s - The scalar value to scale by.
   * @returns {Vector2} - The updated vector.
   */
  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  /**
   * Calculate the length of this vector.
   * @returns {number} - The length of the vector.
   */
  length() {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Normalize this vector (set its length to 1).
   * @returns {Vector2} - The updated vector.
   */
  normalize() {
    const len = this.length();
    this.x /= len;
    this.y /= len;
    return this;
  }

  /**
   * Calculate the dot product of this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @returns {number} - The dot product of the two vectors.
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculate the cross product of this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @returns {number} - The cross product of the two vectors.
   */
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * Calculate the distance between this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @returns {number} - The distance between the two vectors.
   */
  distance(v) {
    return Math.sqrt((v.x - this.x) ** 2 + (v.y - this.y) ** 2);
  }

  /**
   * Calculate the angle between this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @returns {number} - The angle between the two vectors, in radians.
   */
  angle(v) {
    return Math.acos(this.dot(v) / (this.length() * v.length()));
  }

  /**
   * Create a copy of this vector.
   * @returns {Vector2} - The new vector.
   */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Copy the values of another vector into this vector.
   * @param {Vector2} v - The other vector.
   * @returns {Vector2} - The updated vector.
   */
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /**
   * Return a new vector that is the result of the linear interpolation between this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @param {number} t - The interpolation factor.
   * @returns {Vector2} The interpolated vector.
   */
  lerp(v, t) {
    return new Vector2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
    );
  }

  /**
   * Returns a new vector that is the result of the spherical linear interpolation between this vector and another vector.
   * @param {Vector2} v - The other vector.
   * @param {number} t - The interpolation factor.
   * @returns {Vector2} The interpolated vector.
   */
  slerp(v, t) {
    const dot = this.dot(v);
    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);
    const s0 = Math.sin((1 - t) * theta) / sinTheta;
    const s1 = Math.sin(t * theta) / sinTheta;
    return new Vector2(
      this.x * s0 + v.x * s1,
      this.y * s0 + v.y * s1,
    );
  }

  /**
   * Convert this vector to an array.
   * @returns {number[]} - An array containing the x and y coordinates of the vector.
   */
  toArray() {
    return [this.x, this.y];
  }

  /**
   * Convert this vector to a Float32Array.
   * @returns {Float32Array} - A Float32Array containing the x and y coordinates of the vector.
   */
  get array() {
    this._array[0] = this.x;
    this._array[1] = this.y;
    return this._array;
  }

  /**
   * Convert this vector to an object.
   * @returns {object} - An object with x and y properties representing the coordinates of the vector.
   */
  toObject() {
    return { x: this.x, y: this.y };
  }

  /**
   * Convert this vector to a string.
   * @returns {string} - A string representation of the vector in the form "Vector2(x, y)".
   */
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }

  /**
   * Add two vectors.
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @returns {Vector2} - The resulting vector.
   */
  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * Subtract one vector from another.
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @returns {Vector2} - The resulting vector.
   */
  static sub(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * Multiply two vectors.
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @returns {Vector2} - The resulting vector.
   */
  static mul(v1, v2) {
    return new Vector2(v1.x * v2.x, v1.y * v2.y);
  }

  /**
   * Divide one vector by another.
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @returns {Vector2} - The resulting vector.
   */
  static div(v1, v2) {
    return new Vector2(v1.x / v2.x, v1.y / v2.y);
  }

  /**
   * Scale a vector by a scalar value.
   * @param {Vector2} v - The vector to scale.
   * @param {number} s - The scalar value to scale by.
   * @returns {Vector2} - The resulting vector.
   */
  static scale(v, s) {
    return new Vector2(v.x * s, v.y * s);
  }

  /**
   * Calculate the distance between two vectors.
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @returns {number} - The distance between the two vectors.
   */
  static distance(v1, v2) {
    return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2);
  }

  /**
   * Calculate the angle between two vectors.
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @returns {number} - The angle between the two vectors, in radians.
   */
  static angle(v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
  }

  /**
   * The get accessor for the x coordinate.
   * @returns {number} - The x coordinate.
   */
  get x() {
    return this._x;
  }

  /**
   * The set accessor for the x coordinate.
   * @param {number} value - The new x coordinate.
   */
  set x(value) {
    this._x = value;
    this._array[0] = value;
    this._onChange && this._onChange();
  }

  /**
   * The get accessor for the y coordinate.
   * @returns {number} - The y coordinate.
   */
  get y() {
    return this._y;
  }

  /**
   * The set accessor for the y coordinate.
   * @param {number} value - The new y coordinate.
   */
  set y(value) {
    this._y = value;
    this._array[1] = value;
    this._onChange && this._onChange();
  }


  /**
   * Create a vector from an array.
   * @param {number[]} arr - The array containing the x and y coordinates of the vector.
   * @returns {Vector2} - The new vector.
   */
  static fromArray(arr) {
    return new Vector2(arr[0], arr[1]);
  }

  /**
   * Create a vector from an object.
   * @param {object} obj - The object with x and y properties representing the coordinates of the vector.
   * @returns {Vector2} - The new vector.
   */
  static fromObject(obj) {
    return new Vector2(obj.x, obj.y);
  }

  static get ZERO() {
    return new Vector2(0, 0);
  }

  static get ONE() {
    return new Vector2(1, 1);
  }

  static get UP() {
    return new Vector2(0, 1);
  }

  static get DOWN() {
    return new Vector2(0, -1);
  }

  static get LEFT() {
    return new Vector2(-1, 0);
  }

  static get RIGHT() {
    return new Vector2(1, 0);
  }

  static get FORWARD() {
    return new Vector2(0, 1);
  }

  static get BACK() {
    return new Vector2(0, -1);
  }
}
