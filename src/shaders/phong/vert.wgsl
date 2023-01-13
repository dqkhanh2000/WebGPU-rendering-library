struct CameraUniform {
  ViewMatrix: mat4x4<f32>,
  ProjectionMatrix: mat4x4<f32>,
};

struct TransformUniform {
  ModelMatrix: mat4x4<f32>,
  ModelViewMatrix: mat4x4<f32>,
  NormalMatrix: mat4x4<f32>,
  InverseModelViewMatrix: mat4x4<f32>,
};

@group(0)
@binding(0)
var<uniform> camera: CameraUniform;

@group(0)
@binding(1)
var<uniform> transform: TransformUniform;

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragPosition : vec3<f32>,
    @location(1) fragNormal : vec3<f32>,
    @location(2) fragUV: vec2<f32>,
    @location(3) fragColor: vec3<f32>,
    @location(4) viewPos: vec3<f32>,
};

@vertex
fn main(
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) color: vec3<f32>
) -> VertexOutput {
    let modelview = transform.ModelViewMatrix;
    let mvp = camera.ProjectionMatrix * modelview;
    let pos = vec4<f32>(position, 1.0);
    
    var output : VertexOutput;
    output.Position = mvp * pos;
    output.fragPosition = (modelview * pos).xyz;
    output.fragNormal =  (modelview * vec4<f32>(normal, 0.0)).xyz;
    output.fragUV = 1-uv;
    output.fragColor = color;
    output.viewPos = (camera.ViewMatrix * vec4<f32>(0.0, 0.0, 0.0, 1.0)).xyz;
    return output;
}
