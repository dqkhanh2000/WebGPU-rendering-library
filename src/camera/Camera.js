import { Matrix4 } from "../math/Matrix.js";
import { Vector3 } from "../math/Vector.js";
import { UniformBuffer } from "../buffer/UniformBuffer.js";

class Camera {
  position;

  lookAt;

  up;

  viewMatrix;

  projectionMatrix;

  uniform;

  static UniformKeys = {
    VIEW_MATRIX             : "ViewMatrix",
    PROJECTION_MATRIX       : "ProjectionMatrix",
    CAMERA_POS              : "CameraPos",
    VIEW_PROJECTION_INVERSE : "ViewProjectionInverseMatrix",
  };

  needsUpdateViewMatrix;

  needsUpdateProjectionMatrix;

  constructor(props) {
    this.position = props.position ?? new Vector3(3, 3, 3);
    this.lookAt = props.lookAt ?? new Vector3(0, 0, 0);
    this.up = props.up ?? Vector3.up();
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.needsUpdateViewMatrix = true;
    this.needsUpdateProjectionMatrix = true;
    this.uniform = new UniformBuffer({
      binding : 0,
      name    : "CameraUniform",
      items   : [
        { name: Camera.UniformKeys.VIEW_MATRIX, size: 4 * 16 },
        { name: Camera.UniformKeys.PROJECTION_MATRIX, size: 4 * 16 },
        { name: Camera.UniformKeys.CAMERA_POS, size: 4 * 4 },
        { name: Camera.UniformKeys.VIEW_PROJECTION_INVERSE, size: 4 * 16 },
      ],
    });
  }

  destroy() {
    this.uniform.destroy();
  }
}

export { Camera };
