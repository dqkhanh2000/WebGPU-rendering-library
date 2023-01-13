import { DirectionLight } from "../light/DirectionLight";
import { Light } from "../light/Light";
import { PointLight } from "../light/PointLight";

export const BuiltinsMatrix = {
  ModelMatrix: {
    name : "ModelMatrix",
    size : 64,
  },
  ModelViewMatrix: {
    name : "ModelViewMatrix",
    size : 64,
  },
  NormalMatrix: {
    name : "NormalMatrix",
    size : 64,
  },
};

export const BuiltinLight = {

  AmbientLight: {
    name : "AmbientLight",
    size : Light.BUFFER_SIZE * 4,
  },
  PointLight: {
    name : "PointLight",
    size : PointLight.BUFFER_SIZE * 4,
  },
  DirectionLight: {
    name : "DirectionLight",
    size : DirectionLight.BUFFER_SIZE * 4,
  },
};
export const BuiltinsUniform = {
  TransformUniform: {
    binding : 1,
    name    : "TransformUniform",
    items   : [
      BuiltinsMatrix.ModelMatrix,
      BuiltinsMatrix.ModelViewMatrix,
      BuiltinsMatrix.NormalMatrix,
    ],
  },
  LightUniform: {
    binding : 1,
    name    : "LightUniform",
    items   : [
      BuiltinLight.AmbientLight,
      BuiltinLight.PointLight,
      BuiltinLight.DirectionLight,
    ],
  },
};

export const UNIFORM_ALIGNMENT_SIZE_MAP = new Map([
  ["mat4x4<f32>", [64, 64]], // 16 * 4
  ["mat3x3<f32>", [48, 48]], // 16 * 3
  ["vec4<f32>", [16, 16]],
  ["vec3<f32>", [16, 12]], // special case
  ["vec2<f32>", [8, 8]],
  ["f32", [4, 4]],
  ["i32", [4, 4]],
  ["u32", [4, 4]],
  ["i16", [2, 2]],
  ["u16", [2, 2]],
]);

export const UNIFORM_FORMAT_MAP = new Map([
  ["mat4x4<f32>", "mat4"],
  ["mat3x3<f32>", "mat3"],
  ["vec4<f32>", "vec4"],
  ["vec3<f32>", "vec3"],
  ["vec2<f32>", "vec2"],
  ["f32", "float"],
  ["i32", "int"],
  ["u32", "uint"],
  ["i16", "int"],
  ["u16", "uint"],
]);
