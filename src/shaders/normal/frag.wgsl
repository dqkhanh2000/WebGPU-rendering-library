
@fragment
fn main(
  @builtin(position) fragPosition: vec4<f32>,
  @location(0) position: vec3<f32>,
  @location(1) worldPosition: vec3<f32>,
  @location(2) viewPosition: vec3<f32>,
  @location(3) uv: vec2<f32>,
  @location(4) normal: vec3<f32>,
  @location(5) color: vec3<f32>,
) -> @location(0) vec4<f32> {
  return vec4(normal * 0.5 + 0.5, 1.0);
}