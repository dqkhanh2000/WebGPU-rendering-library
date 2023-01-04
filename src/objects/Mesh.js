import { SceneNode } from "./SceneNode.js";

class Mesh extends SceneNode {
  geometry;

  material;

  constructor(props) {
    super(props?.name);
    this.geometry = props.geometry;
    this.material = props.material;
  }

  destroy() {
    this.geometry.destroy();
    this.material.destroy();
  }
}

export { Mesh };
