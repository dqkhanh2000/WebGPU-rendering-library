import { ShaderMaterial } from "./ShaderMaterial.js";
import vertexShader from "../shaders/physical/vert.wgsl?raw";
import fragmentShader from "../shaders/physical/frag.wgsl?raw";
import { GPUShaderStage } from "../utils/WebGPUTypes.js";
import WGSLPreProcess from "../core/WGSLPreprocessor.js";

const Directives = {
  USE_NORMAL_MAP             : "USE_NORMAL_MAP",
  USE_METALLIC_ROUGHNESS_MAP : "USE_METALLIC_ROUGHNESS_MAP",
  USE_EMISSIVE_MAP           : "USE_EMISSIVE_MAP",
  USE_AO_MAP                 : "USE_AO_MAP",
  USE_VERTEX_COLOR           : "USE_VERTEX_COLOR",
  USE_BASE_COLOR_MAP         : "USE_BASE_COLOR_MAP",
  USE_OCCULSION_MAP          : "USE_OCCULSION_MAP",
};

class PhysicalMaterial extends ShaderMaterial {
  baseColorTexture;

  normalTexture;

  metallicRoughnessTexture;

  emissiveTexture;

  aoTexture;

  _bindGroup;

  inputDirectives = [];

  constructor(props) {
    super({
      name      : "PhysicalMaterial",
      blendMode : props.blendMode,
    });
    this.baseColorTexture = props.baseColorTexture;
    this.normalTexture = props.normalTexture;
    this.metallicRoughnessTexture = props.metallicRoughnessTexture;
    this.emissiveTexture = props.emissiveTexture;
    this.aoTexture = props.aoTexture;
    this._initDirectives();
    this.vertexShader = WGSLPreProcess.process(vertexShader, this.inputDirectives);
    this.fragmentShader = WGSLPreProcess.process(fragmentShader, this.inputDirectives);
  }

  _initDirectives() {
    if (this.baseColorTexture) {
      this.inputDirectives.push(Directives.USE_BASE_COLOR_MAP);
    }
    if (this.normalTexture) {
      this.inputDirectives.push(Directives.USE_NORMAL_MAP);
    }
    if (this.metallicRoughnessTexture) {
      this.inputDirectives.push(Directives.USE_METALLIC_ROUGHNESS_MAP);
    }
    if (this.emissiveTexture) {
      this.inputDirectives.push(Directives.USE_EMISSIVE_MAP);
    }
    if (this.aoTexture) {
      this.inputDirectives.push(Directives.USE_AO_MAP);
    }
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
