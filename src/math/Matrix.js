import { mat4, mat3 } from "gl-matrix";

class Matrix4 {
  _array;

  constructor(value) {
    this._array = value ?? mat4.create();
  }

  get array() {
    return this._array;
  }

  get buffer() {
    return this.array.buffer;
  }

  identity() {
    mat4.identity(this._array);
    return this;
  }

  lookAt(eye, center, up) {
    mat4.lookAt(this._array, eye.toArray(), center.toArray(), up.toArray());
    return this;
  }

  perspective(fov, aspect, near, far) {
    mat4.perspective(this._array, fov, aspect, near, far);
    return this;
  }

  mulLeft(v) {
    mat4.mul(this._array, v._array, this._array);
    return this;
  }

  mulRight(v) {
    mat4.mul(this._array, this._array, v._array);
    return this;
  }

  invert() {
    mat4.invert(this._array, this._array);
    return this;
  }

  transpose() {
    mat4.transpose(this._array, this._array);
    return this;
  }

  translate(v) {
    mat4.translate(this._array, this._array, v.toArray());
    return this;
  }

  scale(v) {
    mat4.scale(this._array, this._array, v.toArray());
    return this;
  }

  rotate(radians, axis) {
    mat4.rotate(this._array, this._array, radians, axis.toArray());
    return this;
  }

  copy(v) {
    mat4.copy(this._array, v._array);
    return this;
  }

  clone() {
    return new Matrix4(new Float32Array(this._array));
  }
}
class Matrix3 {
  _array;

  constructor(value) {
    this._array = value ?? mat3.create();
  }

  get array() {
    return this._array;
  }

  get buffer() {
    return this.array.buffer;
  }

  identity() {
    mat3.identity(this._array);
    return this;
  }

  mulLeft(v) {
    mat3.mul(this._array, v._array, this._array);
    return this;
  }

  mulRight(v) {
    mat3.mul(this._array, this._array, v._array);
    return this;
  }

  invert() {
    mat3.invert(this._array, this._array);
    return this;
  }

  transpose() {
    mat3.transpose(this._array, this._array);
    return this;
  }

  copy(v) {
    mat3.copy(this._array, v._array);
    return this;
  }

  clone() {
    return new Matrix3(new Float32Array(this._array));
  }

  fromMat4(v) {
    mat3.fromMat4(this._array, v.array);
    return this;
  }
}

export { Matrix3, Matrix4 };
