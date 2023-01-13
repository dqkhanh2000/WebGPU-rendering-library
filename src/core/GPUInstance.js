/**
 * A class representing a WebGPU Instance.
 */
class GPUInstance {
  /**
   * The WebGPU context.
   * @type {WebGPU}
   */
  ctx;

  /**
   * The GPU adapter.
   * @type {GPUAdapter}
   */
  adapter;

  /**
   * The GPU device.
   * @type {GPUDevice}
   */
  device;

  /**
   * The preferred format of the GPU.
   * @type {CanvasFormat}
   */
  preferredFormat;

  /**
   * @param {WebGPU} ctx - The WebGPU context.
   * @param {GPUAdapter} adapter - The GPU adapter.
   * @param {GPUDevice} device - The GPU device.
   */
  constructor(ctx, adapter, device) {
    this.ctx = ctx;
    this.adapter = adapter;
    this.device = device;
    this.preferredFormat = navigator.gpu.getPreferredCanvasFormat();
  }
}

/**
 * A function to check if WebGPU is supported by the browser.
 * @param {HTMLCanvasElement} canvas - The canvas element to check for WebGPU support.
 * @returns {Promise<GPUInstance>}
 */
const checkGPU = async(canvas) => {
  const ctx = canvas.getContext("webgpu");
  console.assert(ctx, "Your browser does not support webgpu.");
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  });
  console.assert(adapter, "Cannot get gpu adapter.");
  const device = await adapter.requestDevice();
  console.assert(device, "Cannot get gpu device.");
  return new GPUInstance(ctx, adapter, device);
};

export { GPUInstance, checkGPU };
