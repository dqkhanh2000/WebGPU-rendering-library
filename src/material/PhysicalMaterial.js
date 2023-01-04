import { ShaderMaterial } from "./ShaderMaterial.js";
import vertexShader from "../shaders/physical/vert.wgsl?raw";
import fragmentShader from "../shaders/physical/frag.wgsl?raw";
import { GPUShaderStage } from "../utils/WebGPUTypes.js";

class PhysicalMaterial extends ShaderMaterial {
  baseColorTexture;

  normalTexture;

  metallicRoughnessTexture;

  emissiveTexture;

  aoTexture;

  _bindGroup;

  constructor(props) {
    super({
      name: "PhysicalMaterial",
      vertexShader,
      fragmentShader,
    });
    this.baseColorTexture = props.baseColorTexture;
    this.normalTexture = props.normalTexture;
    this.metallicRoughnessTexture = props.metallicRoughnessTexture;
    this.emissiveTexture = props.emissiveTexture;
    this.aoTexture = props.aoTexture;
  }

  getLayoutEntries() {
    return [
      {
        binding    : 0,
        visibility : GPUShaderStage.FRAGMENT,
        sampler    : {
          type: "filtering",
        },
      },
      {
        binding    : 1,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType    : "float",
          viewDimension : "cube",
        },
      },
      {
        binding    : 2,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType: "float",
        },
      },
      {
        binding    : 3,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType: "float",
        },
      },
      {
        binding    : 4,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType: "float",
        },
      },
      {
        binding    : 5,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType: "float",
        },
      },
      {
        binding    : 6,
        visibility : GPUShaderStage.FRAGMENT,
        texture    : {
          sampleType: "float",
        },
      },
    ];
  }

  getBindGroup(device, layout, cubemap) {
    if (!this._bindGroup) {
      this.baseColorTexture.getSampler(device);
      this._bindGroup = device.createBindGroup({
        layout,
        entries: [
          {
            binding  : 0,
            resource : this.baseColorTexture.getSampler(device),
          },
          {
            binding  : 1,
            resource : cubemap.getView(device),
          },
          {
            binding  : 2,
            resource : this.baseColorTexture.getView(device),
          },
          {
            binding  : 3,
            resource : this.normalTexture.getView(device),
          },
          {
            binding  : 4,
            resource : this.metallicRoughnessTexture.getView(device),
          },
          {
            binding  : 5,
            resource : this.emissiveTexture.getView(device),
          },
          {
            binding  : 6,
            resource : this.aoTexture.getView(device),
          },
        ],
      });
    }
    return this._bindGroup;
  }
}

export { PhysicalMaterial };
