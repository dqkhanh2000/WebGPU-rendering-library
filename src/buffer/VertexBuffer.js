import { GPUBufferUsage } from "../utils/WebGPUTypes.js";
import { BufferAttribute } from "./bufferAttributes.js";
import { BufferObject } from "./BufferObject.js";

class VertexBuffer extends BufferObject {
  name;

  location;

  format;

  strideLength;

  strideSize;

  attribute;

  bufferLayout;

  constructor(props) {
    const name = props.name ?? "";
    super({
      initData : props.data,
      label    : `[VERTEX_BUFFER] ${name}`,
      usage    : GPUBufferUsage?.VERTEX,
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
