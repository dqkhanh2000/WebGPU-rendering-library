/**
 ShaderMaterial is the base class for creating custom materials using shaders.
 It provides a common interface for creating and managing vertex and fragment shaders,
 and defines the default blend mode.
 @class ShaderMaterial
 */
class ShaderMaterial {
  /**
   The name of the material.
   @type {string}
   @memberof ShaderMaterial
   */
  name;

  /**
   The vertex shader code.
   @type {string}
   @memberof ShaderMaterial
   */
  vertexShader;

  /**
   The fragment shader code.
   @type {string}
   @memberof ShaderMaterial
   */
  fragmentShader;

  /**
   The cull mode.
   @type {string}
   @memberof ShaderMaterial
   */
  cullMode = "back";

  /**
   The topology.
   @type {string}
   @memberof ShaderMaterial
   */
  topology = "triangle-list";

  /**
   The blend mode.
   @type {string}
   @memberof ShaderMaterial
   */
  blendMode = "OPAQUE";

  /**
   The cached vertex shader module.
   @type {WebGPUShaderModule}
   @memberof ShaderMaterial
   */
  _vertexShaderModule;

  /**
     * The fragment shader module
     * @type {WebGPUShaderModule}
     */
  _fragmentShaderModule;

  /**
     * A cache for storing shader modules
     * @type {Map<string, WebGPUShaderModule>}
     */
  static _cachedShader = new Map();

  /**
   Clears the cache of ShaderMaterial instances.
   @static
   */
  static clearCache() {
    ShaderMaterial._cachedShader.clear();
  }

  /**
   Constructor for the ShaderMaterial class.
   @constructor
   @param {Object} props - The properties to initialize the ShaderMaterial with.
   @param {string} [props.name="ShaderMaterial"] - The name of the material.
   @param {string} props.vertexShader - The vertex shader code for the material.
   @param {string} props.fragmentShader - The fragment shader code for the material.
   @param {string} [props.blendMode="OPAQUE"] - The blend mode for the material.
   */
  constructor(props) {
    this.name = props.name ?? "ShaderMaterial";
    this.vertexShader = props.vertexShader;
    this.fragmentShader = props.fragmentShader;
    this.blendMode = props.blendMode ?? "OPAQUE";
  }

  /**
    @desc Clears the cached vertex and fragment shader modules from this ShaderMaterial object.
   */
  destroy() {
    this._vertexShaderModule = undefined;
    this._fragmentShaderModule = undefined;
  }

  /**
    Creates a new WebGPU shader module and caches it for future use.
    @param {Object} device - The WebGPU device.
    @param {String} code - The code for the shader module.
    @returns {WebGPUShaderModule} The shader module.
   */
  createShaderModule(device, code) {
    let shaderModule = ShaderMaterial._cachedShader.get(code);
    if (!shaderModule) {
      shaderModule = device.createShaderModule({ code });
      ShaderMaterial._cachedShader.set(code, shaderModule);
    }
    return shaderModule;
  }

  /**
    Returns the cached vertex shader module for this ShaderMaterial object. If the module has not been cached yet, it will create a new one using the provided device and vertex shader code.
    @param {Object} device - The WebGPU device.
    @returns {WebGPUShaderModule} The vertex shader module.
  */
  getVertexShaderModule(device) {
    if (!this._vertexShaderModule) {
      this._vertexShaderModule = this.createShaderModule(
        device,
        this.vertexShader,
      );
    }
    return this._vertexShaderModule;
  }

  /**
    Returns the cached fragment shader module for this ShaderMaterial object. If the module has not been cached yet, it will create a new one using the provided device and fragment shader code.
    @param {Object} device - The WebGPU device.
    @returns {WebGPUShaderModule} The fragment shader module.
   */
  getFragmentShaderModule(device) {
    if (!this._fragmentShaderModule) {
      this._fragmentShaderModule = this.createShaderModule(
        device,
        this.fragmentShader,
      );
    }
    return this._fragmentShaderModule;
  }

  /**
    Returns an array of layout entries for this ShaderMaterial object. This should be overridden by child classes to provide specific layout entries.
    @returns {Array} An array of layout entries for this ShaderMaterial object.
  */
  getLayoutEntries() {
    return [];
  }

  /**
     Creates a new WebGPU bind group for this ShaderMaterial object. This should be overridden by child classes to provide specific bind group entries.
    @param {Object} device - The WebGPU device.
    @param {Object} layout - The layout for the bind group.
    @param {...*} [props] - Additional properties needed to create the bind group.
    @returns {Object} The created bind group.
 */
  // eslint-disable-next-line no-unused-vars
  getBindGroup(device, layout, ...props) {
    return device.createBindGroup({ layout, entries: [] });
  }

  /**
   @returns {Object} The blend state for this ShaderMaterial object.
   @desc Returns the blend state for this ShaderMaterial object based on the current value of the blendMode property.
   */
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
