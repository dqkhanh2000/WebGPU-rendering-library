import { GPUBufferUsage } from "../utils/WebGPUTypes";

/**
 * A typed array of 32-bit float values. The contents are initialized to 0. If the requested number of bytes could not be allocated an exception is raised.
 * @typedef {Float32Array|Int32Array|Uint32Array|Int16Array|Uint16Array|Int8Array|Uint8Array} TypedArray
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
 */

/**
 * A class for creating and managing a buffer object in a graphics or compute context.
 *
 * @class
 */
export class BufferObject {
  /**
   * A string label that can be used to identify the buffer in debug messages.
   * @type {string}
   */
  label;

  /**
   * The buffer size in bytes.
   * @type {number}
   */
  size;

  /**
   * The buffer usage.
   * @type {GPUBufferUsage}
   * @default GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  */
  usage;

  /**
   * A boolean indicating whether the buffer should be mapped (i.e., made accessible to the CPU) at the time it is created.
   * @type {boolean}
   * @default false
   */
  mappedAtCreation;

  /**
   * The buffer data.
   * @type {TypedArray}
   */
  data;

  /**
   * The GPU buffer.
   * @type {GPUBuffer}
   * @private
   */
  _buffer;

  /**
   * Creates a new BufferObject instance.
   *
   * @param {Object} options - The options object.
   * @param {TypedArray} options.data - A typed array containing data to be stored in the buffer.
   * @param {number} options.size - The number of bytes in the buffer. This is required if `data` is not provided.
   * @param {string|number} options.usage - A string or number indicating the intended usage of the buffer.
   * @param {boolean} [options.mappedAtCreation=false] - A boolean indicating whether the buffer should be mapped (i.e., made accessible to the CPU) at the time it is created.
   * @param {string} [options.label] - A string label that can be used to identify the buffer in debug messages.
   */
  constructor({ data, size = 0, usage = (GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST), mappedAtCreation = false, label = "" } = {}) {
    this.label = label;
    this.usage = usage;
    this.mappedAtCreation = mappedAtCreation || !!data;
    this.data = data;
    this.size = data?.byteLength ?? size;
  }

  /**
   * Returns the GPU buffer.
   * @param {GPUDevice} device - The GPU device.
   * @returns {GPUBuffer} The GPU buffer.
   */
  getBuffer(device) {
    if (!this._buffer) {
      this._buffer = device.createBuffer({
        size             : this.size,
        usage            : this.usage,
        label            : this.label,
        mappedAtCreation : this.mappedAtCreation,
      });
      if (this.data) {
        let mappedRanger = this._buffer.getMappedRange();
        if (this.data instanceof Float32Array) {
          new Float32Array(mappedRanger).set(this.data);
        }
        else if (this.data instanceof Int32Array) {
          new Int32Array(mappedRanger).set(this.data);
        }
        else if (this.data instanceof Uint32Array) {
          new Uint32Array(mappedRanger).set(this.data);
        }
        else if (this.data instanceof Int16Array) {
          new Int16Array(mappedRanger).set(this.data);
        }
        else if (this.data instanceof Uint16Array) {
          new Uint16Array(mappedRanger).set(this.data);
        }
        else if (this.data instanceof Int8Array) {
          new Int8Array(mappedRanger).set(this.data);
        }
        else if (this.data instanceof Uint8Array) {
          new Uint8Array(mappedRanger).set(this.data);
        }
        else {
          throw new Error("unsupported typed array type");
        }
        this._buffer.unmap();
      }
    }
    return this._buffer;
  }

  /**
   * Writes data to the buffer.
   * @param {GPUDevice} device - The GPU device.
   * @param {TypedArray} data - A typed array containing data to be written to the buffer.
   * @param {number} [bufferOffset=0] - The offset in bytes from the start of the buffer to the start of the data to be written.
   * @param {number} [dataOffset=0] - The offset in bytes from the start of the data to the start of the data to be written.
   */
  writeBuffer(device, data, bufferOffset = 0, dataOffset = 0) {
    device.queue.writeBuffer(this.getBuffer(device), bufferOffset, data, dataOffset, data.byteLength);
  }

  /**
   * Destroys the buffer.
   * @param {GPUDevice} device - The GPU device.
   */
  destroy() {
    this._buffer?.destroy();
    this._buffer = undefined;
  }
}
