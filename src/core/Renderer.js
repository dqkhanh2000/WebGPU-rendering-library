import { Mesh } from "../objects/Mesh.js";
import { Vector2 } from "../math/Vector.js";
import { SceneNode } from "../objects/SceneNode.js";
import { TextureObject } from "../buffer/TextureObject.js";
import { PerspectiveCamera } from "../camera/PerspectiveCamera.js";
import { ShaderMaterial } from "../material/ShaderMaterial.js";
import { checkGPU } from "./GPUInstance.js";
import { RenderPipeline } from "./RenderPipeline.js";
import { FrameController } from "./FrameController.js";

const GPUTextureUsage = window.GPUTextureUsage ?? {};
class Renderer {
  // canvas dom
  canvas;

  // scene root
  scene;

  // camera
  camera;

  // frame controller
  controls = new FrameController(this.render.bind(this));

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

  // check webgpu support
  gpu;

  promise;

  gpuChecking = true;

  // TODO: msaa, must be 1 or 4
  sampleCount = 1;

  // resolution
  presentationSize = new Vector2();

  // texture format
  presentationFormat = "bgra8unorm";

  // textures
  _depthTexture = new TextureObject();

  // render pass configuration
  _renderPassDescriptor;

  _colorAttachments;

  // piplines
  _cachedPipline = new Map();

  // hooks
  _updateCallbacks = [];

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

  start() {
    this.controls.start();
    return this;
  }

  stop() {
    this.controls.pause();
    return this;
  }

  destroy() {
    ShaderMaterial.clearCache();
    this.scene.destroy();
    this.camera.destroy();
    this._depthTexture?.destroy();
  }

  onUpdate(callback) {
    this._updateCallbacks.push(callback);
    return this;
  }

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
    // render
    this._colorAttachments[0].view = ctx.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder?.beginRenderPass(this._renderPassDescriptor);
    this._renderNode(this.scene, passEncoder);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  _renderNode(node, passEncoder) {
    node.updateMatrix();
    if (node instanceof Mesh) {
      this._renderMesh(node, passEncoder);
    }
    for (const child of node.children) {
      this._renderNode(child, passEncoder);
    }
  }

  _renderMesh(node, passEncoder) {
    const gpu = this.gpu;
    const { device } = gpu;
    const { geometry, material } = node;
    const { camera, presentationFormat } = this;
    const uniforms = [camera.uniform, node.uniform];
    node.updateUniform(device, camera);
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
    const bindGroup = device.createBindGroup({
      layout  : renderPipeline.pipeline.getBindGroupLayout(0),
      entries : uniforms.map((u) => u.getBindGroupEntry(device)),
    });
    const materialBindGroup = material.getBindGroup(device, renderPipeline.pipeline.getBindGroupLayout(1), this.cubemap);
    passEncoder.setPipeline(renderPipeline.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.setBindGroup(1, materialBindGroup);
    geometry.attachVertexBuffer(device, passEncoder);
    geometry.attachIndexBuffer(device, passEncoder);
    passEncoder.drawIndexed(geometry.indexCount);
  }

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
