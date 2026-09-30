import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/extension/content.ts", import.meta.url)),
      formats: ["iife"],
      name: "TruePostContent",
      fileName: () => "content.js"
    },
    outDir: "dist",
    emptyOutDir: false
  }
});
