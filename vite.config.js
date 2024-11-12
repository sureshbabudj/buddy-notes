import path from "path";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import swc from "unplugin-swc"; // Support using decorators without explicitly set ``types`` in ``TypeORM``
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

/** @type {import('vite').UserConfig} */
const config = {
  server: {
    port: 8765,
    https: true,
  },
  plugins: [
    mkcert(),
    react(),
    legacy({}),
    swc.vite({
      exclude: [], //Default would exclude all file from ``node_modules``
      jsc: {
        minify: {
          compress: true,
          mangle: true,
          //Suggested by ``capacitor-sqlite``
          keep_classnames: true,
          keep_fnames: true,
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["jeep-sqlite/loader"],
  },
};

// https://vitejs.dev/config/
export default defineConfig(config);
