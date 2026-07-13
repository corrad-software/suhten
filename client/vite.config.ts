import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

import { stDevBridgePlugin } from "./dev/stDevBridgePlugin";

export default defineConfig({
  plugins: [vue(), stDevBridgePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5180,
  },
});
