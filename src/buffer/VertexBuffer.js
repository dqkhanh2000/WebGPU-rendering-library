import { GPUBufferUsage } from "../utils/WebGPUTypes.js";
// eslint-disable-next-line no-unused-vars
import { BufferAttribute } from "./bufferAttributes.js";
import { BufferObject } from "./BufferObject.js";

/**
 * A class for creating and managing a vertex buffer object in a graphics or compute context.
 * @class
 * @extends BufferObject
 */
class VertexBuffer extends BufferObject {

  /**
   * The buffer name.
   * @type {string}
   */
  name;

  /**
   * The buffer location. In the vertex shader, the location is specified follow example is 0: `@location(0) position: vec4<f32>,`
   * @type {number}
   */
  location;

  /**
   * The buffer format.
   * @type {GPUVertexFormat}
   */
  format;

  /**
   * The buffer stride length. The number of elements in the buffer.
   * @type {number}
   */
  strideLength;

  /**
   * The buffer stride size. The number of bytes in the buffer.
   * @type {number}
   * @default strideLength * (data?.BYTES_PER_ELEMENT ?? 4)
   */
  strideSize;

  /**
   * The buffer attribute.
   * @type {BufferAttribute}
   */
  attribute;

  /**
   * The buffer layout. The buffer layout is used to describe the layout of the buffer data.
   * @type {GPUVertexBufferLayout}
   */
  bufferLayout;

  /**
   * Creates a new VertexBuffer instance.
   * @param {Object} options - The options object.
   * @param {string} options.name - The buffer name.
   * @param {import("./BufferObject.js").TypedArray} options.data - A typed array containing data to be stored in the buffer.
   * @param {number} options.format
   */
  constructor(props) {
    const name = props.name ?? "";
    super({
      data  : props.data,
      label : `[VERTEX_BUFFER] ${name}`,
      usage : GPUBufferUsage.VERTEX,
    });
    this.name = name;
    this.format = props.format;
    this.location = props.location;
    this.strideLength = props.strideLength;
    this.strideSize = props.strideSize ?? props.strideLength * (props.data?.BYTES_PER_ELEMENT ?? 4);
    this.attribute = {
      shaderLocation : this.location,
      format         : this.format,
      offset         : 0,
    };
    this.bufferLayout = {
      arrayStride : this.strideSize,
      attributes  : [this.attribute],
    };
  }

  attach(device, passEncoder) {
    passEncoder.setVertexBuffer(this.location, this.getBuffer(device));
  }
}

export { VertexBuffer };
