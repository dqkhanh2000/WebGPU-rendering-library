/**
 * Class representing a Render Pipeline.
 */
class RenderPipeline {
  gpu;

  _blend;

  _vertexShaderModule;

  _fragmentShaderModule;

  _presentationFormat;

  _vertexState;

  _fragmentState;

  _bindGroupLayoutEntries;

  _vertexBufferLayouts;

  _primitive;

  _depthStencil;

  _pipeline;

  _pipelineLayout;

  /**
   * @param {gpu} gpu - The GPU object.
   * @param {Object} props - The properties for the pipeline.
   * @param {Array} props.bindGroupLayouts - The bind group layouts.
   * @param {Array} props.vertexBufferLayouts - The vertex buffer layouts.
   * @param {module} props.vertexShaderModule - The vertex shader module.
   * @param {module} props.fragmentShaderModule - The fragment shader module.
   * @param {string} props.presentationFormat - The presentation format (optional).
   * @param {Object} props.primitive - The primitive object (optional).
   * @param {Object} props.depthStencil - The depth stencil object (optional).
   * @param {Object} props.blend - The blend object (optional).
   */
  constructor(gpu, props) {
    const { device, preferredFormat } = gpu;
    this.gpu = gpu;
    this._bindGroupLayoutEntries = props.bindGroupLayouts;
    this._vertexBufferLayouts = props.vertexBufferLayouts;
    this._vertexShaderModule = props.vertexShaderModule;
    this._fragmentShaderModule = props.fragmentShaderModule;
    this._presentationFormat = props.presentationFormat ?? preferredFormat;
    this._primitive = props.primitive ?? {
      topology : "triangle-list",
      cullMode : "back",
    };
    this._depthStencil = props.depthStencil ?? {
      depthWriteEnabled : true,
      depthCompare      : "less",
      format            : "depth24plus",
    };
    this._blend = props.blend;
    if (this._bindGroupLayoutEntries) {
      this._pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: this._bindGroupLayoutEntries.map((entries) => device.createBindGroupLayout({ entries })),
      });
    }
    this._vertexState = {
      module     : this._vertexShaderModule,
      buffers    : this._vertexBufferLayouts,
      entryPoint : "main",
    };
    if (this._fragmentShaderModule && this._presentationFormat) {
      this._fragmentState = {
        module     : this._fragmentShaderModule,
        entryPoint : "main",
        targets    : [
          {
            format: this._presentationFormat,
          },
        ],
      };
      if (this._blend) {
        this._fragmentState.targets[0].blend = this._blend;
      }

    }
    this._pipeline = device.createRenderPipeline({
      layout       : this._pipelineLayout,
      vertex       : this._vertexState,
      fragment     : this._fragmentState,
      primitive    : this._primitive,
      depthStencil : this._depthStencil,
    });
  }

  /**
   * Returns the render pipeline object.
   * @return {Object}
   */
  get pipeline() {
    return this._pipeline;
  }
}

export { RenderPipeline };
