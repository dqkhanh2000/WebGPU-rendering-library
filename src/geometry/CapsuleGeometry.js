import { Path } from "../externals/extras/core/Path";
import { LatheGeometry } from "./LatheGeometry";

export class CapsuleGeometry extends LatheGeometry {

  constructor(radius = 1, length = 1, capSegments = 4, radialSegments = 8) {

    const path = new Path();
    path.absarc(0, -length / 2, radius, Math.PI * 1.5, 0);
    path.absarc(0, length / 2, radius, 0, Math.PI * 0.5);

    super(path.getPoints(capSegments), radialSegments);

    this.parameters = {
      radius         : radius,
      height         : length,
      capSegments    : capSegments,
      radialSegments : radialSegments,
    };

  }

}
