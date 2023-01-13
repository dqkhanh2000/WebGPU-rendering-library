/* eslint-disable one-var */
import { EPSILON } from "./Math";
import { Matrix3 } from "./Matrix3";
import { Vector3 } from "./Vector3";

/**
 * A 4x4 matrix.
 * @class
 */
export class Matrix4 extends Matrix3 {
  /**
   * Creates a new Matrix4 instance.
   * @param {number} [m00=1] - The value for the first row and first column.
   * @param {number} [m01=0] - The value for the first row and second column.
   * @param {number} [m02=0] - The value for the first row and third column.
   * @param {number} [m03=0] - The value for the first row and fourth column.
   * @param {number} [m10=0] - The value for the second row and first column.
   * @param {number} [m11=1] - The value for the second row and second column.
   * @param {number} [m12=0] - The value for the second row and third column.
   * @param {number} [m13=0] - The value for the second row and fourth column.
   * @param {number} [m20=0] - The value for the third row and first column.
   * @param {number} [m21=0] - The value for the third row and second column.
   * @param {number} [m22=1] - The value for the third row and third column.
   * @param {number} [m23=0] - The value for the third row and fourth column.
   * @param {number} [m30=0] - The value for the fourth row and first column.
   * @param {number} [m31=0] - The value for the fourth row and second column.
   * @param {number} [m32=0] - The value for the fourth row and third column.
   * @param {number} [m33=1] - The value for the fourth row and fourth column.
   */
  constructor(
    m00 = 1, m01 = 0, m02 = 0, m03 = 0,
    m10 = 0, m11 = 1, m12 = 0, m13 = 0,
    m20 = 0, m21 = 0, m22 = 1, m23 = 0,
    m30 = 0, m31 = 0, m32 = 0, m33 = 1,
  ) {
    super();
    /**
     * The value for the first row and first column.
     * @type {number}
     */
    this.m00 = m00;

    /**
     * The value for the first row and second column.
     * @type {number}
     */
    this.m01 = m01;

    /**
     * The value for the first row and third column.
     * @type {number}
     */
    this.m02 = m02;

    /**
     * The value for the first row and fourth column.
     * @type {number}
     */
    this.m03 = m03;

    /**
     * The value for the second row and first column.
     * @type {number}
     */
    this.m10 = m10;

    /**
     * The value for the second row and second column.
     * @type {number}
     */
    this.m11 = m11;

    /**
     * The value for the second row and third column.
     * @type {number}
     */
    this.m12 = m12;

    /**
     * The value for the second row and fourth column.
     * @type {number}
     */
    this.m13 = m13;

    /**
     * The value for the third row and first column.
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

    /**
     * The value for the third row and fourth column.
     * @type {number}
     */
    this.m23 = m23;

    /**
     * The value for the fourth row and first column.
     * @type {number}
     */
    this.m30 = m30;

    /**
     * The value for the fourth row and second column.
     * @type {number}
     */
    this.m31 = m31;

    /**
     * The value for the fourth row and third column.
     * @type {number}
     */
    this.m32 = m32;

    /**
     * The value for the fourth row and fourth column.
     * @type {number}
     */
    this.m33 = m33;
  }

  /**
   * Sets the values of this matrix.
   *
   * @param {number} [m00=1] - The value for the first row and first column.
   * @param {number} [m01=0] - The value for the first row and second column.
   * @param {number} [m02=0] - The value for the first row and third column.
   * @param {number} [m03=0] - The value for the first row and fourth column.
   * @param {number} [m10=0] - The value for the second row and first column.
   * @param {number} [m11=1] - The value for the second row and second column.
   * @param {number} [m12=0] - The value for the second row and third column.
   * @param {number} [m13=0] - The value for the second row and fourth column.
   * @param {number} [m20=0] - The value for the third row and first column.
   * @param {number} [m21=0] - The value for the third row and second column.
   * @param {number} [m22=1] - The value for the third row and third column.
   * @param {number} [m23=0] - The value for the third row and fourth column.
   * @param {number} [m30=0] - The value for the fourth row and first column.
   * @param {number} [m31=0] - The value for the fourth row and second column.
   * @param {number} [m32=0] - The value for the fourth row and third column.
   * @param {number} [m33=1] - The value for the fourth row and fourth column.
   */
  set(
    m00 = 1, m01 = 0, m02 = 0, m03 = 0,
    m10 = 0, m11 = 1, m12 = 0, m13 = 0,
    m20 = 0, m21 = 0, m22 = 1, m23 = 0,
    m30 = 0, m31 = 0, m32 = 0, m33 = 1,
  ) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m03 = m03;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    this.m23 = m23;
    this.m30 = m30;
    this.m31 = m31;
    this.m32 = m32;
    this.m33 = m33;
  }

  /**
   * Sets the values of this matrix from the given array.
   * The array must have at least 16 elements.
   *
   * @param {number[]} array - The array to read the values from.
   * @returns {Matrix4} This matrix.
   */
  setFromArray(array) {
    this.m00 = array[0];
    this.m01 = array[1];
    this.m02 = array[2];
    this.m03 = array[3];
    this.m10 = array[4];
    this.m11 = array[5];
    this.m12 = array[6];
    this.m13 = array[7];
    this.m20 = array[8];
    this.m21 = array[9];
    this.m22 = array[10];
    this.m23 = array[11];
    this.m30 = array[12];
    this.m31 = array[13];
    this.m32 = array[14];
    this.m33 = array[15];

    return this;
  }

  /**
   * Clones this matrix.
   *
   * @returns {Matrix4} The cloned matrix.
   */
  clone() {
    return new Matrix4(
      this.m00, this.m01, this.m02, this.m03, this.m10, this.m11, this.m12, this.m13, this.m20, this.m21, this.m22, this.m23, this.m30, this.m31, this.m32, this.m33,
    );
  }

  /**
   * Copies the values of a given matrix.
   *
   * @param {Matrix4} matrix - The matrix to copy.
   * @returns {Matrix4} This matrix.
   */
  copy(matrix) {
    this.m00 = matrix.m00;
    this.m01 = matrix.m01;
    this.m02 = matrix.m02;
    this.m03 = matrix.m03;
    this.m10 = matrix.m10;
    this.m11 = matrix.m11;
    this.m12 = matrix.m12;
    this.m13 = matrix.m13;
    this.m20 = matrix.m20;
    this.m21 = matrix.m21;
    this.m22 = matrix.m22;
    this.m23 = matrix.m23;
    this.m30 = matrix.m30;
    this.m31 = matrix.m31;
    this.m32 = matrix.m32;
    this.m33 = matrix.m33;

    return this;
  }

  /**
   * Sets this matrix to the identity matrix.
   *
   * @returns {Matrix4} This matrix.
   */
  identity() {
    this.set();

    return this;
  }

  /**
   * Transposes this matrix.
   *
   * @returns {Matrix4} This matrix.
   */
  transpose() {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;
    const m30 = this.m30;
    const m31 = this.m31;
    const m32 = this.m32;
    const m33 = this.m33;

    this.set(
      m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33,
    );

    return this;
  }

  /**
   * Inverts this matrix.
   *
   * @returns {Matrix4} This matrix.
   */
  invert() {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;
    const m30 = this.m30;
    const m31 = this.m31;
    const m32 = this.m32;
    const m33 = this.m33;

    const a00 = m00 * m11 - m01 * m10;
    const a01 = m00 * m12 - m02 * m10;
    const a02 = m00 * m13 - m03 * m10;
    const a03 = m01 * m12 - m02 * m11;
    const a04 = m01 * m13 - m03 * m11;
    const a05 = m02 * m13 - m03 * m12;
    const a06 = m20 * m31 - m21 * m30;
    const a07 = m20 * m32 - m22 * m30;
    const a08 = m20 * m33 - m23 * m30;
    const a09 = m21 * m32 - m22 * m31;
    const a10 = m21 * m33 - m23 * m31;
    const a11 = m22 * m33 - m23 * m32;

    const det = a00 * a11 - a01 * a10 + a02 * a09 + a03 * a08 - a04 * a07 + a05 * a06;

    if (det === 0) {
      throw new Error("Matrix4: Cannot invert a singular matrix.");
    }

    const invDet = 1 / det;

    this.set(
      (m11 * a11 - m12 * a10 + m13 * a09) * invDet,
      (-m01 * a11 + m02 * a10 - m03 * a09) * invDet,
      (m31 * a05 - m32 * a04 + m33 * a03) * invDet,
      (-m21 * a05 + m22 * a04 - m23 * a03) * invDet,
      (-m10 * a11 + m12 * a08 - m13 * a07) * invDet,
      (m00 * a11 - m02 * a08 + m03 * a07) * invDet,
      (-m30 * a05 + m32 * a02 - m33 * a01) * invDet,
      (m20 * a05 - m22 * a02 + m23 * a01) * invDet,
      (m10 * a10 - m11 * a08 + m13 * a06) * invDet,
      (-m00 * a10 + m01 * a08 - m03 * a06) * invDet,
      (m30 * a04 - m31 * a02 + m33 * a00) * invDet,
      (-m20 * a04 + m21 * a02 - m23 * a00) * invDet,
      (-m10 * a09 + m11 * a07 - m12 * a06) * invDet,
      (m00 * a09 - m01 * a07 + m02 * a06) * invDet,
      (-m30 * a03 + m31 * a01 - m32 * a00) * invDet,
      (m20 * a03 - m21 * a01 + m22 * a00) * invDet,
    );

    return this;
  }

  /**
   * Calculates adjoint of this matrix.
   * @returns {Matrix4} This matrix.
   */
  adjoint() {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;
    const m30 = this.m30;
    const m31 = this.m31;
    const m32 = this.m32;
    const m33 = this.m33;

    const a00 = m00 * m11 - m01 * m10;
    const a01 = m00 * m12 - m02 * m10;
    const a02 = m00 * m13 - m03 * m10;
    const a03 = m01 * m12 - m02 * m11;
    const a04 = m01 * m13 - m03 * m11;
    const a05 = m02 * m13 - m03 * m12;
    const a06 = m20 * m31 - m21 * m30;
    const a07 = m20 * m32 - m22 * m30;
    const a08 = m20 * m33 - m23 * m30;
    const a09 = m21 * m32 - m22 * m31;
    const a10 = m21 * m33 - m23 * m31;
    const a11 = m22 * m33 - m23 * m32;

    this.set(
      m11 * a11 - m12 * a10 + m13 * a09,
      -m01 * a11 + m02 * a10 - m03 * a09,
      m31 * a05 - m32 * a04 + m33 * a03,
      -m21 * a05 + m22 * a04 - m23 * a03,
      -m10 * a11 + m12 * a08 - m13 * a07,
      m00 * a11 - m02 * a08 + m03 * a07,
      -m30 * a05 + m32 * a02 - m33 * a01,
      m20 * a05 - m22 * a02 + m23 * a01,
      m10 * a10 - m11 * a08 + m13 * a06,
      -m00 * a10 + m01 * a08 - m03 * a06,
      m30 * a04 - m31 * a02 + m33 * a00,
      -m20 * a04 + m21 * a02 - m23 * a00,
      -m10 * a09 + m11 * a07 - m12 * a06,
      m00 * a09 - m01 * a07 + m02 * a06,
      -m30 * a03 + m31 * a01 - m32 * a00,
      m20 * a03 - m21 * a01 + m22 * a00,
    );

    return this;
  }

  /**
   * Calculates the determinant of a mat4
   * @returns {Number} determinant of a
   */
  determinant() {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;
    const m30 = this.m30;
    const m31 = this.m31;
    const m32 = this.m32;
    const m33 = this.m33;

    const a00 = m00 * m11 - m01 * m10;
    const a01 = m00 * m12 - m02 * m10;
    const a02 = m00 * m13 - m03 * m10;
    const a03 = m01 * m12 - m02 * m11;
    const a04 = m01 * m13 - m03 * m11;
    const a05 = m02 * m13 - m03 * m12;
    const a06 = m20 * m31 - m21 * m30;
    const a07 = m20 * m32 - m22 * m30;
    const a08 = m20 * m33 - m23 * m30;
    const a09 = m21 * m32 - m22 * m31;
    const a10 = m21 * m33 - m23 * m31;
    const a11 = m22 * m33 - m23 * m32;

    return (
      a00 * a11
      - a01 * a10
      + a02 * a09
      + a03 * a08
      - a04 * a07
      + a05 * a06
    );
  }

  /**
   * Multiplies two mat4's
   * @param {Matrix4} matrix matrix to multiply
   * @returns {Matrix4} This matrix.
   */
  multiply(matrix) {
    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;
    const m30 = this.m30;
    const m31 = this.m31;
    const m32 = this.m32;
    const m33 = this.m33;

    const a00 = matrix.m00;
    const a01 = matrix.m01;
    const a02 = matrix.m02;
    const a03 = matrix.m03;
    const a10 = matrix.m10;
    const a11 = matrix.m11;
    const a12 = matrix.m12;
    const a13 = matrix.m13;
    const a20 = matrix.m20;
    const a21 = matrix.m21;
    const a22 = matrix.m22;
    const a23 = matrix.m23;
    const a30 = matrix.m30;
    const a31 = matrix.m31;
    const a32 = matrix.m32;
    const a33 = matrix.m33;

    this.set(
      a00 * m00 + a01 * m10 + a02 * m20 + a03 * m30,
      a00 * m01 + a01 * m11 + a02 * m21 + a03 * m31,
      a00 * m02 + a01 * m12 + a02 * m22 + a03 * m32,
      a00 * m03 + a01 * m13 + a02 * m23 + a03 * m33,
      a10 * m00 + a11 * m10 + a12 * m20 + a13 * m30,
      a10 * m01 + a11 * m11 + a12 * m21 + a13 * m31,
      a10 * m02 + a11 * m12 + a12 * m22 + a13 * m32,
      a10 * m03 + a11 * m13 + a12 * m23 + a13 * m33,
      a20 * m00 + a21 * m10 + a22 * m20 + a23 * m30,
      a20 * m01 + a21 * m11 + a22 * m21 + a23 * m31,
      a20 * m02 + a21 * m12 + a22 * m22 + a23 * m32,
      a20 * m03 + a21 * m13 + a22 * m23 + a23 * m33,
      a30 * m00 + a31 * m10 + a32 * m20 + a33 * m30,
      a30 * m01 + a31 * m11 + a32 * m21 + a33 * m31,
      a30 * m02 + a31 * m12 + a32 * m22 + a33 * m32,
      a30 * m03 + a31 * m13 + a32 * m23 + a33 * m33,
    );

    return this;
  }

  /**
   * Translates a mat4 by the given vector
   * @param {Vector3} vector vector to translate by
   * @returns {Matrix4} This matrix.
   */
  translate(vector) {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;

    const m30 = this.m30;
    const m31 = this.m31;
    const m32 = this.m32;
    const m33 = this.m33;

    this.m30 = x * this.m00 + y * this.m10 + z * this.m20 + m30;
    this.m31 = x * this.m01 + y * this.m11 + z * this.m21 + m31;
    this.m32 = x * this.m02 + y * this.m12 + z * this.m22 + m32;
    this.m33 = x * this.m03 + y * this.m13 + z * this.m23 + m33;

    return this;
  }

  /**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {Vector3} vector The vec3 to scale the matrix by
 * @returns {Matrix4} This matrix.
 */
  scale(vector) {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;

    this.m00 *= x;
    this.m01 *= x;
    this.m02 *= x;
    this.m03 *= x;
    this.m10 *= y;
    this.m11 *= y;
    this.m12 *= y;
    this.m13 *= y;
    this.m20 *= z;
    this.m21 *= z;
    this.m22 *= z;
    this.m23 *= z;

    return this;
  }

  /**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {Number} rad the angle to rotate the matrix by
 * @param {Vector3} axis the axis to rotate around
 * @returns {Matrix4} This matrix.
 */
  rotate(rad, axis) {
    const x = axis.x;
    const y = axis.y;
    const z = axis.z;
    const len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < EPSILON) {
      return null;
    }

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    // Normalize axis
    const a00 = x * x * t + c;
    const a01 = y * x * t + z * s;
    const a02 = z * x * t - y * s;
    const a10 = x * y * t - z * s;
    const a11 = y * y * t + c;
    const a12 = z * y * t + x * s;
    const a20 = x * z * t + y * s;
    const a21 = y * z * t - x * s;
    const a22 = z * z * t + c;

    const b00 = this.m00;
    const b01 = this.m01;
    const b02 = this.m02;
    const b03 = this.m03;
    const b10 = this.m10;
    const b11 = this.m11;
    const b12 = this.m12;
    const b13 = this.m13;
    const b20 = this.m20;
    const b21 = this.m21;
    const b22 = this.m22;
    const b23 = this.m23;

    this.m00 = a00 * b00 + a01 * b10 + a02 * b20;
    this.m01 = a00 * b01 + a01 * b11 + a02 * b21;
    this.m02 = a00 * b02 + a01 * b12 + a02 * b22;
    this.m03 = a00 * b03 + a01 * b13 + a02 * b23;
    this.m10 = a10 * b00 + a11 * b10 + a12 * b20;
    this.m11 = a10 * b01 + a11 * b11 + a12 * b21;
    this.m12 = a10 * b02 + a11 * b12 + a12 * b22;
    this.m13 = a10 * b03 + a11 * b13 + a12 * b23;
    this.m20 = a20 * b00 + a21 * b10 + a22 * b20;
    this.m21 = a20 * b01 + a21 * b11 + a22 * b21;
    this.m22 = a20 * b02 + a21 * b12 + a22 * b22;
    this.m23 = a20 * b03 + a21 * b13 + a22 * b23;

    return this;
  }

  /**
   * Rotates a matrix by the given angle around the X axis
   * @param {Number} rad angle to rotate by
   * @returns {Matrix4} This matrix.
   */
  rotateX(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;

    this.m10 = m10 * c + m20 * s;
    this.m11 = m11 * c + m21 * s;
    this.m12 = m12 * c + m22 * s;
    this.m13 = m13 * c + m23 * s;
    this.m20 = m20 * c - m10 * s;
    this.m21 = m21 * c - m11 * s;
    this.m22 = m22 * c - m12 * s;
    this.m23 = m23 * c - m13 * s;

    return this;
  }

  /**
   * Rotates a matrix by the given angle around the Y axis
   * @param {Number} rad angle to rotate by
   * @returns {Matrix4} This matrix.
   */
  rotateY(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m20 = this.m20;
    const m21 = this.m21;
    const m22 = this.m22;
    const m23 = this.m23;

    this.m00 = m00 * c - m20 * s;
    this.m01 = m01 * c - m21 * s;
    this.m02 = m02 * c - m22 * s;
    this.m03 = m03 * c - m23 * s;
    this.m20 = m00 * s + m20 * c;
    this.m21 = m01 * s + m21 * c;
    this.m22 = m02 * s + m22 * c;
    this.m23 = m03 * s + m23 * c;

    return this;
  }

  /**
   * Rotates a matrix by the given angle around the Z axis
   * @param {Number} rad angle to rotate by
   * @returns {Matrix4} This matrix.
   */
  rotateZ(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    const m00 = this.m00;
    const m01 = this.m01;
    const m02 = this.m02;
    const m03 = this.m03;
    const m10 = this.m10;
    const m11 = this.m11;
    const m12 = this.m12;
    const m13 = this.m13;

    this.m00 = m00 * c + m10 * s;
    this.m01 = m01 * c + m11 * s;
    this.m02 = m02 * c + m12 * s;
    this.m03 = m03 * c + m13 * s;
    this.m10 = m10 * c - m00 * s;
    this.m11 = m11 * c - m01 * s;
    this.m12 = m12 * c - m02 * s;
    this.m13 = m13 * c - m03 * s;

    return this;
  }

  /**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     identity();
 *     translate(vec);
 * @param {Vector3} vector Translation vector
 * @returns {Matrix4} This matrix.
 */
  fromTranslation(vector) {
    this.m00 = 1;
    this.m01 = 0;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m30 = vector.x;
    this.m31 = vector.y;
    this.m32 = vector.z;
    this.m33 = 1;
    return this;
  }

  /**
   * Creates a matrix from a vector scaling
   * This is equivalent to (but much faster than):
   *    identity();
   *   scale(vec);
   * @param {Vector3} vector Scaling vector
   * @returns {Matrix4} This matrix.
   */
  fromScaling(vector) {
    this.m00 = vector.x;
    this.m01 = 0;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = vector.y;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = 0;
    this.m22 = vector.z;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
    return this;
  }

  /**
   * Creates a matrix from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *    identity();
   *   rotate(angle, axis);
   * @param {Vector3} axis The axis around which to rotate
   * @param {Number} rad The angle in radians
   * @returns {Matrix4} This matrix.
   */
  fromRotation(axis, rad) {
    let x = axis.x;
    let y = axis.y;
    let z = axis.z;
    let len = Math.hypot(x, y, z);

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    this.m00 = x * x * t + c;
    this.m01 = y * x * t + z * s;
    this.m02 = z * x * t - y * s;
    this.m03 = 0;
    this.m10 = x * y * t - z * s;
    this.m11 = y * y * t + c;
    this.m12 = z * y * t + x * s;
    this.m13 = 0;
    this.m20 = x * z * t + y * s;
    this.m21 = y * z * t - x * s;
    this.m22 = z * z * t + c;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;

    return this;
  }

  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *   identity();
   *  rotateX(angle);
   * @param {Number} rad The angle to rotate around the X axis in radians
   * @returns {Matrix4} This matrix.
   */
  fromXRotation(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    this.m00 = 1;
    this.m01 = 0;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = c;
    this.m12 = s;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = -s;
    this.m22 = c;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;

    return this;
  }

  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *  identity();
   * rotateY(angle);
   * @param {Number} rad The angle to rotate around the Y axis in radians
   * @returns {Matrix4} This matrix.
   */
  fromYRotation(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    this.m00 = c;
    this.m01 = 0;
    this.m02 = -s;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = 1;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = s;
    this.m21 = 0;
    this.m22 = c;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;

    return this;
  }

  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   * identity();
   * rotateZ(angle);
   * @param {Number} rad The angle to rotate around the Z axis in radians
   * @returns {Matrix4} This matrix.
   */
  fromZRotation(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);

    this.m00 = c;
    this.m01 = s;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = -s;
    this.m11 = c;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = 0;
    this.m22 = 1;
    this.m23 = 0;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;

    return this;
  }

  /**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 * identity();
 * translate(vec);
 * let quatMat = new Matrix4();
 * quatMat = quatMat.fromQuat(quat);
 * multiply(quatMat);
 * @param {Quaternion} quaternion Rotation quaternion
 * @param {Vector3} vector Translation vector
 * @returns {Matrix4} This matrix.
 */

  fromRotationTranslation(quaternion, vector) {
    // Quaternion math
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

    this.m00 = 1 - yy - zz;
    this.m01 = yx + wz;
    this.m02 = zx - wy;
    this.m03 = 0;
    this.m10 = yx - wz;
    this.m11 = 1 - xx - zz;
    this.m12 = zy + wx;
    this.m13 = 0;
    this.m20 = zx + wy;
    this.m21 = zy - wx;
    this.m22 = 1 - xx - yy;
    this.m23 = 0;

    this.m30 = vector.x;
    this.m31 = vector.y;
    this.m32 = vector.z;
    this.m33 = 1;

    return this;
  }

  /**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @returns {Vector3} translation vector
 */
  getTranslation() {
    return new Vector3(this.m30, this.m31, this.m32);
  }

  /**
   * Returns the scaling factor component of a transformation
   * matrix. If a matrix is built with fromRotationTranslationScale
   * with a normalized Quaternion paramter, the returned vector will be
   * the same as the scaling vector
   * originally supplied.
   * @returns {Vector3} Scaling vector
   */
  getScaling() {
    const m11 = this.m00;
    const m12 = this.m01;
    const m13 = this.m02;
    const m21 = this.m10;
    const m22 = this.m11;
    const m23 = this.m12;
    const m31 = this.m20;
    const m32 = this.m21;
    const m33 = this.m22;

    return new Vector3(
      Math.hypot(m11, m12, m13),
      Math.hypot(m21, m22, m23),
      Math.hypot(m31, m32, m33),
    );
  }

  /**
   * Looks at the center of the matrix from the eye position
   * @param {Vector3} eye The position of the eye
   * @param {Vector3} center The position looked at
   * @param {Vector3} up vec3 pointing up
   * @returns {Matrix4} This matrix.
   */
  lookAt(eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye.x;
    let eyey = eye.y;
    let eyez = eye.z;
    let upx = up.x;
    let upy = up.y;
    let upz = up.z;
    let centerx = center.x;
    let centery = center.y;
    let centerz = center.z;

    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      this.identity();
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);

    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    }
    else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);

    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    }
    else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    this.m00 = x0;
    this.m01 = y0;
    this.m02 = z0;
    this.m03 = 0;
    this.m10 = x1;
    this.m11 = y1;
    this.m12 = z1;
    this.m13 = 0;
    this.m20 = x2;
    this.m21 = y2;
    this.m22 = z2;
    this.m23 = 0;
    this.m30 = -(x0 * eyex + x1 * eyey + x2 * eyez);
    this.m31 = -(y0 * eyex + y1 * eyey + y2 * eyez);
    this.m32 = -(z0 * eyex + z1 * eyey + z2 * eyez);
    this.m33 = 1;

    return this;
  }

  /**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {number} fov Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {Matrix4} This matrix.
 */
  perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    this.m00 = f / aspect;
    this.m01 = 0;
    this.m02 = 0;
    this.m03 = 0;
    this.m10 = 0;
    this.m11 = f;
    this.m12 = 0;
    this.m13 = 0;
    this.m20 = 0;
    this.m21 = 0;
    this.m22 = (far && far !== Infinity) ? far * nf : -1;
    this.m23 = -1;
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = (far && far !== Infinity) ? near * far * nf : -near;
    this.m33 = 0;
    return this;
  }

  /**
   * Get the array of elements of this matrix.
   * @returns {Float32Array} The elements of this matrix.
   */
  get elements() {
    if (this._array) {
      this._array[0] = this.m00;
      this._array[1] = this.m01;
      this._array[2] = this.m02;
      this._array[3] = this.m03;
      this._array[4] = this.m10;
      this._array[5] = this.m11;
      this._array[6] = this.m12;
      this._array[7] = this.m13;
      this._array[8] = this.m20;
      this._array[9] = this.m21;
      this._array[10] = this.m22;
      this._array[11] = this.m23;
      this._array[12] = this.m30;
      this._array[13] = this.m31;
      this._array[14] = this.m32;
      this._array[15] = this.m33;
    }
    else {
      this._array = new Float32Array([
        this.m00, this.m01, this.m02, this.m03,
        this.m10, this.m11, this.m12, this.m13,
        this.m20, this.m21, this.m22, this.m23,
        this.m30, this.m31, this.m32, this.m33,
      ]);
    }
    return this._array;
  }
}
