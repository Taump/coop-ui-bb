import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { ogPrerender } from "./vite-og-prerender";
import { paraglideCompilerOptions } from "./paraglide.config.mjs";

const config = defineConfig({
  plugins: [
    ogPrerender(),
    devtools(),
    paraglideVitePlugin(paraglideCompilerOptions),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    TanStackRouterVite({
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});

export default config;
