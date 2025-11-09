### Project-Specific Development Guidelines

This document captures the practical, project-specific details that future contributors routinely need when working on this codebase. It assumes senior-level familiarity with Next.js, TypeScript, Tailwind, and modern tooling.

#### Stack Overview
- Framework: Next.js (App Router) with `next-intl` plugin (`i18n/request.ts` is wired in `next.config.js`).
- Language/Tooling: TypeScript (strict, `moduleResolution: bundler`), TailwindCSS, shadcn/ui components.
- PDF/Export: Puppeteer (and `@sparticuz/chromium` for serverless-friendly Chromium), `@json2csv/node`, `xlsx`, and `xml2js` for invoice export formats.
- Package manager: `pnpm` (enforced via `packageManager` field in `package.json`).

---
### 1) Build and Configuration

#### Local environment
- Node version: Project is routinely built with Node 20–22; Dockerfile targets Node 22-alpine. Use >=20.
- Package manager: pnpm 10.x (see `package.json: { "packageManager": "pnpm@…" }`).
- Install dependencies:
  - `pnpm install`
- Dev server:
  - `pnpm dev` (a thin alias for `next dev`).
- Production build and start:
  - `pnpm build`
  - `pnpm start` (serves the built `.next` output).

#### i18n
- `next-intl` is enabled through `next-intl/plugin` in `next.config.js` pointing to `./i18n/request.ts`.
- Pages are locale-scoped (e.g., `app/[locale]/…`). Ensure any new routes respect the locale segment.
- When adding messages or loaders, keep them colocated under `i18n` to match the plugin path and avoid dynamic import pitfalls during build.

#### Puppeteer and headless Chromium
- `next.config.js` sets `serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"]` to keep server bundle stable. Avoid importing full `puppeteer` in server runtime code; use `puppeteer-core` with `@sparticuz/chromium` in serverless/edge-like contexts.
- There is also a dev `puppeteer` dependency for local tooling and a `puppeteer.config.cjs` that overrides cache dir to `.cache/puppeteer` (helps CI caching).
- If adding any server-side PDF/export feature:
  - Use `@sparticuz/chromium` for executable path and args.
  - Guard execution for environments where `chromium` may not be available; provide a degraded path or return a structured error.

#### Docker
- Multi-stage build uses Node 22-alpine:
  1) `build` stage installs pnpm and runs `pnpm install` + `npm run build`.
  2) `production` stage copies `.next`, `node_modules`, `package.json`, and `public` then runs `npm start` on port 3000.
- If you add native deps (e.g., `sharp`), keep them compatible with Alpine (musl) or swap base image accordingly.

#### TypeScript and module resolution
- `tsconfig.json` uses `module: esnext` and `moduleResolution: bundler`. Prefer ESM-style imports and avoid CommonJS-only libraries where possible.
- Path alias: `@/* -> ./*`. Keep imports consistent with this alias.

---
### 2) Testing

This repo does not currently ship a full test harness (e.g., Jest/Vitest). Given the stack, the following approach is recommended:

- Unit/integration (Node + TS): Vitest + Testing Library for React components.
- E2E (browser): Playwright, or Cypress. For PDF/export workflows that rely on Chromium, Playwright is generally more robust in CI.

Until a full harness is added, lightweight smoke tests can validate critical configuration invariants. Example below is a self-contained Node script we executed to verify this repo’s current state.

#### Example: Config smoke test (demonstration)
Commands we successfully ran locally:

```
# Create and run a one-off smoke test (already executed during guideline authoring)
node scripts/config.smoke.test.cjs
# Expected output:
# Config smoke test passed
```

What it verifies:
- `package.json` scripts (`dev`) and `packageManager` set to pnpm.
- `next.config.js` contains the `next-intl` plugin, `serverExternalPackages` entries for `@sparticuz/chromium` and `puppeteer-core`, and the `.map` ignore-loader rule.
- `i18n/request.ts` exists.
- Tailwind config exists.

Note: The smoke test was temporary and removed after execution, per request. Keep this pattern for future quick validations without adding a full test stack.

#### Adding a proper test harness (recommended)
- Install Vitest and React Testing Library:
  - `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/jest`
- Add a `vitest.config.ts` with `test.environment = "jsdom"` and alias `@` to project root.
- Example script additions in `package.json`:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
- For server-side utilities (e.g., invoice export), use `test.environment = "node"` or per-file overrides.

---
### 3) Additional Development Notes

- Code Style:
  - Follow TypeScript strictness already enabled. Prefer typed APIs (`zod` schemas exist; reuse them for validation and inference where possible).
  - UI uses shadcn/ui; leverage `cn` from `@/lib/utils` for class composition.
  - Keep form logic within `react-hook-form`; co-locate schema, default values, and form field components in their current structure.

- Internationalization:
  - New routes should be nested under `app/[locale]`. Ensure `generateStaticParams`/`middleware.ts` align with supported locales in `i18n` if you modify locales.

- Invoices Export/Printing:
  - When modifying `services/invoice/server/exportInvoiceService.ts`, avoid bringing large libs into client bundles; keep exports server-only and behind API routes where applicable.
  - CSV/XLSX/XML exports use `@json2csv/node`, `xlsx`, and `xml2js`. Normalize invoice data into a flat structure before export to keep schemas stable across formats.

- Performance/Bundle:
  - Bundle analyzer is available via `ANALYZE=true pnpm build` (uses `@next/bundle-analyzer`). Use it before introducing heavy client-side dependencies.

- Environment variables:
  - Email sending (PDF to email) requires `NODEMAILER_EMAIL` and `NODEMAILER_PW` in `.env.local` (see README). Do not expose in client code; access only in server modules or route handlers.

- Linting:
  - Project uses `next lint`. If adopting a broader ESLint setup, ensure it stays compatible with Next’s core rules and TS config.

- CI hints:
  - Cache Puppeteer downloads to `.cache/puppeteer` (already configured) to speed up jobs.
  - Prefer `pnpm i --frozen-lockfile` for reproducible installs.

---
### Quick Start (TL;DR for contributors)
- Install: `pnpm i`
- Dev: `pnpm dev` → http://localhost:3000
- Build: `pnpm build` | Start: `pnpm start`
- Analyze bundle: `ANALYZE=true pnpm build`
- Add tests: prefer Vitest + RTL; for quick checks, use disposable Node smoke tests similar to the example above.
