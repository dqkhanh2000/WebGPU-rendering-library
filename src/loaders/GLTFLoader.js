import * as GT from "@gltf-transform/core";
import { BufferGeometry } from "../geometry/BufferGeometry.js";
import { PhysicalMaterial } from "../material/PhysicalMaterial.js";
import { SceneNode } from "../objects/SceneNode.js";
import { Mesh } from "../objects/Mesh.js";
import { Quaternion } from "../math/Quaternion.js";
import { BaseLoader } from "./BaseLoader.js";
import { TextureObject } from "../buffer/TextureObject.js";

const io = new GT.WebIO({ credentials: "include" });
const GPUTextureUsage = window.GPUTextureUsage ?? {};
const GLTFWrapModeMapper = {
  33071 : "clamp-to-edge",
  33648 : "mirror-repeat",
  10497 : "repeat",
};
const DefaultTexture = new TextureObject({
  texture: {
    size   : [1, 1, 1],
    format : "rgba8unorm",
    usage  : GPUTextureUsage.TEXTURE_BINDING
            | GPUTextureUsage.COPY_DST
            | GPUTextureUsage.RENDER_ATTACHMENT,
  },
});
/**
 Class representing a GLTF Loader.
 @extends BaseLoader
 */
class GLTFLoader extends BaseLoader {
  /**
   A map of textures that are cached.
   @type {Map<Object, TextureObject>}
   */
  _cachedTextures = new Map();

  /**
   Asynchronously loads a GLTF file.
   @param {string} url - The URL of the GLTF file to load.
   @returns {Promise<SceneNode>} A promise that resolves to the root node of the GLTF scene.
   */
  async loadAsync(url, options = {}) {
    this.options = options;
    const doc = await io.read(url);
    const root = doc.getRoot();
    const scene = root.listScenes()[0];
    const rootNode = new SceneNode();
    // load textures
    await Promise.all(root.listTextures().map((_tex) => {
      const size = _tex.getSize();
      const texture = new TextureObject({
        texture: {
          size   : [size[0], size[1], 1],
          format : "rgba8unorm",
          usage  : GPUTextureUsage.TEXTURE_BINDING
                        | GPUTextureUsage.COPY_DST
                        | GPUTextureUsage.RENDER_ATTACHMENT,
        },
      });
      this._cachedTextures.set(_tex, texture);
      const blob = new Blob([_tex.getImage()]);
      return texture.setImageAsync(blob);
    }));
    // parse nodes
    scene.listChildren().forEach((child) => {
      this.parseNode(child, rootNode);
    });
    return rootNode;
  }

  /**
   Parses a GLTF node and adds it to a parent node.
   @param {Object} _node - The GLTF node to parse.
   @param {SceneNode} parentNode - The parent node to add the parsed node to.
   @returns {SceneNode} The parsed node.
   */
  parseNode(_node, parentNode) {
    let node;
    const _mesh = _node.getMesh();
    if (_mesh) {
      node = this.parseMesh(_mesh);
    }
    else {
      node = new SceneNode();
    }
    const position = _node.getTranslation();
    const quat = new Quaternion(..._node.getRotation());
    const rotation = quat.getEuler();
    const scale = _node.getScale();
    node.position.set(...position);
    node.rotation.copy(rotation);
    node.scale.set(...scale);
    parentNode.add(node);
    _node.listChildren().forEach(((child) => {
      this.parseNode(child, node);
    }));
    return node;
  }

  /**
   Parses a GLTF mesh and creates a Mesh object.
   @param {Object} _mesh - The GLTF mesh to parse.
   @returns {Mesh} The parsed mesh.
   */
  parseMesh(_mesh) {
    const geometry = this.parseGeometry(_mesh);
    const material = this.parseMaterial(_mesh);
    const mesh = new Mesh({
      geometry,
      material,
    });
    return mesh;
  }

  /**
   Parses a GLTF geometry and creates a BufferGeometry object.
   @param {Object} _mesh - The GLTF mesh that contains the geometry to parse.
   @returns {BufferGeometry} The parsed geometry.
  */
  parseGeometry(_mesh) {
    const primitive = _mesh.listPrimitives()[0];
    const vertices = primitive.getAttribute("POSITION");
    const indices = primitive.getIndices();
    const normal = primitive.getAttribute("NORMAL");
    const uv = primitive.getAttribute("TEXCOORD_0");
    const color = primitive.getAttribute("COLOR_0");
    const geometry = new BufferGeometry({
      position : vertices.getArray(),
      normal   : normal?.getArray() ?? new Float32Array(),
      uv       : uv?.getArray() ?? new Float32Array(),
      color    : color?.getArray(),
      index    : indices.getArray(),
    });
    return geometry;
  }

  /**
   Parses a GLTF material and creates a PhysicalMaterial object.
   @param {Object} _mesh - The GLTF mesh that contains the material to parse.
   @returns {PhysicalMaterial} The parsed material.
   */
  parseMaterial(_mesh) {
    if (this.options.material) {
      return this.options.material;
    }
    else {
      const primitive = _mesh.listPrimitives()[0];
      const _mat = primitive.getMaterial();
      let baseColorTexture = DefaultTexture;
      let normalTexture = DefaultTexture;
      let metallicRoughnessTexture = DefaultTexture;
      let emissiveTexture = DefaultTexture;
      let aoTexture = DefaultTexture;
      let blendMode = _mat.getAlphaMode();
      const updateTextureInfo = (texture, info) => {
        texture?.updateDescriptor({
          sampler: {
            addressModeU : GLTFWrapModeMapper[info.getWrapS()],
            addressModeV : GLTFWrapModeMapper[info.getWrapT()],
          },
        });
      };
      if (_mat.getBaseColorTexture()) {
        baseColorTexture = this._cachedTextures.get(_mat.getBaseColorTexture());
        updateTextureInfo(baseColorTexture, _mat.getBaseColorTextureInfo());
      }
      if (_mat.getNormalTexture()) {
        normalTexture = this._cachedTextures.get(_mat.getNormalTexture());
        updateTextureInfo(normalTexture, _mat.getNormalTextureInfo());
      }
      if (_mat.getMetallicRoughnessTexture()) {
        metallicRoughnessTexture = this._cachedTextures.get(_mat.getMetallicRoughnessTexture());
        updateTextureInfo(metallicRoughnessTexture, _mat.getMetallicRoughnessTextureInfo());
      }
      if (_mat.getEmissiveTexture()) {
        emissiveTexture = this._cachedTextures.get(_mat.getEmissiveTexture());
        updateTextureInfo(emissiveTexture, _mat.getEmissiveTextureInfo());
      }
      if (_mat.getOcclusionTexture()) {
        aoTexture = this._cachedTextures.get(_mat.getOcclusionTexture());
        updateTextureInfo(aoTexture, _mat.getOcclusionTextureInfo());
      }
      return new PhysicalMaterial({
        baseColorTexture,
        normalTexture,
        metallicRoughnessTexture,
        emissiveTexture,
        aoTexture,
        blendMode,
      });
    }
  }
}

export { GLTFLoader };
