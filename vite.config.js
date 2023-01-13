import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [glsl({
    include: ["**/*.wgsl"],
  })],
  build: {
    lib: {
      entry    : resolve(__dirname, "src/index.js"),
      name     : "KaneRender",
      fileName : "kane-render",
    },
    minify : false,
    outDir : "dist",
  },
});
