import { GPUBufferUsage } from "../utils/WebGPUTypes.js";
import { BufferObject } from "./BufferObject.js";

/**
 * A class for creating and managing an index buffer object in a graphics or compute context.
 * @class
 * @extends BufferObject
 */
export class IndexBuffer extends BufferObject {
  /**
   * The index buffer format.
   * @type {string}
   * @default "uint16"
   */
  format;

  /**
   * Creates a new IndexBuffer instance.
   *
   * @param {Object} options - The options object.
   * @param {Uint16Array|Uint32Array} options.data - A typed array containing data to be stored in the buffer.
   * @param {string} [options.label] - A string label that can be used to identify the buffer in debug messages.
   */
  constructor({ data, label = "[INDEX_BUFFER]" } = {}) {
    super({
      label            : label,
      data             : data,
      usage            : GPUBufferUsage.INDEX,
      mappedAtCreation : true,
    });
    this.format = this.data instanceof Uint16Array ? "uint16" : "uint32";
  }

  /**
   * Sets the index buffer on the render pass.
   * @param {Device} device - The device.
   * @param {RenderPass} renderPass - The render pass.
   */
  attach(device, renderPass) {
    renderPass.setIndexBuffer(this.getBuffer(device), this.format);
  }
}
