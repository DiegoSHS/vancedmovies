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
      // WebTorrent specific aliases
      "bittorrent-dht/client": "__vite-browser-external",
      "dgram": "__vite-browser-external",
      "net": "__vite-browser-external",
      "tls": "__vite-browser-external",
    },
  },
  optimizeDeps: {
    exclude: ["webtorrent"],
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
      "hls.js", // Agregar HLS.js específicamente
    ],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // External Node.js modules that don't have browser equivalents
        if (id.includes("bittorrent-dht")) return true;
        if (id.includes("dgram")) return true;
        if (id.includes("net")) return true;
        if (id.includes("tls")) return true;
        if (id.includes("torrent-discovery")) return true;
        return false;
      },
      output: {
        globals: {
          "bittorrent-dht": "{}",
          "dgram": "{}",
          "net": "{}",
          "tls": "{}",
          "torrent-discovery": "{}",
        },
      },
    },
  },
});
