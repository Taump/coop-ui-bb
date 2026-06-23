# Obyte COOP — web app

Client-side SPA for [Obyte COOP](https://coop.obyte.org), the cooperative-token
protocol on the [Obyte](https://obyte.org) DAG. Built with Vite + React 19 +
TanStack. It talks to the COOP Autonomous Agent (AA) in [`../coop-aa`](../coop-aa).

## What it does

On load the app reads all AA state over a WebSocket (`getAllStateVarsByAddress`)
and subscribes to `light/aa_response` for live updates. User actions
(deposit, vote, claim, withdraw, replace, governance) are turned into `obyte:`
deep links that the user's wallet signs and broadcasts; the AA response arrives
over the WebSocket and the UI updates. Social-preview images are served by the
[`../coop-og`](../coop-og) service.

## Tech stack

- **Vite 7 + React 19** — client-only SPA, no SSR; React Compiler enabled.
- **TanStack** — Router (file-based routes), Query (server state), Store (client state).
- **Tailwind CSS v4** + **shadcn/ui** (new-york style, zinc base).
- **ParaglideJS** i18n — locales `en` (base), `zh`, `es`, `ru`, `uk`.
- **T3 Env** for type-safe env vars, **TypeScript** strict, **Vitest** for tests.

## Quick start

```bash
pnpm install
cp .env.example.testnet .env   # then edit if needed
pnpm dev                       # http://localhost:4000
```

## Environment

Variables are validated in `src/shared/config/env.ts`. Copy
`.env.example.testnet` to `.env` to get started.

| Var               | Required | Description                                            |
| ----------------- | -------- | ------------------------------------------------------ |
| `VITE_AA_ADDRESS` | yes      | 32-char COOP main AA address                           |
| `VITE_TESTNET`    | no       | `true` for testnet, anything else for livenet          |
| `VITE_OG_URL`     | no       | Base URL of the `coop-og` service (used in OG `<meta>`) |
| `VITE_APP_TITLE`  | no       | Optional app title                                     |

## Scripts

| Command        | Description                                        |
| -------------- | -------------------------------------------------- |
| `pnpm dev`     | Dev server on port 4000                            |
| `pnpm build`   | Production build                                   |
| `pnpm preview` | Preview the production build                        |
| `pnpm test`    | Run tests (Vitest)                                 |
| `pnpm lint`    | ESLint                                             |
| `pnpm format`  | Prettier check                                     |
| `pnpm check`   | Auto-fix: `prettier --write .` then `eslint --fix` |

Add shadcn components: `pnpm dlx shadcn@latest add <component>`.

## Architecture

The project follows [Feature-Sliced Design](https://feature-sliced.design/)
under `src/`, with imports flowing downward only:

```
app > pages > widgets > features > entities > shared
```

Path aliases `#/*` and `@/*` both resolve to `./src/*`. See
[`CLAUDE.md`](./CLAUDE.md) for the full layer-by-layer breakdown, the AA actions
reference, and the shared utilities.

## i18n

Messages live in `messages/`. The Paraglide runtime is generated into
`src/paraglide/` (auto-generated — do not edit) and regenerated when you run the
dev server or a build.

## Deployment

Deployed on Vercel; `vercel.json` rewrites all routes to `/index.html` for SPA
client-side routing.

## Related projects

- [`../coop-aa`](../coop-aa) — Autonomous Agent smart contracts (Oscript) + tests
- [`../coop-og`](../coop-og) — Open Graph image service
- [`../coop-governance-discord`](../coop-governance-discord) — governance → Discord notifier
