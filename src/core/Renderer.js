import { Mesh } from "../objects/Mesh.js";
import { Vector2 } from "../math/Vector2";
import { SceneNode } from "../objects/SceneNode.js";
import { TextureObject } from "../buffer/TextureObject.js";
import { PerspectiveCamera } from "../camera/PerspectiveCamera.js";
import { ShaderMaterial } from "../material/ShaderMaterial.js";
import { checkGPU } from "./GPUInstance.js";
import { RenderPipeline } from "./RenderPipeline.js";
import { FrameController } from "./FrameController.js";
import { DirectionLight } from "../light/DirectionLight.js";
import { PointLight } from "../light/PointLight.js";
import { AmbientLight } from "../light/AmbientLight.js";
import { Light } from "../light/Light.js";
import { UniformBuffer } from "../buffer/UniformBuffer.js";
import { BuiltinLight, BuiltinsUniform } from "../utils/constants.js";
import { Color } from "../math/Color.js";

const GPUTextureUsage = window.GPUTextureUsage ?? {};

/**
 * Class for handling the rendering of the scene.
 */
class Renderer {

  /**
   * @param {HTMLCanvasElement} props.canvas - The canvas element for rendering
   **/
  canvas;

  /**
   * The scene to be rendered.
   * @type {SceneNode}
   */
  scene;

  /**
   * The camera used for rendering.
   * @type {PerspectiveCamera}
   */
  camera;

  /**
   * The frame controller for managing the rendering loop.
   * @type {FrameController}
   */
  controls = new FrameController(this.render.bind(this));

  /**
   * The cubemap used for rendering.
   * @type {TextureObject}
   */
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

  /**
   * The lights in the scene.
   * @type {{directionLight: Array.<DirectionLight>, pointLight: Array.<PointLight>, ambientLight: Array.<AmbientLight|Light>}}
   */
  lights = {
    ambientLight   : new AmbientLight({ intensity: 0 }),
    directionLight : {
      lights: [
        new DirectionLight({ intensity: 0 }),
      ],
      buffer: undefined,
    },
    pointLight: {
      lights: [
        new PointLight({ intensity: 0, color: new Color(0, 0, 0) }),
      ],
      buffer: undefined,
    },
  };

  /**
   * The GPU instance for rendering.
   * @type {GPUInstance}
   */
  gpu;

  /**
   * The promise for initializing the GPU.
   * @type {Promise<GPUInstance>}
   */
  promise;

  /**
   * Flag for checking if the GPU is being initialized.
   * @type {boolean}
   */
  gpuChecking = true;

  /**
   * The number of samples to use for multisampling.
   * @type {number}
   */
  sampleCount = 1;

  /**
   * The resolution of the presentation.
   * @type {Vector2}
   */
  presentationSize = new Vector2();

  /**
   * The format of the presentation texture.
   * @type
   *  * {string}
   */
  presentationFormat = "bgra8unorm";

  /**
   * The depth texture for rendering.
   * @type {TextureObject}
   */
  _depthTexture = new TextureObject();

  /**
   * The render pass descriptor for rendering.
   * @type {GPURenderPassDescriptor}
   */
  _renderPassDescriptor;

  /**
   * The color attachments for rendering.
   * @type {Array.<GPURenderPassColorAttachmentDescriptor>}
   */
  _colorAttachments;

  /**
   * The cached pipelines for rendering.
   * @type {Map<string, RenderPipeline>}
   */
  _cachedPipline = new Map();

  /**
   * The update callbacks for the renderer.
   * @type {Array.<Function>}
   */
  _updateCallbacks = [];

  /**
   * Creates a new renderer.
   * @param {Object} props - The properties of the renderer.
   * @param {HTMLCanvasElement} props.canvas - The canvas element for rendering.
   * @param {SceneNode} [props.scene=new SceneNode()] - The scene to be rendered.
   * @param {PerspectiveCamera} props.camera - The camera used for rendering.
   */
  constructor(props) {
    this.canvas = props.canvas;
    this.scene = props.scene ?? new SceneNode();
    this.camera = props.camera;
    // prohibit default mouse event
    this.canvas.oncontextmenu = () => false;
    this.canvas.onwheel = () => false;
    this.promise = checkGPU(this.canvas).then((gpu) => {
      this.gpu = gpu;
      this.gpuChecking = false;
      this.presentationFormat = this.gpu.preferredFormat;
      return gpu;
    }, (err) => {
      console.warn(err);
      this.stop();
    });
  }

  /**
   * Adds a light to the scene.
   * @param {DirectionLight|PointLight|AmbientLight|Light} light - The light to be added.
   */
  addLight(light) {
    if (light instanceof DirectionLight) {
      if (!this.lights.directionLight) {
        this.lights.directionLight = {};
        this.lights.directionLight.lights = [];
      }
      this.lights.directionLight.lights.push(light);
    }
    else if (light instanceof PointLight) {
      if (!this.lights.pointLight) {
        this.lights.pointLight = {};
        this.lights.pointLight.lights = [];
      }
      this.lights.pointLight.lights.push(light);
    }
    else if (light instanceof AmbientLight || light instanceof Light) {
      this.lights.ambientLight = light;
    }
    this.needRecreateLightBuffer = true;
  }

  updateLightBuffer(device) {
    if (this.lights) {
      let directionLightLength = 0;
      if (this.lights.directionLight && this.lights.directionLight.lights.length > 0) {
        directionLightLength = this.lights.directionLight.lights.length;
      }

      let pointLightLength = 0;
      if (this.lights.pointLight && this.lights.pointLight.lights.length > 0) {
        pointLightLength = this.lights.pointLight.lights.length;
      }

      if (!this.lights.uniformBuffer || this.needRecreateLightBuffer) {
        let uniformDescription = JSON.parse(JSON.stringify(BuiltinsUniform.LightUniform));

        uniformDescription.items[1].size *= pointLightLength;
        uniformDescription.items[2].size *= directionLightLength;

        this.lights.uniformBuffer = new UniformBuffer(uniformDescription);
        this.needRecreateLightBuffer = false;
      }

      this.lights.uniformBuffer.set(device, BuiltinLight.AmbientLight.name, this.lights.ambientLight.getBuffer().buffer);

      if (directionLightLength > 0) {
        if (!this.directionLightBuffer || this.directionLightBuffer.length !== directionLightLength * DirectionLight.BUFFER_SIZE) {
          this.directionLightBuffer = new Float32Array(directionLightLength * DirectionLight.BUFFER_SIZE);
        }
        this.lights.directionLight?.lights.forEach((light, index) => {
          this.directionLightBuffer.set(light.getBuffer(), index * DirectionLight.BUFFER_SIZE);
        });
        this.lights.uniformBuffer.set(device, BuiltinLight.DirectionLight.name, this.directionLightBuffer.buffer);
      }

      if (pointLightLength > 0) {
        if (!this.pointLightBuffer || this.pointLightBuffer.length !== pointLightLength * PointLight.BUFFER_SIZE) {
          this.pointLightBuffer = new Float32Array(pointLightLength * PointLight.BUFFER_SIZE);
        }
        for (let i = 0; i < pointLightLength; i++) {
          let light = this.lights.pointLight.lights[i];
          this.pointLightBuffer.set(light.getBuffer(), i * PointLight.BUFFER_SIZE);
        }
        this.lights.uniformBuffer.set(device, BuiltinLight.PointLight.name, this.pointLightBuffer.buffer);
      }
    }
  }

  /**
   * Start rendering the scene.
   * @return {Renderer} The renderer instance.
   */
  start() {
    this.controls.start();
    return this;
  }

  /**
   * Stop rendering the scene.
   * @return {Renderer} The renderer instance.
   */
  stop() {
    this.controls.pause();
    return this;
  }

  /**
   * Destroys the renderer and cleans up any resources.
   */
  destroy() {
    ShaderMaterial.clearCache();
    this.scene.destroy();
    this.camera.destroy();
    this._depthTexture?.destroy();
  }

  /**
   * Add a callback function that will be called every frame before rendering.
   * @param {Function} callback - The callback function to be called.
   * @return {Renderer} The renderer instance.
   */
  onUpdate(callback) {
    this._updateCallbacks.push(callback);
    return this;
  }

  /**
   * The render loop function that updates and renders the scene.
   */
  render() {
    // waiting for webgpu device
    if (this.gpuChecking) {
      return;
    }
    const { device, ctx } = this.gpu;
    // resize canvas
    this._handleResize();
    // update camera matrix
    this.camera.updateMatrix(device);
    // on update
    this._updateCallbacks.forEach((cb) => cb());

    // update light buffer
    this.updateLightBuffer(device);

    // render
    this._colorAttachments[0].view = ctx.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder?.beginRenderPass(this._renderPassDescriptor);
    this._renderNode(this.scene, passEncoder);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  /**
   * Recursive function for rendering a node and its children.
   * @param {SceneNode} node - The node to be rendered.
   * @param {GPUCommandEncoder} passEncoder - The GPU command encoder for the render pass.
   */
  _renderNode(node, passEncoder) {
    node.updateMatrix();
    if (node instanceof Mesh) {
      this._renderMesh(node, passEncoder);
    }
    for (const child of node.children) {
      this._renderNode(child, passEncoder);
    }
  }

  /**
   * @param {Mesh} node - The node to render
   * @param {Object} passEncoder - The pass encoder of WebGPU
   * Renders the given Mesh node using the given passEncoder
  */
  _renderMesh(node, passEncoder) {
    const gpu = this.gpu;
    const { device } = gpu;
    const { geometry, material } = node;
    const { camera, presentationFormat } = this;
    const uniforms = [camera.uniform, node.uniform];
    node.updateUniform(device, camera);
    material.attachLight(this.lights);
    // get redner pipeline from cache
    let renderPipeline = this._cachedPipline.get(material);
    if (!renderPipeline) {
      const bindGroupLayoutEntry = uniforms.map((u) => u.layoutEntry);
      // create render pipeline
      renderPipeline = new RenderPipeline(gpu, {
        bindGroupLayouts     : [bindGroupLayoutEntry, material.getLayoutEntries()],
        vertexBufferLayouts  : geometry.vertexBufferLayouts,
        vertexShaderModule   : material.getVertexShaderModule(device),
        fragmentShaderModule : material.getFragmentShaderModule(device),
        presentationFormat   : presentationFormat,
        blend                : material.getBlend(),
        primitive            : {
          cullMode : material.cullMode,
          topology : material.topology,
        },
      });
      this._cachedPipline.set(material, renderPipeline);
    }
    const bindGroupEntry = uniforms.map((u) => u.getBindGroupEntry(device));
    const bindGroup = device.createBindGroup({
      layout  : renderPipeline.pipeline.getBindGroupLayout(0),
      entries : bindGroupEntry,
    });
    const materialBindGroup = material.getBindGroup(device, renderPipeline.pipeline.getBindGroupLayout(1), this.cubemap);
    passEncoder.setPipeline(renderPipeline.pipeline);
    // set bind group for vertex shader
    passEncoder.setBindGroup(0, bindGroup);
    // set bind group for fragment shader
    passEncoder.setBindGroup(1, materialBindGroup);
    geometry.attachVertexBuffer(device, passEncoder);
    geometry.attachIndexBuffer(device, passEncoder);
    passEncoder.drawIndexed(geometry.indexCount);
  }

  /**
   * Handle Resize of the renderer
   * @param {boolean} [force=false] - whether force resize even if the size does not change
   * @return {boolean} - whether resize actually happened
  */
  _handleResize(force = false) {
    const { ctx, device } = this.gpu;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    const width = this.canvas.clientWidth ?? 800;
    const height = this.canvas.clientHeight ?? 600;
    this.presentationSize.set(width * devicePixelRatio, height * devicePixelRatio);
    const needResize = this.canvas.width !== this.presentationSize.x
            || this.canvas.height !== this.presentationSize.y;
    if (needResize || force) {
      this.canvas.width = this.presentationSize.x;
      this.canvas.height = this.presentationSize.y;
      ctx.configure({
        device,
        format    : this.presentationFormat,
        alphaMode : "opaque",
      });
      this._colorAttachments = [{
        view       : undefined,
        storeOp    : "store",
        loadOp     : "clear",
        clearValue : { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
      }];
      // update depth texture
      this._depthTexture?.destroy();
      this._depthTexture.getTexture(device, true, {
        size   : this.presentationSize.toArray(),
        format : "depth24plus",
        usage  : GPUTextureUsage.RENDER_ATTACHMENT,
      });
      this._renderPassDescriptor = {
        colorAttachments       : this._colorAttachments,
        depthStencilAttachment : {
          view            : this._depthTexture.getView(device),
          depthLoadOp     : "clear",
          depthClearValue : 1.0,
          depthStoreOp    : "store",
        },
      };
      if (this.camera instanceof PerspectiveCamera) {
        this.camera.aspect = width / height;
        this.camera.needsUpdateProjectionMatrix = true;
      }
      return needResize;
    }
  }
}

export { Renderer };
