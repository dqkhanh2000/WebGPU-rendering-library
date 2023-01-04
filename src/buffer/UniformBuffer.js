import { BufferObject } from "./BufferObject.js";

const GPUBufferUsage = window.GPUBufferUsage;
const GPUShaderStage = window.GPUShaderStage;
class UniformBuffer extends BufferObject {
  binding;

  name;

  visibility;

  items;

  layoutEntry;

  _bindGroupEntry;

  _offsetMap = new Map();

  constructor(props) {
    // const size = props.items.reduce((acc, item) => acc + item.size, 0);
    super({
      label : `[UNIFORM_BUFFER] ${props.name ?? ""}`,
      usage : GPUBufferUsage?.UNIFORM | GPUBufferUsage?.COPY_DST,
      size  : props.items.reduce((acc, item) => acc + item.size, 0),
    });
    const name = props.name ?? "";
    this.name = name;
    this.binding = props.binding;
    this.visibility = props.visibility ?? (GPUShaderStage?.VERTEX | GPUShaderStage?.FRAGMENT);
    this.items = props.items;
    for (let i = 0; i < this.items.length; ++i) {
      const lastItem = this.items?.[i - 1];
      const offset = (lastItem?.offset ?? 0) + (lastItem?.size ?? 0);
      this.items[i].offset = offset;
      this._offsetMap.set(this.items[i].name, offset);
    }
    this.layoutEntry = {
      binding    : this.binding,
      visibility : this.visibility,
      buffer     : {
        type: "uniform",
      },
    };
  }

  getBindGroupEntry(device) {
    if (!this._bindGroupEntry) {
      this._bindGroupEntry = {
        binding  : this.binding,
        resource : {
          offset : 0,
          buffer : this.getBuffer(device),
          size   : this.size,
        },
      };
    }
    return this._bindGroupEntry;
  }

  set(device, name, data) {
    if (this._offsetMap.has(name)) {
      this.writeBuffer(device, data, this._offsetMap.get(name));
    }
  }
}

export { UniformBuffer };
