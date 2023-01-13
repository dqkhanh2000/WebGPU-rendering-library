import { ShaderMaterial } from "./ShaderMaterial.js";
import vertexShader from "../shaders/skybox/vert.wgsl?raw";
import fragmentShader from "../shaders/skybox/frag.wgsl?raw";
import { GPUShaderStage } from "../utils/WebGPUTypes.js";

/**
 * SkyboxMaterial is a class that represents a skybox material.
 * @extends ShaderMaterial
 */
class SkyboxMaterial extends ShaderMaterial {
  /**
   * The texture of the skybox.
   * @type {WebGPUTexture}
   */
  texture;

  /**
   * The bind group of the skybox material.
   * @type {WebGPUBindGroup}
   * @private
   */
  // readonly cullMode: GPUCullMode = 'front';
  _bindGroup;

  /**
   * Creates an instance of SkyboxMaterial.
   * @param {WebGPUTexture} texture - The texture of the skybox.
   */
  constructor(texture) {
    super({
      name: "SkyboxMaterial",
      vertexShader,
      fragmentShader,
    });
    this.texture = texture;
  }

  /**
   * Returns the layout entries of the skybox material.
   * @returns {Array<WebGPUBindGroupLayoutEntry>}
   */
  getLayoutEntries() {
    return [
      {
        binding    : 0,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType    : "float",
          viewDimension : "cube",
        },
      },
      {
        binding    : 1,
        visibility : GPUShaderStage.FRAGMENT,
        sampler    : {
          type: "filtering",
        },
      },
    ];
  }

  /**
   * Returns the bind group of the skybox material.
   * @param {WebGPUDevice} device - The device to create the bind group on.
   * @param {WebGPUBindGroupLayout} layout - The layout of the bind group.
   * @returns {WebGPUBindGroup}
   */
  getBindGroup(device, layout) {
    if (!this._bindGroup) {
      this.texture.getSampler(device);
      this._bindGroup = device.createBindGroup({
        layout,
        entries: [
          {
            binding  : 0,
            resource : this.texture.getView(device),
          },
          {
            binding  : 1,
            resource : this.texture.getSampler(device),
          },
        ],
      });
    }
    return this._bindGroup;
  }
}

export { SkyboxMaterial };
