class RenderPipeline {
  gpu;

  _vertexShaderModule;

  _fragmentShaderModule;

  _presentationFormat;

  _vertexState;

  _fragmentState;

  _bindGroupLayoutEntries;

  _vertexBufferLayouts;

  _premitive;

  _depthStencil;

  _pipeline;

  _pipelineLayout;

  constructor(gpu, props) {
    const { device, preferredFormat } = gpu;
    this.gpu = gpu;
    this._bindGroupLayoutEntries = props.bindGroupLayouts;
    this._vertexBufferLayouts = props.vertexBufferLayouts;
    this._vertexShaderModule = props.vertexShaderModule;
    this._fragmentShaderModule = props.fragmentShaderModule;
    this._presentationFormat = props.presentationFormat ?? preferredFormat;
    this._premitive = props.premitive ?? {
      topology : "triangle-list",
      cullMode : "back",
    };
    this._depthStencil = props.depthStencil ?? {
      depthWriteEnabled : true,
      depthCompare      : "less",
      format            : "depth24plus",
    };
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
          { format: this._presentationFormat },
        ],
      };
    }
    this._pipeline = device.createRenderPipeline({
      layout       : this._pipelineLayout,
      vertex       : this._vertexState,
      fragment     : this._fragmentState,
      primitive    : this._premitive,
      depthStencil : this._depthStencil,
    });
  }

  get pipeline() {
    return this._pipeline;
  }
}

export { RenderPipeline };
