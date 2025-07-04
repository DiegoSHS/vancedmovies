import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      events: "events",
      path: "path-browserify",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      buffer: "buffer",
      util: "util",
      url: "url",
      querystring: "querystring-es3",
      fs: "memfs",
      os: "os-browserify",
      process: "process",
      assert: "assert",
      vm: "vm-browserify",
    },
  },
  optimizeDeps: {
    include: [
      "events",
      "path-browserify",
      "crypto-browserify",
      "stream-browserify",
      "buffer",
      "util",
      "url",
      "querystring-es3",
      "os-browserify",
      "process",
      "assert",
      "hls.js"
    ],
  },
  build: {
    sourcemap: false,
  },
});
