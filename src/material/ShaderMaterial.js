class ShaderMaterial {
  name;

  vertexShader;

  fragmentShader;

  cullMode = "back";

  topology = "triangle-list";

  _vertexShaderModule;

  _fragmentShaderModule;

  static _cachedShader = new Map();

  static clearCache() {
    ShaderMaterial._cachedShader.clear();
  }

  constructor(props) {
    this.name = props.name ?? "ShaderMaterial";
    this.vertexShader = props.vertexShader;
    this.fragmentShader = props.fragmentShader;
  }

  destroy() {
    this._vertexShaderModule = undefined;
    this._fragmentShaderModule = undefined;
  }

  createShaderModule(device, code) {
    let shaderModule = ShaderMaterial._cachedShader.get(code);
    if (!shaderModule) {
      shaderModule = device.createShaderModule({ code });
      ShaderMaterial._cachedShader.set(code, shaderModule);
    }
    return shaderModule;
  }

  getVertexShaderModule(device) {
    if (!this._vertexShaderModule) {
      this._vertexShaderModule = this.createShaderModule(device, this.vertexShader);
    }
    return this._vertexShaderModule;
  }

  getFragmentShaderModule(device) {
    if (!this._fragmentShaderModule) {
      this._fragmentShaderModule = this.createShaderModule(device, this.fragmentShader);
    }
    return this._fragmentShaderModule;
  }

  getLayoutEntries() {
    return [];
  }

  // eslint-disable-next-line no-unused-vars
  getBindGroup(device, layout, ...props) {
    return device.createBindGroup({ layout, entries: [] });
  }
}

export { ShaderMaterial };
