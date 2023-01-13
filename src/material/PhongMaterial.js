/* eslint-disable no-unused-vars */
import { Color } from "../math/Color";
import { ShaderMaterial } from "./ShaderMaterial";
import vertexSource from "../shaders/phong/vert.wgsl?raw";
import fragmentSource from "../shaders/phong/frag.wgsl?raw";
import { GPUBufferUsage, GPUShaderStage } from "../utils/WebGPUTypes";
import { PointLight } from "../light/PointLight";
import { DirectionLight } from "../light/DirectionLight";
import WGSLPreProcess from "../core/WGSLPreprocessor";
import { UniformBuffer } from "../buffer/UniformBuffer";

/**
 * Phong material
 * @class PhongMaterial
 * @extends ShaderMaterial
 */
export class PhongMaterial extends ShaderMaterial {

  /**
   * The ambientIntensity of the material
   * @type {number}
   * @default 0
   * @range [0, 1]
   */
  ambientIntensity;

  /**
   * The ambientColor of the material
   * @type {Color}
   * @default Color.WHITE
   */
  ambientColor;

  /**
   * The specular color of the material
   * @type {Color}
   * @default Color.WHITE
   */
  specularColor;

  /**
   * The specular reflection of the material
   * @type {number}
   * @default 0
   * @range [0, 1]
   */
  specularReflection;

  /**
   * The diffuse color of the material
   * @type {Color}
   * @default Color.WHITE
   */
  diffuseColor;

  /**
   * The diffuse reflection of the material
   * @type {number}
   * @default 1
   * @range [0, 1]
   */
  diffuseReflection;

  /**
   * The shininess of the material
   * @type {number}
   * @default 0
   * @range [0, 100]
   */
  shininess;

  /**
   * The albedoMap of the material
   * @type {TextureObject}
   */
  albedoMap;


  constructor({
    ambientIntensity = 0,
    ambientColor = Color.WHITE,
    specularColor = Color.WHITE,
    specularReflection = 0,
    diffuseColor = Color.WHITE,
    diffuseReflection = 1,
    shininess = 0,
    albedoMap = null,
  } = {}) {
    super({
      name         : "PhongMaterial",
      vertexShader : vertexSource,
    });
    this.ambientIntensity = ambientIntensity;
    this.ambientColor = ambientColor;
    this.specularColor = specularColor;
    this.specularReflection = specularReflection;
    this.diffuseColor = diffuseColor;
    this.diffuseReflection = diffuseReflection;
    this.shininess = shininess;
    this.albedoMap = albedoMap;


    this.replaceDirectives = {
      DIRECTION_LINE_LENGTH : 0,
      POINT_LINE_LENGTH     : 0,
    };
    this.conditionDirectives = [];
    if (this.albedoMap) {
      this.conditionDirectives.push("USE_ALBEDO_MAP");
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
    if (!this.fragmentShader || !this.lights
      || (this.lights.directionLight && lights.directionLight && !this.lights.directionLight?.lights.length !== lights.directionLight?.lights.length)
      || (this.lights.pointLight && lights.pointLight && !this.lights.pointLight?.lights.length !== lights.pointLight?.lights.length)) {

      this.replaceDirectives.DIRECTION_LINE_LENGTH = lights.directionLight?.lights.length || 0;
      this.replaceDirectives.POINT_LINE_LENGTH = lights.pointLight?.lights.length || 0;
      this.fragmentShader = WGSLPreProcess.process(fragmentSource, this.conditionDirectives, this.replaceDirectives);
      this.lights = lights;
    }
  }

  getMaterialBuffer(device) {
    if (!this._materialUniform) {
      this._shininessArray = new Float32Array(1);
      this._materialUniform = new UniformBuffer({
        name  : "PhongMaterialUniformBuffer",
        items : [
          {
            name : "Ambient",
            size : 16,
          },
          {
            name : "Diffuse",
            size : 16,
          },
          {
            name : "Specular",
            size : 16,
          },
          {
            name : "Shininess",
            size : 4 + 12, // 12 bytes padding
          },
        ],
      });
    }
    this.ambientColor.alpha = this.ambientIntensity;
    this.diffuseColor.alpha = this.diffuseReflection;
    this.specularColor.alpha = this.specularReflection;
    this._shininessArray[0] = this.shininess;
    this._materialUniform.set(device, "Ambient", this.ambientColor.array.buffer);
    this._materialUniform.set(device, "Diffuse", this.diffuseColor.array.buffer);
    this._materialUniform.set(device, "Specular", this.specularColor.array.buffer);
    this._materialUniform.set(device, "Shininess", this._shininessArray.buffer);

    return this._materialUniform.getBuffer();
  }

  getLayoutEntries() {
    this.layoutEntries = [
      {
        // for material input
        binding    : 0,
        visibility : (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT),
        buffer     : {
          type: "uniform",
        },
      },
      {
        // for lighting input
        binding    : 1,
        visibility : (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT),
        buffer     : {
          type: "uniform",
        },
      },
    ];
    if (this.albedoMap) {
      this.layoutEntries.push({
        binding    : 2,
        visibility : GPUShaderStage.FRAGMENT,
        sampler    : {
          type: "filtering",
        },
      });
      this.layoutEntries.push(
        {
          binding    : 3,
          visibility : GPUShaderStage.FRAGMENT,
          texture    : {
            sampleType: "float",
          },
        },
      );
    }
    return this.layoutEntries;
  }

  getBindGroup(device, layout) {
    if (!this._bindGroup) {
      let entries = [
        {
          binding  : 0,
          resource : {
            buffer: this.getMaterialBuffer(device),
          },
        },
        this.lights.uniformBuffer.getBindGroupEntry(device),
      ];
      if (this.albedoMap) {
        entries.push(
          {
            binding  : 2,
            resource : this.albedoMap.getSampler(device),
          },
          {
            binding  : 3,
            resource : this.albedoMap.getView(device),
          },
        );
      }
      this._bindGroup = device.createBindGroup({
        layout,
        entries,
      });
      this._bindGroup.entries = entries;
    }
    this._bindGroup.entries[0].resource.buffer = this.getMaterialBuffer(device);
    return this._bindGroup;
  }

}
