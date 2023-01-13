import { SceneNode } from "./SceneNode.js";

/**
 Class representing a Mesh.
 Inherits from SceneNode.
 */
class Mesh extends SceneNode {
  /**
   The geometry of the mesh.
   @type {Object}
   */
  geometry;

  /**
   The material of the mesh.
   @type {Object}
   */
  material;

  /**
   Create a Mesh
   @param {Object} props - The properties of the mesh.
   @param {string} [props.name] - The name of the mesh.
   @param {Object} props.geometry - The geometry of the mesh.
   @param {Object} props.material - The material of the mesh.
   */
  constructor(props) {
    super(props?.name);
    this.geometry = props.geometry;
    this.material = props.material;
  }

  /**
   Destroys the mesh.
   */
  destroy() {
    this.geometry.destroy();
    this.material.destroy();
  }
}

export { Mesh };
