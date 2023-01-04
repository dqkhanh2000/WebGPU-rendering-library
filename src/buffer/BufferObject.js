const GPUBufferUsage = window.GPUBufferUsage;
class BufferObject {
  label;

  size;

  usage;

  mappedAtCreation;

  data;

  _buffer;

  constructor(props) {
    this.label = props.label ?? "";
    this.usage = props.usage ?? (GPUBufferUsage?.VERTEX | GPUBufferUsage?.COPY_DST);
    this.mappedAtCreation = props.mappedAtCreation ?? (!!props.initData);
    this.data = props.initData;
    this.size = props.initData?.byteLength ?? props.size ?? 0;
  }

  getBuffer(device) {
    if (!this._buffer) {
      this._buffer = device.createBuffer({
        size             : this.size,
        usage            : this.usage,
        label            : this.label,
        mappedAtCreation : this.mappedAtCreation,
      });
      if (this.data) {
        // eslint-disable-next-line no-proto
        const ArrayClass = this.data.__proto__.constructor;
        new ArrayClass(this._buffer.getMappedRange()).set(this.data);
        this._buffer.unmap();
      }
    }
    return this._buffer;
  }

  writeBuffer(device, data, bufferOffset = 0, dataOffset = 0) {
    device.queue.writeBuffer(this.getBuffer(device), bufferOffset, data, dataOffset, data.byteLength);
  }

  destroy() {
    this._buffer?.destroy();
    this._buffer = undefined;
  }
}

export { BufferObject };
