import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/extension/popup.ts", import.meta.url)),
      formats: ["iife"],
      name: "HumanFeedPopup",
      fileName: () => "popup.js"
    },
    outDir: "dist",
    emptyOutDir: true
  }
});
