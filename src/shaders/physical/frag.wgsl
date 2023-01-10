const PI: f32 = 3.14159626;

const ambientLightColor: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
const ambientLightIndensity: f32 = 1.0;
const dictionalLightColor: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
const dictionalLightIndensity: f32 = 10.0;
const dictionalLightDir: vec3<f32> = vec3<f32>(5.0, 5.0, 5.0);

struct CameraUniform {
  ViewMatrix: mat4x4<f32>,
  ProjectionMatrix: mat4x4<f32>,
  CameraPos: vec3<f32>,
};

struct TransformUniform {
  ModelMatrix: mat4x4<f32>,
  ModelViewMatrix: mat4x4<f32>,
  NormalMatrix: mat4x4<f32>,
};

struct MaterialUniforms {
  baseColorFactor : vec4<f32>,
  metallicRoughnessFactor : vec2<f32>,
  emissiveFactor : vec3<f32>,
  occlusionStrength : f32,
};

@group(0)
@binding(0)
var<uniform> camera: CameraUniform;

@group(0)
@binding(1)
var<uniform> transform: TransformUniform;

@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var envTexture: texture_cube<f32>;
@group(1) @binding(2) var baseColorTexture: texture_2d<f32>;
@group(1) @binding(3) var normalTexture: texture_2d<f32>;
@group(1) @binding(4) var metallicRoughnessTexture: texture_2d<f32>;
@group(1) @binding(5) var emissiveTexture: texture_2d<f32>;
@group(1) @binding(6) var aoTexture: texture_2d<f32>;

fn calcTBN(N: vec3<f32>, p: vec3<f32>, uv: vec2<f32>) -> mat3x3<f32> {
  let dp1: vec3<f32> = dpdx(p);
  let dp2: vec3<f32> = dpdy(p);
  let duv1: vec2<f32> = dpdx(uv);
  let duv2: vec2<f32> = dpdy(uv);
  let dp2perp: vec3<f32> = cross(dp2, N);
  let dp1perp: vec3<f32> = cross(N, dp1);
  let T: vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
  let B: vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;
  return mat3x3<f32>(normalize(T), normalize(B), N);
}

fn DistributionBlinnPhong(cosNH: f32, m: f32) -> f32 {
  return (m + 8.0) * pow(cosNH, m) / (8.0 * PI);
}

fn DistributionGGX(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {
  let a: f32 = roughness*roughness;
  let a2 :f32 = a*a;
  let NdotH :f32 = max(dot(N, H), 0.0);
  let NdotH2 :f32 = NdotH*NdotH;
	
  let nom :f32 = a2;
  var denom :f32 = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;
  return nom / denom;
}

fn GeometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
  let r :f32 = roughness + 1.0;
  let k = r*r / 8.0;
  let denom :f32 = NdotV * (1.0 - k) + k;
  return NdotV / denom;
}

fn GeometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, k: f32) -> f32 {
  let NdotV: f32 = max(dot(N, V), 0.0);
  let NdotL: f32 = max(dot(N, L), 0.0);
  let ggx1 : f32= GeometrySchlickGGX(NdotV, k);
  let ggx2 : f32= GeometrySchlickGGX(NdotL, k);

  return ggx1 * ggx2;
}

fn fresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

@fragment
fn main(
  @location(0) position: vec3<f32>,
  @location(1) viewPosition: vec3<f32>,
  @location(2) worldPosition: vec3<f32>,
  @location(3) uv: vec2<f32>,
  @location(4) normal: vec3<f32>,
  @location(5) color: vec3<f32>
) -> @location(0) vec4<f32> {

  let texAbedo: vec3<f32> = textureSample(baseColorTexture, mySampler, uv).rgb;
  let texNormal: vec3<f32> = textureSample(normalTexture, mySampler, uv).rgb;
  let texMetallicRoughness: vec3<f32> = textureSample(metallicRoughnessTexture, mySampler, uv).rgb;
  let texEmissive: vec3<f32> = textureSample(emissiveTexture, mySampler, uv).rgb;
  let texAO: vec3<f32> = textureSample(aoTexture, mySampler, uv).rgb;

  let TBN: mat3x3<f32> = calcTBN(normalize(normal), -normalize(viewPosition), uv);

  let N: vec3<f32> = normalize((transform.ModelMatrix * vec4<f32>(normalize(TBN * texNormal), 1.0)).xyz);
  let L: vec3<f32> = normalize(dictionalLightDir - worldPosition);
  let V: vec3<f32> = normalize(camera.CameraPos - worldPosition);
  let H: vec3<f32> = normalize(L + V);

  let radiance: vec3<f32> = textureSample(envTexture, mySampler, reflect(-V, N)).rgb;
  let diffuse = dictionalLightColor * dictionalLightIndensity * texAbedo;
  
  let roughness: f32 = texMetallicRoughness.g;
  let metallic: f32 = texMetallicRoughness.b;

  // calc angles
  let cosNV: f32 = max(dot(N, V), 0.0);
  let cosNL: f32 = max(dot(N, L), 0.0);
  let cosNH: f32 = max(dot(N, H), 0.0);
  let cosNH2: f32 = cosNH * cosNH;

  // calc brdf
  let D: f32 = DistributionGGX(N, H, roughness);
  // let D: f32 = DistributionBlinnPhong(cosNH, 16.0);
  let F0: vec3<f32> = mix(vec3<f32>(0.04), texAbedo, metallic);
  let F: vec3<f32> = fresnelSchlick(cosNL, F0);
  let G: f32 = GeometrySmith(N, V, L, roughness);

  let kS: vec3<f32> = F;
  let kD: vec3<f32> = (1.0 - kS) * (1.0 - metallic);

  let specular: vec3<f32> = D * F * G / (10.0 * cosNL * cosNV + 0.0001);
  let brdf: vec3<f32> = diffuse * (kD / PI + kS * specular);

  var irradiance: vec3<f32> = vec3<f32>(0.0);  
  var up: vec3<f32> = vec3(0.0, 1.0, 0.0);
  var right: vec3<f32> = cross(up, normal);
  up = cross(normal, right);

  var sampleDelta: f32 = 0.1;
  var nrSamples: f32 = 0.0; 

  // for(var phi: f32 = 0.0; phi < 2.0 * PI; phi = phi + sampleDelta) {
  //   for(var theta: f32 = 0.0; theta < 0.5 * PI; theta = theta + sampleDelta) {
  //       // spherical to cartesian (in tangent space)
  //       var tangentSample: vec3<f32> = vec3<f32>(sin(theta) * cos(phi),  sin(theta) * sin(phi), cos(theta));
  //       // tangent space to world
  //       var sampleVec: vec3<f32> = tangentSample.x * right + tangentSample.y * up + tangentSample.z * N;
  //       irradiance = irradiance + textureSample(envTexture, mySampler, sampleVec).rgb * cos(theta) * sin(theta);
  //       nrSamples = nrSamples + 1.0;
  //   }
  // }
  // irradiance = PI * irradiance * (1.0 / nrSamples);

  let ambient: vec3<f32> = ambientLightColor * ambientLightIndensity *
    mix(texAbedo, texAbedo * radiance, metallic);

  var outColor: vec3<f32> = texAO * ambient + texEmissive + texAO * brdf * cosNL;

  return vec4<f32>(outColor, 1.0);
  // return vec4<f32>(vec3<f32>(irradiance), 1.0);
}