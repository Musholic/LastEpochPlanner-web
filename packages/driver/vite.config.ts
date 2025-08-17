import * as path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import Inspect from "vite-plugin-inspect";

const packerR2Dir = path.resolve(__dirname, "../packer/r2");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  logLevel: "info",
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), packerR2Dir],
    },
    // Owner's Cloudflare Tunnel domain for mobile testing
    allowedHosts: ["local.pob.cool"],
  },
  define: {
    __ASSET_PREFIX__: JSON.stringify(
      mode === "development" && process.env.POB_COOL_ASSET === undefined
        ? `/@fs/${packerR2Dir}`
        : "/",
    ),
    __RUN_GAME__: JSON.stringify(process.env.RUN_GAME ?? "le"),
    __RUN_VERSION__: JSON.stringify(process.env.RUN_VERSION ?? "v0.5.1"),
    __RUN_BUILD__: JSON.stringify(process.env.RUN_BUILD ?? "release"),
  },
  build: {
    sourcemap: true,
  },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["@bokuweb/zstd-wasm"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  plugins: [react(), tailwindcss(), Inspect()],
}));
