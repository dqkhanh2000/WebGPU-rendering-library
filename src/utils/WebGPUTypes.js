export const GPUShaderStage = Object.freeze({
  VERTEX   : 1,
  FRAGMENT : 2,
  COMPUTE  : 4,
});

export const GPUBufferUsage = Object.freeze({
  MAP_READ      : 1,
  MAP_WRITE     : 2,
  COPY_SRC      : 4,
  COPY_DST      : 8,
  INDEX         : 16,
  VERTEX        : 32,
  UNIFORM       : 64,
  STORAGE       : 128,
  INDIRECT      : 256,
  QUERY_RESOLVE : 512,
});

export const GPUTextureUsage = Object.freeze({
  COPY_SRC          : 1,
  COPY_DST          : 2,
  SAMPLED           : 4,
  STORAGE           : 8,
  OUTPUT_ATTACHMENT : 16,
});

export const GPUColorWrite = Object.freeze({
  NONE  : 0,
  RED   : 1,
  GREEN : 2,
  BLUE  : 4,
  ALPHA : 8,
  ALL   : 15,
});

export const GPUPrimitiveTopology = Object.freeze({
  POINT_LIST     : "point-list",
  LINE_LIST      : "line-list",
  LINE_STRIP     : "line-strip",
  TRIANGLE_LIST  : "triangle-list",
  TRIANGLE_STRIP : "triangle-strip",
});

export const GPUMapMode = Object.freeze({
  READ  : 1,
  WRITE : 2,
});
