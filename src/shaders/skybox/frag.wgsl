struct CameraUniform {
  ViewMatrix: mat4x4<f32>,
  ProjectionMatrix: mat4x4<f32>,
  CameraPos: vec3<f32>,
  ViewProjectionInverseMatrix: mat4x4<f32>,
};

struct TransformUniform {
  ModelMatrix: mat4x4<f32>,
  ModelViewMatrix: mat4x4<f32>,
  NormalMatrix: mat4x4<f32>,
};

@group(0)
@binding(0)
var<uniform> camera: CameraUniform;

@group(0)
@binding(1)
var<uniform> transform: TransformUniform;

@group(1) @binding(0) var baseColorTexture: texture_cube<f32>;
@group(1) @binding(1) var mySampler: sampler;

@fragment
fn main(
  @location(0) position: vec3<f32>
) -> @location(0) vec4<f32> {
  let t: vec4<f32> = camera.ViewProjectionInverseMatrix * vec4<f32>(position, 1.0);
  let tex: vec4<f32> = textureSample(baseColorTexture, mySampler, normalize(t.xyz / t.w));
  return tex;
}