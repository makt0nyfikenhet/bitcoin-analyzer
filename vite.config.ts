// Libs
import { defineConfig } from "vite";
import path from "path";
import { rollup, InputOptions, OutputOptions } from "rollup";
// Plugins
import typescript2 from "rollup-plugin-typescript2";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

const CompileTsServiceWorker = ({ mode }) => ({
  name: "compile-typescript-service-worker",
  async writeBundle(_options, _outputBundle) {
    const inputOptions: InputOptions = {
      input: "src/sw/autoSync/autoSync.sw.ts",
      plugins: [
        replace({
          preventAssignment: true,
          "process.env.NODE_ENV": JSON.stringify(mode),
        }),
        nodeResolve(),
        commonjs(),
        typescript2(),
        json({
          compact: true,
        }),
      ],
    };
    const distOutputOptions: OutputOptions = {
      file: "dist/autoSync.sw.js",
      format: "es",
    };
    const publicOutputOptions: OutputOptions = {
      file: "public/autoSync.sw.js",
      format: "es",
    };
    const bundle = await rollup(inputOptions);
    await bundle.write(distOutputOptions);
    await bundle.write(publicOutputOptions);
    await bundle.close();
  },
});

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    server: {
      port: 5175,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          importScripts: ["./sw-functional.js"],
          globIgnores: ["**/node_modules/**/*", "**/autoSync.sw.js"],
        },
        includeAssets: ["favicon.svg"],
      }),
      CompileTsServiceWorker({ mode }),
    ],
  });
