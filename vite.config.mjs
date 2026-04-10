import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/ryuutama.mjs"),
      formats: ["es"],
      fileName: "ryuutama",
    },
    rollupOptions: {
      output: {
        assetFileNames: "ryuutama.[ext]",
      },
    },
  },
});
