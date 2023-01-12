class ShaderMaterial {
  name;

  vertexShader;

  fragmentShader;

  cullMode = "back";

  topology = "triangle-list";

  blendMode = "OPAQUE";

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
    this.blendMode = props.blendMode ?? "OPAQUE";
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

  getBlend() {
    if (this.blendMode === "OPAQUE") {
      return {
        color: {
          srcFactor : "src-alpha",
          dstFactor : "one-minus-src-alpha",
          operation : "add",
        },
        alpha: {
          srcFactor : "src-alpha",
          dstFactor : "one",
          operation : "add",
        },
      };
    }
    if (this.blendMode === "ADD") {
      return {
        color: {
          srcFactor : "src-alpha",
          dstFactor : "one",
          operation : "add",
        },
        alpha: {
          srcFactor : "src-alpha",
          dstFactor : "one",
          operation : "add",
        },
      };
    }
    if (this.blendMode === "MULTIPLY") {
      return {
        color: {
          srcFactor : "dst-color",
          dstFactor : "zero",
          operation : "add",
        },
        alpha: {
          srcFactor : "dst-color",
          dstFactor : "zero",
          operation : "add",
        },
      };
    }
    if (this.blendMode === "ALPHA" || this.blendMode === "BLEND") {
      return {
        color: {
          srcFactor : "src-alpha",
          dstFactor : "one-minus-src-alpha",
        },
        alpha: {
          srcFactor : "zero",
          dstFactor : "one",
        },
      };
    }
    if (this.blendMode === "PREMULTIPLIED") {
      return {
        color: {
          srcFactor : "one",
          dstFactor : "one-minus-src-alpha",
          operation : "add",
        },
        alpha: {
          srcFactor : "one",
          dstFactor : "one-minus-src-alpha",
          operation : "add",
        },
      };
    }
    if (this.blendMode === "SCREEN") {
      return {
        color: {
          srcFactor : "one",
          dstFactor : "one-minus-src-color",
          operation : "add",
        },
        alpha: {
          srcFactor : "one",
          dstFactor : "one-minus-src-color",
          operation : "add",
        },
      };
    }

  }

  /**
   * Attach light to material
   * @param {object} lights - The lights to attach
   * @param {object} lights.directionLight - The direction light
   * @param {array<DirectionLight>} lights.directionLight.lights - The list of direction lights
   * @param {object} lights.pointLight - The point light
   * @param {array<PointLight>} lights.pointLight.lights - The list of point lights
   * @param {object} lights.ambientLight - The ambient light
   */
  attachLight(lights) {
    this.lights = lights;
  }
}

export { ShaderMaterial };
