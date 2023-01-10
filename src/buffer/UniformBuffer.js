import { GPUBufferUsage, GPUShaderStage } from "../utils/WebGPUTypes.js";
import { BufferObject } from "./BufferObject.js";

/**
 * A class for creating and managing a uniform buffer object in a graphics or compute context.
 * @class
 * @extends BufferObject
 */
export class UniformBuffer extends BufferObject {
  /**
   * The buffer binding.
   * @type {number}
   */
  binding;

  /**
   * The buffer name.
   * @type {string}
   */
  name;

  /**
   * The buffer visibility.
   * @type {GPUShaderStage}
   * @default GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT
   */
  visibility;

  /**
   * The buffer items.
   * @type {Array}
   */
  items;

  /**
   * The buffer layout entry.
   * @type {GPUBindGroupLayoutEntry}
   */
  layoutEntry;

  /**
   * The buffer bind group entry.
   * @type {GPUBindGroupEntry}
   * @private
   */
  _bindGroupEntry;

  /**
   * The buffer offset map.
   * @type {Map}
   * @private
   */
  _offsetMap = new Map();


  /**
   * Creates a new UniformBuffer instance.
   * @param {Object} options - The options object.
   * @param {string} options.name - The buffer name.
   * @param {number} options.binding - The buffer binding.
   * @param {number} [options.visibility] - The buffer visibility.
   * @param {Array} [options.items] - The buffer items.
   */
  constructor({ name, binding, visibility = (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT), items = [] } = {}) {
    super({
      label : `[UNIFORM_BUFFER] ${name}`,
      usage : GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      size  : items.reduce((acc, item) => acc + item.size, 0),
    });
    this.name = name;
    this.binding = binding;
    this.visibility = visibility;
    this.items = items;
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

  /**
   * Gets the buffer layout entry.
   * @param {Device} device - The device.
   * @returns {GPUBindGroupLayoutEntry}
   */
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

  /**
   * Sets the buffer data.
   * @param {Device} device - The device.
   * @param {string} name - The buffer name.
   * @param {ArrayBuffer} data - The buffer data.
   */
  set(device, name, data) {
    if (this._offsetMap.has(name)) {
      this.writeBuffer(device, data, this._offsetMap.get(name));
    }
  }
}
