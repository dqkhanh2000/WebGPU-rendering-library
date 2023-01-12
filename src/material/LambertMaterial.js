/* eslint-disable no-unused-vars */
import { Color } from "../math/Color";
import { ShaderMaterial } from "./ShaderMaterial";
import vertexSource from "../shaders/lambert/vert.wgsl?raw";
import fragmentSource from "../shaders/lambert/frag.wgsl?raw";
import { GPUBufferUsage, GPUShaderStage } from "../utils/WebGPUTypes";
import { PointLight } from "../light/PointLight";
import { DirectionLight } from "../light/DirectionLight";
import WGSLPreProcess from "../core/WGSLPreprocessor";

/**
 * Lambert material
 * @class LambertMaterial
 * @extends ShaderMaterial
 */
export class LambertMaterial extends ShaderMaterial {
  /**
   * The albedo color of the material
   * @type {Color}
   * @default Color.WHITE
   */
  albedo;


  constructor({ albedo = Color.WHITE } = {}) {
    super({
      name         : "LambertMaterial",
      vertexShader : vertexSource,
    });
    this.albedo = albedo;
    this.replaceDirectives = {
      DIRECTION_LINE_LENGTH : 0,
      POINT_LINE_LENGTH     : 0,
    };
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
      this.fragmentShader = WGSLPreProcess.process(fragmentSource, [], this.replaceDirectives);
      this.lights = lights;
    }
  }

  getAlbedoColorBuffer(device) {
    if (!this._albedoColorBuffer) {
      this._albedoColorBuffer = device.createBuffer({
        size  : 16,
        usage : GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(this._albedoColorBuffer, 0, this.albedo.toArray());
    }
    return this._albedoColorBuffer;
  }

  getLayoutEntries() {
    return [
      {
        binding    : 0,
        visibility : (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT),
        buffer     : {
          type: "uniform",
        },
      },
      {
        binding    : 1,
        visibility : (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT),
        buffer     : {
          type: "uniform",
        },
      },
    ];
  }

  getBindGroup(device, layout) {
    if (!this._bindGroup) {
      let entries = [
        {
          binding  : 0,
          resource : {
            buffer: this.getAlbedoColorBuffer(device),
          },
        },
        this.lights.uniformBuffer.getBindGroupEntry(device),
      ];
      console.log(this.lights.uniformBuffer);
      this._bindGroup = device.createBindGroup({
        layout,
        entries,
      });
    }
    return this._bindGroup;
  }

}
