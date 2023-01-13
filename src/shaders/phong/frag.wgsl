
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

struct LightInput {

  // rgb is color, a is intensity
  ambientLight: vec4<f32>,
  pointLights: array<PointLight, ${POINT_LINE_LENGTH}u>,
  directionLights: array<DirectionLight, ${DIRECTION_LINE_LENGTH}u>,
}

struct Material {
  ambient: vec4<f32>,
  // the fourth component of ambient is ambient intensity
  diffuse: vec4<f32>,
  // the fourth component of diffuse is diffuse reflectivity
  specular: vec4<f32>,
  // the fourth component of specular is specular strength
  shininess: f32,
}

@group(1) @binding(0) var<uniform> material: Material;
@group(1) @binding(1) var<uniform> lightInput: LightInput;
#if USE_ALBEDO_MAP
@group(1) @binding(2) var mySampler: sampler;
@group(1) @binding(3) var baseColorTexture: texture_2d<f32>;
#endif

fn CalcDirLight(light: DirectionLight, normal: vec3<f32>, viewDir: vec3<f32>) -> vec3<f32>
{
  let norm = normalize(normal);
  let lightDir = normalize(-light.direction);
  let diff = max(dot(norm, lightDir), 0.0);
  let diffuse = material.diffuse.a * diff * material.diffuse.rgb;

  let reflectDir = reflect(-lightDir, norm);  
  let spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  let specular =  material.specular.a * spec * material.specular.rgb;

  return diffuse + specular;
}

fn CalcPointLight(light: PointLight, normal: vec3<f32>, viewDir: vec3<f32>, viewPos: vec3<f32>, fragPos: vec3<f32>) -> vec3<f32>
{
  var lightPosition = (light.position.xyz + viewPos);
  var lightRadius = light.position.w;
  var lightIntensity = light.color.w;
  var lightColor = light.color.rgb;
  var L = lightPosition - fragPos;
  var distance = length(L);
  var attenuation = 1.0 - distance / lightRadius;

  let norm = normalize(normal);
  let lightDir = normalize(lightPosition - fragPos);
  let diff = max(dot(norm, lightDir), 0.0);
  var diffuse = material.diffuse.a * diff * material.diffuse.rgb;

  let reflectDir = reflect(-lightDir, norm);  
  let spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
  var specular =  material.specular.a * spec * material.specular.rgb;
  if(distance < lightRadius){
    diffuse *= attenuation;
    specular *= attenuation;
  } else {
    diffuse = vec3<f32>(0.0, 0.0, 0.0);
    specular = vec3<f32>(0.0, 0.0, 0.0);
  }

  return diffuse + specular;
}


@fragment
fn main(
  @builtin(position) Position : vec4<f32>,
  @location(0) fragPosition : vec3<f32>,
  @location(1) fragNormal : vec3<f32>,
  @location(2) fragUV: vec2<f32>,
  @location(3) fragColor: vec3<f32>,
  @location(4) viewPos: vec3<f32>,

) -> @location(0) vec4<f32> {

#if USE_ALBEDO_MAP
  let texAlbedo = textureSample(baseColorTexture, mySampler, fragUV).rgb;
#endif

  var lightResult = vec3<f32>(0.0, 0.0, 0.0);
  var viewDir = normalize(viewPos - fragPosition);

  //ambient light
  var lightAmbientColor = lightInput.ambientLight.rgb;
  var lightAmbientIntensity = lightInput.ambientLight.a;
  lightResult += lightAmbientColor * lightAmbientIntensity;
  lightResult += material.ambient.rgb * material.ambient.a;

  // calculate for direction light
  for(var i = 0u; i < ${DIRECTION_LINE_LENGTH}u; i = i + 1u) {
    var directionLight = lightInput.directionLights[i];
    lightResult += directionLight.color.a * CalcDirLight(directionLight, fragNormal, viewDir);
  }

  // calculate for point light
  for(var i = 0u; i < ${POINT_LINE_LENGTH}u; i = i + 1u) {
    var pointLight = lightInput.pointLights[i];
    lightResult += pointLight.color.a * CalcPointLight(pointLight, fragNormal, viewDir, viewPos, fragPosition);
    // var lightPosition = (pointLight.position.xyz + viewPos);
    // var lightRadius = pointLight.position.w;
    // var lightIntensity = pointLight.color.w;
    // var lightColor = pointLight.color.rgb;
    // var L = lightPosition - fragPosition;
    // var distance = length(L);
    // var attenuation = 1.0 - distance / lightRadius;
    // if(distance < lightRadius){
    //     var diffuse = max(dot(normalize(L), fragNormal), 0.0);
    //     var distanceFactor = pow(1.0 - distance / lightRadius, 2.0);
    //     lightResult += lightColor * lightIntensity * diffuse * distanceFactor;
    // }
  }

#if USE_ALBEDO_MAP
  lightResult += texAlbedo * material.diffuse.rgb * material.diffuse.a;
#endif

  return vec4<f32>(lightResult, 1.0);
}