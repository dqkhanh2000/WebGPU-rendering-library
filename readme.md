# KaneRenderer WebGPU Rendering Library

Welcome to the WebGPU Rendering Library! This library is a collection of tools and functions for creating high-performance GPU-accelerated graphics using the WebGPU API.

## Installation

To install the library, first make sure you have [Node.js](https://nodejs.org/) and [Vite](https://github.com/vitejs/vite) installed on your development machine. Then, clone this repository and run the following commands:

```
npm install
npm run dev
```

This will start a development server and open the library in your browser. You can now start experimenting with the different functions and examples provided.

## Usage

The library exports a set of classes and functions for creating and manipulating WebGPU resources such as buffers, textures, and shaders. To use the library in your own project, you can import it as follows:

```
import KaneRenderer from 'kane-renderer';

const canvas = document.querySelector("canvas");

const camera = new KaneRender.PerspectiveCamera({
  position: new KaneRender.Vector3(0, 2, 5),
  lookAt: new KaneRender.Vector3(0, 0, 0),
  fov: 60
});
const renderer = new KaneRender.Renderer({ canvas, camera });

const cube = new KaneRender.Mesh({
    geometry: new KaneRender.CubeGeometry(),
    material: new KaneRender.NormalMaterial()
  });
cube.position.set(-1, 0, 0);
renderer.scene.add(cube);

renderer.onUpdate(() => {
  cube.rotation.set(Date.now() / 1000, Date.now() / 1000, 0);

});

renderer.start();
```

You can also find usage examples in the `/examples` folder of the repository.

## License

This library is licensed under the [MIT](https://opensource.org/licenses/MIT) license.

## Acknowledgments

* The WebGPU API is a new web standard and is still in development. Be sure to check the [specification](https://gpuweb.github.io/gpuweb/) for the latest updates.
* The library is heavily inspired by [Three.js](https://threejs.org/) and [babylon.js](https://www.babylonjs.com/)

## Contact

If you have any questions or suggestions, feel free to open an issue or contact me directly at [email](mailto:dqkhanh.2kgmail.com)
