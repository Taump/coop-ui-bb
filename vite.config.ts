import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { ogPrerender } from "./vite-og-prerender";
import { paraglideCompilerOptions } from "./paraglide.config.mjs";

/**
 * index.html ships a strict CSP via <meta>. The contribution-log API origin is
 * deploy-specific (VITE_CONTRIBUTION_LOG_URL), so it can't be hardcoded there —
 * append it to connect-src at dev/build time when the env var is set.
 */
const cspConnectSrc = (): Plugin => {
  let extraOrigin: string | undefined;
  return {
    name: "csp-connect-src-contribution-log",
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), "VITE_");
      const url = env.VITE_CONTRIBUTION_LOG_URL;
      if (!url) return;
      try {
        extraOrigin = new URL(url).origin;
      } catch {
        // invalid URL — the app's T3 env validation will fail loudly anyway
      }
    },
    transformIndexHtml(html) {
      if (!extraOrigin) return html;
      return html.replace(
        /connect-src ([^;]*);/,
        `connect-src $1 ${extraOrigin};`,
      );
    },
  };
};

const config = defineConfig({
  plugins: [
    cspConnectSrc(),
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
