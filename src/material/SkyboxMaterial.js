import { ShaderMaterial } from "./ShaderMaterial.js";
import vertexShader from "../shaders/skybox/vert.wgsl?raw";
import fragmentShader from "../shaders/skybox/frag.wgsl?raw";
import { GPUShaderStage } from "../utils/WebGPUTypes.js";

class SkyboxMaterial extends ShaderMaterial {
  texture;

  // readonly cullMode: GPUCullMode = 'front';
  _bindGroup;

  constructor(texture) {
    super({
      name: "SkyboxMaterial",
      vertexShader,
      fragmentShader,
    });
    this.texture = texture;
  }

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
