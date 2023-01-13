import { Matrix3 } from "../math/Matrix3.js";
import { Matrix4 } from "../math/Matrix4.js";
import { Vector3 } from "../math/Vector3";
import { UniformBuffer } from "../buffer/UniformBuffer.js";
import { TextureObject } from "../buffer/TextureObject.js";
import { Mesh } from "./Mesh.js";
import { GPUTextureUsage } from "../utils/WebGPUTypes.js";
import { BuiltinsMatrix, BuiltinsUniform } from "../utils/constants.js";

/**
 @class SceneNode
 A SceneNode represents a node in a scene graph. It has a name, a parent and children, a position, a rotation, and a scale.
 It also has a local and world matrix, and a uniform buffer for storing matrices. It can be added to another SceneNode as a child, and has a cubemap texture.
 @property {string} name - The name of the node
 @property {SceneNode} parent - The parent of the node
 @property {Array<SceneNode>} children - The children of the node
 @property {Vector3} position - The position of the node
 @property {Vector3} rotation - The rotation of the node
 @property {Vector3} scale - The scale of the node
 @property {Matrix4} localMatrix - The local matrix of the node
 @property {Matrix4} worldMatrix - The world matrix of the node
 @property {UniformBuffer} uniform - The uniform buffer for storing matrices
 @property {TextureObject} cubemap - The cubemap texture of the node
 @property {bool} matrixNeedsUpdate - A flag indicating if the matrix needs to be updated
 */
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

  /**
   * Creates a new SceneNode
   *
   * @param {string} name - The name of the node. Defaults to an empty string
   */
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

  /**
   * Destroys the SceneNode and its children
   *
   * @param {SceneNode} node - The node to be destroyed. Defaults to 'this'
   */
  destroy(node = this) {
    node.uniform.destroy();
    for (const child of node.children) {
      if (child instanceof Mesh) {
        child.uniform.destroy();
        child.destroy();
      }
    }
  }

  /**
   * Adds a child node to the SceneNode
   *
   * @param {SceneNode} node - The child node to be added
   * @returns {SceneNode} - The added child node
   */
  add(node) {
    this.children.push(node);
    node.setParent(this);
    return node;
  }

  /**
   * Sets the parent of the SceneNode
   *
   * @param {SceneNode} node - The new parent of the node
   */
  setParent(node) {
    this.parent = node;
    this.matrixNeedsUpdate = true;
  }

  /**
   * Updates the local and world matrices of the SceneNode
   *
   * @param {bool} force - A flag indicating if the matrix should be updated even if it doesn't need to be
   */
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

  /**
   * Updates the uniform buffer with the matrices of the SceneNode
   *
   * @param {Object} device - The device to update the uniform buffer on
   * @param {SceneNode} camera - The camera node used to calculate the model-view matrix
   */
  updateUniform(device, camera) {
    const modelMatrix = this.worldMatrix;
    const modelViewMatrix = camera.viewMatrix.clone().multiply(modelMatrix);
    const normalViewMatrix = new Matrix3().fromMatrix4(modelViewMatrix);
    this.uniform.set(device, BuiltinsMatrix.ModelMatrix.name, modelMatrix.elements.buffer);
    this.uniform.set(device, BuiltinsMatrix.ModelViewMatrix.name, modelViewMatrix.elements.buffer);
    this.uniform.set(device, BuiltinsMatrix.NormalMatrix.name, normalViewMatrix.elements.buffer);
  }
}

export { SceneNode };
