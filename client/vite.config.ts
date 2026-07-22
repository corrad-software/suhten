import { defineConfig, loadEnv, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

import { stDevBridgePlugin } from "./dev/stDevBridgePlugin";

function envFlag(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  return ["true", "1", "yes", "on"].includes(value.trim().toLowerCase());
}

/** Reliably bake MASK_URL into client/src/env.ts (Vite define can miss identifiers). */
function maskUrlInjectPlugin(maskUrl: boolean): Plugin {
  return {
    name: "mask-url-inject",
    enforce: "pre",
    transform(code, id) {
      const normalized = id.replace(/\\/g, "/");
      if (!normalized.endsWith("/src/env.ts")) {
        return null;
      }
      if (!code.includes("__MASK_URL_INJECT__")) {
        return null;
      }
      return {
        code: code.replace(
          /export const MASK_URL = false; \/\/ __MASK_URL_INJECT__/,
          `export const MASK_URL = ${maskUrl ? "true" : "false"}; // __MASK_URL_INJECT__`,
        ),
        map: null,
      };
    },
  };
}

export default defineConfig(({ mode }) => {
  // Root .env holds MASK_URL; client .env may override with VITE_MASK_URL.
  const rootEnv = loadEnv(mode, path.resolve(__dirname, ".."), "");
  const clientEnv = loadEnv(mode, __dirname, "");
  const maskUrl = envFlag(clientEnv.VITE_MASK_URL || rootEnv.MASK_URL);

  console.log(`[vite] MASK_URL=${maskUrl ? "ON" : "OFF"} (from .env)`);

  return {
    plugins: [maskUrlInjectPlugin(maskUrl), vue(), stDevBridgePlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5180,
    },
  };
});
