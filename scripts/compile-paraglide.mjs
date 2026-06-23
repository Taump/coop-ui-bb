// Recompiles the Paraglide runtime into `src/paraglide/`.
//
// Use this (via `pnpm i18n`) instead of the `paraglide-js compile` CLI: the CLI
// has no `--urlPatterns` flag and defaults to a cookie-only strategy, which
// breaks URL-based locale switching. This script compiles with the exact same
// options as the Vite plugin (see paraglide.config.mjs).
//
// Run after editing `messages/*.json`.

import { compile } from "@inlang/paraglide-js";
import { paraglideCompilerOptions } from "../paraglide.config.mjs";

await compile(paraglideCompilerOptions);

console.log("✓ Paraglide compiled to", paraglideCompilerOptions.outdir);
