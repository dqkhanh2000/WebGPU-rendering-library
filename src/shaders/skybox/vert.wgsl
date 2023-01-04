struct VertexOutput {
  @builtin(position) fragPosition: vec4<f32>,
  @location(0) position: vec3<f32>,
};

@vertex
fn main(
  @location(0) position: vec3<f32>
) -> VertexOutput {
  var output: VertexOutput;
  output.fragPosition = vec4<f32>(position.xy, 0.9999, 1.0);
  output.position = position;
  return output;
}