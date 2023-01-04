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
  @location(0) position: vec3<f32>,
  @location(1) worldPosition: vec3<f32>,
  @location(2) viewPosition: vec3<f32>,
  @location(3) uv: vec2<f32>,
  @location(4) normal: vec3<f32>,
  @location(5) color: vec3<f32>,
};

@vertex
fn main(
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) color: vec3<f32>
) -> VertexOutput {
  var output: VertexOutput;
  var worldPosition: vec4<f32> = transform.ModelMatrix * vec4<f32>(position, 1.0);
  var viewPosition: vec4<f32> = camera.ViewMatrix * worldPosition;

  output.position = position;
  output.worldPosition = worldPosition.xyz;
  output.viewPosition = viewPosition.xyz;
  output.uv = uv;
  output.normal = normal;
  output.color = color;
  output.fragPosition = camera.ProjectionMatrix * viewPosition;
  return output;
}