class GPUInstance {
  ctx;

  adapter;

  device;

  preferredFormat;

  constructor(ctx, adapter, device) {
    this.ctx = ctx;
    this.adapter = adapter;
    this.device = device;
    this.preferredFormat = navigator.gpu.getPreferredCanvasFormat();
  }
}
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
