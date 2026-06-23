// Single source of truth for the Paraglide compiler options.
//
// Both the Vite plugin (vite.config.ts) and the standalone compile script
// (scripts/compile-paraglide.mjs) read from here so the generated runtime in
// `src/paraglide/` is ALWAYS produced with the same configuration.
//
// IMPORTANT: the `url` strategy + `urlPatterns` are what make locale switching
// work via the URL prefix (the router derives its basepath from the URL locale).
// The `paraglide-js compile` CLI cannot express `urlPatterns`, so never compile
// with the bare CLI — use `pnpm i18n` (scripts/compile-paraglide.mjs) instead,
// otherwise the runtime silently reverts to a cookie-only strategy and locale
// switching 404s (e.g. /ru/user/x -> /ru/uk/user/x).

/** @type {import("@inlang/paraglide-js").CompilerOptions} */
export const paraglideCompilerOptions = {
  project: "./project.inlang",
  outdir: "./src/paraglide",
  // URL first so the locale always follows the address-bar prefix; cookie /
  // localStorage persist the last choice; baseLocale is the final fallback.
  strategy: ["url", "cookie", "localStorage", "baseLocale"],
  urlPatterns: [
    {
      pattern: "/:path(.*)?",
      localized: [
        ["zh", "/zh/:path(.*)?"],
        ["es", "/es/:path(.*)?"],
        ["ru", "/ru/:path(.*)?"],
        ["uk", "/uk/:path(.*)?"],
        ["en", "/:path(.*)?"],
      ],
    },
  ],
};
