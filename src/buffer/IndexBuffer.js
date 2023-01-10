import { GPUBufferUsage } from "../utils/WebGPUTypes.js";
import { BufferObject } from "./BufferObject.js";

class IndexBuffer extends BufferObject {
  format;

  constructor(props) {
    super({
      label            : "[INDEX_BUFFER]",
      initData         : props.data,
      usage            : GPUBufferUsage?.INDEX,
      mappedAtCreation : true,
    });
    this.format = this.data instanceof Uint16Array ? "uint16" : "uint32";
  }

  attach(device, renderPass) {
    renderPass.setIndexBuffer(this.getBuffer(device), this.format);
  }
}

export { IndexBuffer };
