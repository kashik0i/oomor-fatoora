### Goal
Turn the existing invoice tool into a multi-tenant, subscription-based micro‑SaaS with secure authentication, billing, persistence, export workflows, and operations suitable for production.

### Assumptions and context
- Stack: Next.js (App Router), TypeScript, Tailwind, shadcn/ui, `next-intl`, Puppeteer-core + `@sparticuz/chromium`, CSV/XLSX/XML libs, pnpm. Relevant files include `app/[locale]/auth/page.tsx`, `services/invoice/server/exportInvoiceService.ts`, `lib/firebase.ts`.
- Current capabilities: Invoice UI and export service (JSON/CSV/XML; XLSX scaffold commented), auth scaffolding (LoginForm + Firebase), i18n, email via `nodemailer`.
- Today’s date: 2025-11-09.

---

### Phase 0 — Product/market decisions (1–2 days)
- Define target segment and value prop:
  - Solo freelancers and small agencies generating invoices quickly; optional compliance (e.g., Gulf/Saudi FATOORA) if relevant.
- Pricing and packaging:
  - Free: limited invoices/month, watermark on PDFs, no branding removal.
  - Pro: unlimited invoices, custom branding, multiple templates, exports (CSV/XLSX/XML), email sends, signatures, saved clients.
  - Team: multi-user workspace, roles, API access, higher limits.
- Compliance scope:
  - If targeting KSA: outline ZATCA Phase 2 requirements and roadmap, otherwise keep generic VAT/tax.
- Success metrics: activation rate, invoice creation to export conversion, churn, MRR.

### Phase 1 — Architecture and tenancy foundation (1–2 weeks)
- Authentication and identity
  - Decide identity stack: stay on Firebase Auth (already present in `lib/firebase.ts`) or switch to a server-hosted provider (e.g., Auth.js) for tighter server control.
  - If staying on Firebase: implement server session verification in App Router (middleware + server actions) to protect routes under `app/[locale]/…` and API routes. Store a server-side session snapshot or verify ID tokens per request.
- Multi-tenant model
  - Data model definitions:
    - `User`: id, email, name, locale, createdAt.
    - `Workspace`: id, name, ownerId, plan, featureFlags, createdAt.
    - `Membership`: id, userId, workspaceId, role (owner|admin|member).
    - `Invoice`: id, workspaceId, status, number, dates, items, totals, tax, customer, metadata.
    - `Template`: id, workspaceId, name, schema, theme.
    - `ExportJob`: id, workspaceId, invoiceId, type (pdf|csv|xlsx|xml), status, resultUrl/error.
  - Persistence:
    - Option A (relational recommended): Supabase Postgres with RLS; use Drizzle ORM or Prisma. Strong fit for billing & reporting.
    - Option B: Firestore (if staying in Firebase ecosystem). Enforce multi-tenant access via security rules.
  - Storage for assets (logos/signatures): Supabase Storage or Firebase Storage.
- Routing and access control
  - Introduce workspace-aware routes: `app/[locale]/[workspaceId]/…` and switch navigation after login.
  - Add middleware to enforce auth + selected workspace; provide workspace switcher.
- Internationalization
  - Keep `next-intl`; ensure all new routes are locale-scoped. Add message catalogs for onboarding, billing, and settings.

### Phase 2 — Billing, metering, and entitlements (1–2 weeks)
- Stripe Billing integration
  - Plans and prices (Free/Pro/Team) in Stripe dashboard.
  - Implement Checkout + Customer Portal routes under `app/api/billing/…` with webhooks to sync subscription status.
  - Map Stripe customer → workspace; store `stripeCustomerId`, `subscriptionId`, `plan`, `renewalPeriod`.
- Entitlements service
  - Derive feature access from subscription state (local cache in DB; refreshed via webhooks). Implement a tiny helper: `canUseFeature(workspaceId, feature)`.
- Usage metering and limits
  - Track counts: invoices created, exports generated, email sends. Persist daily/monthly aggregates per workspace.
  - Rate limiting for API/export operations (Upstash Redis or DB-backed counters).

### Phase 3 — Export and document generation hardening (1–2 weeks)
- PDF generation pipeline
  - Implement PDF export using `puppeteer-core` + `@sparticuz/chromium` (server-side only). Adhere to `serverExternalPackages` in `next.config.js`.
  - Guard for environments lacking Chromium; return structured errors or fall back to queued processing.
- Finalize CSV/XLSX/XML
  - Finish XLSX path in `services/invoice/server/exportInvoiceService.ts` (ensure buffer streaming + correct content type).
  - Normalize invoice data before export for schema stability across formats.
- Email delivery
  - Start with `nodemailer` credentials as per README. For production reliability, integrate Postmark/Resend and send from verified domain (SPF/DKIM).
  - Add “Send invoice” action with email templates (`react-email`). Track delivery and opens if provider supports it.
- Templates and branding
  - Template editor improvements: header/footer, logo, brand colors. Support saved customers and default tax rates.

### Phase 4 — Application settings and UX polish (1 week)
- Onboarding flow after signup: create default workspace, invite link, sample invoice and template.
- Settings screens: Profile, Workspace, Billing, Team, API keys (for Team plan), Email branding.
- Accessibility pass and responsive QA.
- i18n: ensure pluralization, currency formatting, and date locales are correct per `locale` segment.

### Phase 5 — Public API (optional for Team plan) (1 week)
- Endpoints under `app/api/v1/…` to create/list invoices and trigger exports.
- API keys per workspace with hashed storage; scopes and rate limits.
- Minimal OpenAPI spec and developer docs.

### Phase 6 — Quality, security, and operations (1–2 weeks)
- Testing
  - Add Vitest + React Testing Library; component/unit tests for forms and helpers.
  - Playwright for E2E flows: signup → create invoice → export → email.
  - Add quick Node smoke tests for config invariants (as in guidelines).
- Observability and error handling
  - Integrate Sentry or similar; meaningful error boundaries and server logging.
  - Structured logs for export jobs and billing webhooks.
- Security
  - Enforce tenant isolation (RLS in Postgres or Firestore rules). Validate IDs server-side; avoid trusting client.
  - Secrets management via `.env` on Vercel/host; no client exposure of server creds.
  - Implement CSRF protection on mutations if using cookies; with Firebase tokens, verify on server.
- Performance and costs
  - Analyze bundle (`ANALYZE=true pnpm build`). Avoid pulling server libraries into client bundles.
  - Cache Puppeteer in CI to `.cache/puppeteer` (already configured). Warm-up Chromium on cold start if needed.

### Phase 7 — Launch and growth (1–2 weeks)
- Deploy
  - Host on Vercel (Node 20–22, pnpm). Provision database (Supabase) or Firebase. Configure storage and email provider.
  - Set environment variables for Stripe, email, Firebase/Supabase.
- Domain and SEO
  - Setup custom domain, marketing site (could be `/` with a `landing` route and app under `/app`). Basic SEO and social cards.
- Legal & compliance
  - Terms of Service, Privacy Policy, cookie consent. If handling VAT invoices, document tax behavior.
- Analytics and feedback
  - Product analytics (Plausible/PostHog) and in-app NPS/feedback widget.
- Beta → GA
  - Private beta with a handful of users; iterate on feedback; then GA pricing activation.

---

### Concrete engineering backlog (high-level)
- Auth & Tenancy
  - Implement server auth verification for Firebase tokens (or swap to Auth.js).
  - Create `Workspace`, `Membership`, `Invoice`, `Template` schema and migrations (Drizzle/Prisma) or Firestore collections with rules.
  - Workspace switcher UI; protect `app/[locale]/[workspaceId]/…` routes via middleware.
- Billing
  - Stripe Checkout + webhooks; map customer to workspace; implement entitlements.
  - Billing UI: plan selection, portal, dunning states.
- Exports & Emails
  - Complete XLSX export; add PDF export with reliable server handling.
  - Email send with `react-email` templates and provider fallback.
- Limits & Metering
  - Counters per workspace, rate limiting for export endpoints.
- Settings & UX
  - Profile, Workspace, Billing, Team pages; templates management and branding.
- QA & Ops
  - Vitest + Playwright; Sentry; CI pipeline with pnpm and cache; bundle analysis.

### Data model sketch (if Postgres)
- Tables: `users`, `workspaces`, `memberships`, `invoices`, `invoice_items`, `templates`, `export_jobs`, `api_keys`, `usage_counters`.
- Keys: `memberships(userId, workspaceId)` unique; `invoices(workspaceId, number)` unique; RLS by `workspaceId`.

### Risks and mitigations
- Headless Chromium in serverless: use `@sparticuz/chromium`, queue heavy jobs, and provide structured fallbacks.
- Multi-tenant leakage: enforce RLS/Firestore rules; comprehensive tests.
- Billing webhooks reliability: idempotent handlers, retry logic, and logging.
- Email deliverability: verified domain, provider with good reputation, DKIM/SPF set up.

### 30/60/90-day timeline (suggested)
- Days 1–30: Phase 1–2 (Auth/Tenancy, Billing, basic entitlements) + foundation of Phase 3 (CSV/XLSX finalize).
- Days 31–60: Phase 3–4 (PDF/email hardening, settings, onboarding), begin Phase 6 (tests/observability).
- Days 61–90: Phase 5 (API if needed), complete Phase 6, Phase 7 (beta → GA), pricing live.

### Inputs needed to tailor the plan
- Preferred persistence: Supabase Postgres (recommended) or stay with Firebase/Firestore?
- Target geography and compliance (e.g., ZATCA FATOORA support now vs later)?
- Pricing strategy (seats vs usage caps) and initial limits (e.g., 5 invoices/month on Free)?
- Deployment target (Vercel assumed) and chosen email provider (stick with `nodemailer` creds vs Postmark/Resend)?

If you share these decisions, I’ll convert this into a prioritized backlog with estimates and acceptance criteria per task aligned to your stack and current codebase.