import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [glsl({
    include: ["**/*.wgsl"],
  })],
  build: {
    minify        : false,
    outDir        : "dist",
    rollupOptions : {
      input  : "src/index.js",
      output : {
        dir    : "dist",
        format : "esm",
      },
    },
  },
});
