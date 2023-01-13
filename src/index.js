import { CylinderGeometry } from "./geometry/CylinderGeometry.js";
import { PlaneGeometry } from "./geometry/PlaneGeometry.js";
import { CapsuleGeometry } from "./geometry/CapsuleGeometry.js";
import { LatheGeometry } from "./geometry/LatheGeometry.js";
import { AmbientLight } from "./light/AmbientLight.js";
import { DirectionLight } from "./light/DirectionLight.js";
import { Light } from "./light/Light.js";
import { PointLight } from "./light/PointLight.js";
import { BufferObject } from "./buffer/BufferObject.js";
import { VertexBuffer } from "./buffer/VertexBuffer.js";
import { IndexBuffer } from "./buffer/IndexBuffer.js";
import { UniformBuffer } from "./buffer/UniformBuffer.js";
import { Camera } from "./camera/Camera.js";
import { PerspectiveCamera } from "./camera/PerspectiveCamera.js";
import { OrbitControl } from "./camera/OrbitControl.js";
import { GPUInstance, checkGPU } from "./core/GPUInstance.js";
import { Renderer } from "./core/Renderer.js";
import { Vector2 } from "./math/Vector2.js";
import { Vector3 } from "./math/Vector3.js";
import { Vector4 } from "./math/Vector4.js";
import { Matrix3 } from "./math/Matrix3.js";
import { Matrix4 } from "./math/Matrix4.js";
import { Color } from "./math/Color.js";
import { SceneNode } from "./objects/SceneNode.js";
import { Mesh } from "./objects/Mesh.js";
import { Skybox } from "./objects/Skybox.js";
import { BufferGeometry } from "./geometry/BufferGeometry.js";
import { CubeGeometry } from "./geometry/CubeGeometry.js";
import { BoxGeometry } from "./geometry/BoxGeometry.js";
import { SphereGeometry } from "./geometry/SphereGeometry.js";
import { ShaderMaterial } from "./material/ShaderMaterial.js";
import { NormalMaterial } from "./material/NormalMaterial.js";
import { PhysicalMaterial } from "./material/PhysicalMaterial.js";
import { SkyboxMaterial } from "./material/SkyboxMaterial.js";
import { PhongMaterial } from "./material/PhongMaterial.js";
import { WireFrameMaterial } from "./material/WireFrameMaterial.js";
import { uuid } from "./utils/uuid.js";
import { GLTFLoader } from "./loaders/GLTFLoader.js";
import { TextureLoader } from "./loaders/TextureLoader.js";

const KaneRender = {
  CylinderGeometry,
  PlaneGeometry,
  CapsuleGeometry,
  LatheGeometry,
  AmbientLight,
  DirectionLight,
  Light,
  PointLight,
  BufferObject,
  VertexBuffer,
  IndexBuffer,
  UniformBuffer,
  Camera,
  PerspectiveCamera,
  OrbitControl,
  GPUInstance,
  checkGPU,
  Renderer,
  Vector2,
  Vector3,
  Vector4,
  Matrix3,
  Matrix4,
  Color,
  SceneNode,
  Mesh,
  Skybox,
  BufferGeometry,
  CubeGeometry,
  BoxGeometry,
  SphereGeometry,
  ShaderMaterial,
  NormalMaterial,
  PhysicalMaterial,
  SkyboxMaterial,
  PhongMaterial,
  WireFrameMaterial,
  uuid,
  GLTFLoader,
  TextureLoader,
};

export default KaneRender;
