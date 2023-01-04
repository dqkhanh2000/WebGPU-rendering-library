import { uuid } from "../utils/uuid.js";

class Vector {
  _array;

  _map;

  constructor(array) {
    this._array = array;
    this._map = new Map();
  }

  get size() {
    return this._array.length;
  }

  _get(index) {
    return this._array?.[index];
  }

  _set(index, value) {
    this._array[index] = value;
    this._trigger();
  }

  _trigger() {
    this._map.forEach((fn) => fn());
  }

  onChange(callback) {
    const id = uuid();
    this._map.set(id, callback);
    return () => this._map.delete(id);
  }

  len() {
    return Math.sqrt(this._array.reduce((acc, t) => acc + t * t, 0));
  }

  norminize() {
    const len = this.len();
    this._array.forEach((v, i) => this._array[i] = v / len);
    this._trigger();
    return this;
  }

  add(value) {
    if (typeof value === "number") {
      this._array.forEach((v, i) => this._array[i] = v + value);
    }
    else {
      this._array.forEach((v, i) => this._array[i] = v + value._get(i));
    }
    this._trigger();
    return this;
  }

  sub(value) {
    if (typeof value === "number") {
      this._array.forEach((v, i) => this._array[i] = v - value);
    }
    else {
      this._array.forEach((v, i) => this._array[i] = v - value._get(i));
    }
    this._trigger();
    return this;
  }

  mul(value) {
    if (typeof value === "number") {
      this._array.forEach((v, i) => this._array[i] = v * value);
    }
    else {
      this._array.forEach((v, i) => this._array[i] = v * value._get(i));
    }
    this._trigger();
    return this;
  }

  div(value) {
    if (typeof value === "number") {
      this._array.forEach((v, i) => this._array[i] = v / value);
    }
    else {
      this._array.forEach((v, i) => this._array[i] = v / value._get(i));
    }
    this._trigger();
    return this;
  }

  copy(v) {
    for (let i = 0; i < this._array.length; i++) {
      this._array[i] = v._array[i];
    }
    this._trigger();
    return this;
  }

  clone() {
    return new Vector(this.toArray());
  }

  toArray() {
    return [...this._array];
  }
}
class Vector2 extends Vector {
  constructor(x = 0, y = 0) {
    super([x, y]);
  }

  static one() {
    return new Vector2(1, 1);
  }

  static zero() {
    return new Vector2(0, 0);
  }

  get x() {
    return this._get(0);
  }

  set x(v) {
    this._set(0, v);
  }

  get y() {
    return this._get(1);
  }

  set y(v) {
    this._set(1, v);
  }

  set(x, y) {
    this._array[0] = x;
    this._array[1] = y;
    this._trigger();
    return this;
  }

  clone() {
    return new Vector2(...this.toArray());
  }
}
class Vector3 extends Vector {
  constructor(x = 0, y = 0, z = 0) {
    super([x, y, z]);
  }

  static up() {
    return new Vector3(0, 1, 0);
  }

  static bottom() {
    return new Vector3(0, -1, 0);
  }

  static right() {
    return new Vector3(1, 0, 0);
  }

  static left() {
    return new Vector3(-1, 0, 0);
  }

  static front() {
    return new Vector3(0, 0, 1);
  }

  static back() {
    return new Vector3(0, 0, -1);
  }

  static one() {
    return new Vector3(1, 1, 1);
  }

  static zero() {
    return new Vector3(0, 0, 0);
  }

  get x() {
    return this._get(0);
  }

  set x(v) {
    this._set(0, v);
  }

  get y() {
    return this._get(1);
  }

  set y(v) {
    this._set(1, v);
  }

  get z() {
    return this._get(2);
  }

  set z(v) {
    this._set(2, v);
  }

  set(x, y, z) {
    this._array[0] = x;
    this._array[1] = y;
    this._array[2] = z;
    this._trigger();
    return this;
  }

  clone() {
    return new Vector3(...this.toArray());
  }

  cross(v) {
    const [ax, ay, az] = this._array;
    const [bx, by, bz] = v._array;
    this._array[0] = ay * bz - az * by;
    this._array[1] = az * bx - ax * bz;
    this._array[2] = ax * by - ay * bx;
    this._trigger();
    return this;
  }
}
class Vector4 extends Vector {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    super([x, y, z, w]);
  }

  get x() {
    return this._get(0);
  }

  set x(v) {
    this._set(0, v);
  }

  get y() {
    return this._get(1);
  }

  set y(v) {
    this._set(1, v);
  }

  get z() {
    return this._get(2);
  }

  set z(v) {
    this._set(2, v);
  }

  get w() {
    return this._get(3);
  }

  set w(v) {
    this._set(3, v);
  }

  get xyz() {
    return [this.x, this.y, this.z];
  }

  set(x, y, z, w) {
    this._array[0] = x;
    this._array[1] = y;
    this._array[2] = z;
    this._array[3] = w;
    this._trigger();
    return this;
  }

  clone() {
    return new Vector4(...this.toArray());
  }
}

export { Vector, Vector2, Vector3, Vector4 };
