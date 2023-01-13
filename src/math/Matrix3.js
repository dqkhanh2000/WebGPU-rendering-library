// eslint-disable-next-line no-unused-vars
import { Vector2 } from "./Vector2";

/**
 * A 3x3 matrix.
 * @class
 */
export class Matrix3 {
  /**
   * Creates a new Matrix3 instance.
   * @param {number} [m00=1] - The value for the first row and first column.
   * @param {number} [m01=0] - The value for the first row and second column.
   * @param {number} [m02=0] - The value for the first row and third column.
   * @param {number} [m10=0] - The value for the second row and first column.
   * @param {number} [m11=1] - The value for the second row and second column.
   * @param {number} [m12=0] - The value for the second row and third column.
   * @param {number} [m20=0] - The value for the third row and first column.
   * @param {number} [m21=0] - The value for the third row and second column.
   * @param {number} [m22=1] - The value for the third row and third column.
   */
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    /**
     * The value for the first row and first column.
     *
     * @type {number}
     */
    this.m00 = m00;

    /**
     * The value for the first row and second column.
     *
     * @type {number}
     */
    this.m01 = m01;

    /**
     * The value for the first row and third column.
     *
     * @type {number}
     */
    this.m02 = m02;

    /**
     * The value for the second row and first column.
     *
     * @type {number}
     */
    this.m10 = m10;

    /**
     * The value for the second row and second column.
     *
     * @type {number}
     */
    this.m11 = m11;

    /**
     * The value for the second row and third column.
     *
     * @type {number}
     */
    this.m12 = m12;

    /**
     * The value for the third row and first column
     * @type {number}
     */
    this.m20 = m20;

    /**
     * The value for the third row and second column.
     * @type {number}
     */
    this.m21 = m21;

    /**
     * The value for the third row and third column.
     * @type {number}
     */
    this.m22 = m22;

  }

  /**
   * Sets the values of this matrix.
   *
   * @param {number} [m00=1] - The value for the first row and first column.
   * @param {number} [m01=0] - The value for the first row and second column.
   * @param {number} [m02=0] - The value for the first row and third column.
   * @param {number} [m10=0] - The value for the second row and first column.
   * @param {number} [m11=1] - The value for the second row and second column.
   * @param {number} [m12=0] - The value for the second row and third column.
   * @param {number} [m20=0] - The value for the third row and first column.
   * @param {number} [m21=0] - The value for the third row and second column.
   * @param {number} [m22=1] - The value for the third row and third column.
   */
  set(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
  }

  /**
   * Sets the values of this matrix from the given array.
   *
   * @param {number[]} array - The array to read the values from.
   */
  setFromArray(array) {
    this.m00 = array[0];
    this.m01 = array[1];
    this.m02 = array[2];
    this.m10 = array[3];
    this.m11 = array[4];
    this.m12 = array[5];
    this.m20 = array[6];
    this.m21 = array[7];
    this.m22 = array[8];
  }

  /**
   * Clones this matrix.
   * @return {Matrix3} A clone of this matrix.
   */
  clone() {
    return new Matrix3(this.m00, this.m01, this.m02, this.m10, this.m11, this.m12, this.m20, this.m21, this.m22);
  }

  /**
   * Copies the values of the given matrix to this matrix.
   * @param {Matrix3} matrix - The matrix to copy.
   * @return {Matrix3} This matrix.
   */
  copy(matrix) {
    this.m00 = matrix.m00;
    this.m01 = matrix.m01;
    this.m02 = matrix.m02;
    this.m10 = matrix.m10;
    this.m11 = matrix.m11;
    this.m12 = matrix.m12;
    this.m20 = matrix.m20;
    this.m21 = matrix.m21;
    this.m22 = matrix.m22;

    return this;
  }

  /**
   * Sets this matrix to the identity matrix.
   * @return {Matrix3} This matrix.
   */
  identity() {
    this.set();
  }

  /**
   * Transposes this matrix.
   * @return {Matrix3} This matrix.
   */
  transpose() {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;

    this.set(
      m00, m10, m20, m01, m11, m21, m02, m12, m22,
    );

    return this;
  }

  /**
   * Inverts this matrix.
   * @return {Matrix3} This matrix.
   */
  invert() {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const b01 = m22 * m11 - m12 * m21;
    const b11 = -m22 * m10 + m12 * m20;
    const b21 = m21 * m10 - m11 * m20;

    // Calculate the determinant
    const det = m00 * b01 + m01 * b11 + m02 * b21;

    if (det === 0) {
      throw new Error("Cannot invert matrix, determinant is 0");
    }

    const invDet = 1 / det;

    this.set(
      b01 * invDet,
      (-m22 * m01 + m02 * m21) * invDet,
      (m12 * m01 - m02 * m11) * invDet,
      b11 * invDet,
      (m22 * m00 - m02 * m20) * invDet,
      (-m12 * m00 + m02 * m10) * invDet,
      b21 * invDet,
      (-m21 * m00 + m01 * m20) * invDet,
      (m11 * m00 - m01 * m10) * invDet,
    );
    return this;
  }

  /**
   * Multiplies this matrix with the given matrix.
   * @param {Matrix3} matrix - The matrix to multiply with.
   * @return {Matrix3} This matrix.
   */
  multiply(matrix) {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const n00 = matrix.m00;
    const n01 = matrix.m01;
    const n02 = matrix.m02;
    const n10 = matrix.m10;
    const n11 = matrix.m11;
    const n12 = matrix.m12;
    const n20 = matrix.m20;
    const n21 = matrix.m21;
    const n22 = matrix.m22;

    this.set(
      n00 * m00 + n01 * m10 + n02 * m20,
      n00 * m01 + n01 * m11 + n02 * m21,
      n00 * m02 + n01 * m12 + n02 * m22,
      n10 * m00 + n11 * m10 + n12 * m20,
      n10 * m01 + n11 * m11 + n12 * m21,
      n10 * m02 + n11 * m12 + n12 * m22,
      n20 * m00 + n21 * m10 + n22 * m20,
      n20 * m01 + n21 * m11 + n22 * m21,
      n20 * m02 + n21 * m12 + n22 * m22,
    );

    return this;
  }

  /**
   * Translates this matrix by the given vector.
   * @param {Vector2} vector - The vector to translate by.
   * @return {Matrix3} This matrix.
   */
  translate(vector) {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const x = vector.x;
    const y = vector.y;

    this.set(
      m00,
      m01,
      m02,
      m10,
      m11,
      m12,
      x * m00 + y * m10 + m20,
      x * m01 + y * m11 + m21,
      x * m02 + y * m12 + m22,
    );

    return this;
  }

  /**
   * Rotates this matrix by the given angle.
   * @param {number} angle - The angle in radian to rotate by.
   * @return {Matrix3} This matrix.
   */
  rotate(angle) {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    this.set(
      c * m00 + s * m10,
      c * m01 + s * m11,
      c * m02 + s * m12,
      c * m10 - s * m00,
      c * m11 - s * m01,
      c * m12 - s * m02,
      m20,
      m21,
      m22,
    );

    return this;
  }

  /**
   * Scales this matrix by the given vector.
   * @param {Vector2} vector - The vector to scale by.
   * @return {Matrix3} This matrix.
   */
  scale(vector) {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const x = vector.x;
    const y = vector.y;

    this.set(
      x * m00,
      x * m01,
      x * m02,
      y * m10,
      y * m11,
      y * m12,
      m20,
      m21,
      m22,
    );

    return this;
  }

  /**
   * Creates a matrix from a vector translation
  * This is equivalent to (but much faster than):
  *
  *     mat3.identity(dest);
  *     mat3.translate(dest, dest, vec);
  *
  * @param {Vector2} vector - The vector to translate by
  * @returns {Matrix3} This matrix.
  */
  fromTranslation(vector) {
    this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      vector.x,
      vector.y,
      1,
    );

    return this;
  }

  /**
   * Creates a matrix from a given angle
   * This is equivalent to (but much faster than):
   *    mat3.identity(dest);
   *   mat3.rotate(dest, dest, rad);
   * @param {number} angle - The angle to rotate the matrix by
   * @returns {Matrix3} This matrix.
   */
  fromRotation(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    this.set(
      c,
      s,
      0,
      -s,
      c,
      0,
      0,
      0,
      1,
    );

    return this;
  }

  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *    mat3.identity(dest);
   *   mat3.scale(dest, dest, vec);
   * @param {Vector2} vector - The vector to scale the matrix by
   * @returns {Matrix3} This matrix.
   */
  fromScaling(vector) {
    this.set(
      vector.x,
      0,
      0,
      0,
      vector.y,
      0,
      0,
      0,
      1,
    );

    return this;
  }

  /**
   * From quaternion
   * @param {Quaternion} quaternion - The quaternion to create a matrix from
   * @returns {Matrix3} This matrix.
   */
  fromQuaternion(quaternion) {
    const x = quaternion.x;
    const y = quaternion.y;
    const z = quaternion.z;
    const w = quaternion.w;
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    this.set(
      1 - yy - zz,
      yx + wz,
      zx - wy,
      yx - wz,
      1 - xx - zz,
      zy + wx,
      zx + wy,
      zy - wx,
      1 - xx - yy,
    );

    return this;
  }

  /**
   * Generates a 2D projection matrix with the given bounds
   * @param {number} width - Width of your gl context
   * @param {number} height - Height of gl context
   * @param {number} depth - Depth of your gl context
   * @returns {Matrix3} This matrix.
   */
  projection(width, height, depth) {
    this.set(
      2 / width,
      0,
      0,
      0,
      -2 / height,
      0,
      -1,
      1,
      depth / 2,
    );

    return this;
  }

  /**
   * Returns a string representation of this matrix.
   * @return {string} String representation of this matrix.
   */
  toString() {
    return `Matrix3(${this.m00}, ${this.m01}, ${this.m02}, ${this.m10}, ${this.m11}, ${this.m12}, ${this.m20}, ${this.m21}, ${this.m22})`;
  }

  /**
   * Returns Frobenius norm of this matrix.
   * @return {number} Frobenius norm.
   */
  frob() {
    return (
      Math.hypot(
        this.m00,
        this.m01,
        this.m02,
        this.m10,
        this.m11,
        this.m12,
        this.m20,
        this.m21,
        this.m22,
      )
    );
  }

  /**
   * Adds two matrices.
   * @param {Matrix3} matrix - The matrix to add.
   * @return {Matrix3} This matrix.
   */
  add(matrix) {
    this.m00 += matrix.m00;
    this.m01 += matrix.m01;
    this.m02 += matrix.m02;
    this.m10 += matrix.m10;
    this.m11 += matrix.m11;
    this.m12 += matrix.m12;
    this.m20 += matrix.m20;
    this.m21 += matrix.m21;
    this.m22 += matrix.m22;

    return this;
  }

  /**
   * Subtracts matrix b from matrix a.
   * @param {Matrix3} matrix - The matrix to subtract.
   * @return {Matrix3} This matrix.
   */
  subtract(matrix) {
    this.m00 -= matrix.m00;
    this.m01 -= matrix.m01;
    this.m02 -= matrix.m02;
    this.m10 -= matrix.m10;
    this.m11 -= matrix.m11;
    this.m12 -= matrix.m12;
    this.m20 -= matrix.m20;
    this.m21 -= matrix.m21;
    this.m22 -= matrix.m22;

    return this;
  }

  /**
   * Multiply each element of the matrix by a scalar.
   * @param {number} scalar - The number to multiply with.
   * @return {Matrix3} This matrix.
   */
  multiplyScalar(scalar) {
    this.m00 *= scalar;
    this.m01 *= scalar;
    this.m02 *= scalar;
    this.m10 *= scalar;
    this.m11 *= scalar;
    this.m12 *= scalar;
    this.m20 *= scalar;
    this.m21 *= scalar;
    this.m22 *= scalar;

    return this;
  }

  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar value.
   * @param {Matrix3} matrix - The matrix to multiply.
   * @param {number} scalar - The number to multiply with.
   * @return {Matrix3} This matrix.
   */
  multiplyScalarAndAdd(matrix, scalar) {
    this.m00 += matrix.m00 * scalar;
    this.m01 += matrix.m01 * scalar;
    this.m02 += matrix.m02 * scalar;
    this.m10 += matrix.m10 * scalar;
    this.m11 += matrix.m11 * scalar;
    this.m12 += matrix.m12 * scalar;
    this.m20 += matrix.m20 * scalar;
    this.m21 += matrix.m21 * scalar;
    this.m22 += matrix.m22 * scalar;

    return this;
  }

  /**
   * create new matrix from matrix4
   * @param {Matrix4} matrix - The matrix to multiply.
   * @return {Matrix3} This matrix.
   */
  fromMatrix4(matrix) {
    this.m00 = matrix.m00;
    this.m01 = matrix.m01;
    this.m02 = matrix.m02;
    this.m10 = matrix.m10;
    this.m11 = matrix.m11;
    this.m12 = matrix.m12;
    this.m20 = matrix.m20;
    this.m21 = matrix.m21;
    this.m22 = matrix.m22;

    return this;
  }

  /**
   * Returns array of elements of this matrix.
   * @return {Float32Array} Array of elements of this matrix.
   */
  get elements() {
    return new Float32Array([
      this.m00,
      this.m01,
      this.m02,
      this.m10,
      this.m11,
      this.m12,
      this.m20,
      this.m21,
      this.m22,
    ]);
  }
}
