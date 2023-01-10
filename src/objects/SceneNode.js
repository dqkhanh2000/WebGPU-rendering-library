import { Matrix3 } from "../math/Matrix3.js";
import { Matrix4 } from "../math/Matrix4.js";
import { Vector3 } from "../math/Vector3";
import { UniformBuffer } from "../buffer/UniformBuffer.js";
import { TextureObject } from "../buffer/TextureObject.js";
import { Mesh } from "./Mesh.js";
import { GPUTextureUsage } from "../utils/WebGPUTypes.js";
import { BuiltinsMatrix, BuiltinsUniform } from "../utils/constants.js";

class SceneNode {
  name;

  parent;

  children;

  position;

  rotation;

  scale;

  localMatrix;

  worldMatrix;

  uniform;

  // cube texture
  cubemap = new TextureObject({
    texture: {
      size   : [1, 1, 6],
      format : "rgba8unorm",
      usage  : GPUTextureUsage.TEXTURE_BINDING
                | GPUTextureUsage.COPY_DST
                | GPUTextureUsage.RENDER_ATTACHMENT,
    },
    view: {
      dimension: "cube",
    },
  });

  matrixNeedsUpdate = true;

  constructor(name) {
    this.name = name ?? "";
    this.children = [];
    this.position = Vector3.ZERO;
    this.rotation = Vector3.ZERO;
    this.scale = Vector3.ONE;
    this.localMatrix = new Matrix4();
    this.worldMatrix = new Matrix4();
    [
      this.position,
      this.rotation,
      this.scale,
    ].forEach((v) => v.onChange(() => this.matrixNeedsUpdate = true));
    this.uniform = new UniformBuffer(BuiltinsUniform.TransformUniform);
  }

  destroy(node = this) {
    node.uniform.destroy();
    for (const child of node.children) {
      if (child instanceof Mesh) {
        child.uniform.destroy();
        child.destroy();
      }
    }
  }

  add(node) {
    this.children.push(node);
    node.setParent(this);
    return node;
  }

  setParent(node) {
    this.parent = node;
    this.matrixNeedsUpdate = true;
  }

  updateMatrix(force = false) {
    if (this.matrixNeedsUpdate || force) {
      this.matrixNeedsUpdate = false;
      // update local matrix
      this.localMatrix
        .identity()
        .translate(this.position)
        .rotate(this.rotation.x, Vector3.RIGHT)
        .rotate(this.rotation.y, Vector3.UP)
        .rotate(this.rotation.z, Vector3.FORWARD)
        .scale(this.scale);
      // update world matrix
      this.worldMatrix.copy(this.parent?.worldMatrix ?? new Matrix4()).multiply(this.localMatrix);
      // update children
      this.children.forEach((child) => child.matrixNeedsUpdate = true);
    }
  }

  updateUniform(device, camera) {
    const modelMatrix = this.worldMatrix;
    const modelViewMatrix = camera.viewMatrix.clone().multiply(modelMatrix);
    const normalViewMatrix = new Matrix3().fromMatrix4(modelViewMatrix.clone().invert().transpose());
    this.uniform.set(device, BuiltinsMatrix.ModelMatrix.name, modelMatrix.elements.buffer);
    this.uniform.set(device, BuiltinsMatrix.ModelViewMatrix.name, modelViewMatrix.elements.buffer);
    this.uniform.set(device, BuiltinsMatrix.NormalMatrix.name, normalViewMatrix.elements.buffer);
  }
}

export { SceneNode };
