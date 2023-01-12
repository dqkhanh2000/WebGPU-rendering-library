
struct PointLight {
  color: vec4<f32>,
  position: vec4<f32>,
  //intensity: f32, is the fourth component of color
  //radius: f32, is the fourth component of position
}

struct DirectionLight {
  color: vec4<f32>,
  direction: vec3<f32>,
  //intensity: f32, is the four component of color
}

// struct AmbientLight {
//   color: vec4<f32>,
//   // intensity: f32,
// }

struct LightInput {

  // rgb is color, a is intensity
  ambientLight: vec4<f32>,
  pointLights: array<PointLight, ${POINT_LINE_LENGTH}u>,
  directionLights: array<DirectionLight, ${DIRECTION_LINE_LENGTH}u>,
}

@group(1) @binding(0) var<uniform> albedo : vec3<f32>;
@group(1) @binding(1) var<uniform> lightInput: LightInput;


@fragment
fn main(
  @builtin(position) Position : vec4<f32>,
  @location(0) fragPosition : vec3<f32>,
  @location(1) fragNormal : vec3<f32>,
  @location(2) fragUV: vec2<f32>,
  @location(3) fragColor: vec3<f32>,
  @location(4) viewPos: vec3<f32>,

) -> @location(0) vec4<f32> {
  let objectColor = fragColor * albedo;
  var lightResult = vec3<f32>(0.0, 0.0, 0.0);
  var ambientColor = lightInput.ambientLight.rgb;
  //ambientIntensity is the fourth component of ambientColor
  var ambientIntensity = lightInput.ambientLight[3];
  lightResult += ambientColor * ambientIntensity;

  // calculate for direction light
  for(var i = 0u; i < ${DIRECTION_LINE_LENGTH}u; i = i + 1u) {
    var directionLight = lightInput.directionLights[i];
    var lightDirection = normalize(directionLight.direction);
    var lightIntensity = directionLight.color.w;
    var lightColor = directionLight.color.rgb;
    var diffuse = max(dot(lightDirection, fragNormal), 0.0);
    lightResult += lightColor * lightIntensity * diffuse;
  }

  // calculate for point light
  for(var i = 0u; i < ${POINT_LINE_LENGTH}u; i = i + 1u) {
    var pointLight = lightInput.pointLights[i];
    var lightPosition = pointLight.position.xyz + viewPos;
    var lightRadius = pointLight.position.w;
    var lightIntensity = pointLight.color.w;
    var lightColor = pointLight.color.rgb;
    var L = lightPosition - fragPosition;
    var distance = length(L);
    var attenuation = 1.0 - distance / lightRadius;
    if(distance < lightRadius){
        var diffuse = max(dot(normalize(L), fragNormal), 0.0);
        var distanceFactor = pow(1.0 - distance / lightRadius, 2.0);
        lightResult += lightColor * lightIntensity * diffuse * distanceFactor;
    }
  }

  return vec4<f32>( albedo * lightResult, 1.0);
}