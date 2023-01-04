
struct CameraUniform {
  ViewMatrix: mat4x4<f32>,
  ProjectionMatrix: mat4x4<f32>,
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

struct VertexOutput {
  @builtin(position) fragPosition: vec4<f32>,
  @location(0) position: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) color: vec3<f32>,
};

@vertex
fn main(
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) color: vec3<f32>
) -> VertexOutput {
  var output: VertexOutput;
  output.fragPosition = camera.ProjectionMatrix * transform.ModelViewMatrix * vec4<f32>(position, 1.0);
  output.position = vec4<f32>(position, 1.0);
  output.uv = uv;
  output.normal = normal;
  output.color = color;
  return output;
}