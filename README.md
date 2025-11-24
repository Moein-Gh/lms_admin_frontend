**Project**: Studio Admin (LMS Admin Frontend)

A Next.js 16 App Router admin dashboard for managing LMS data. The project uses a colocation-based architecture where each route keeps its components, logic, and styles together. The UI is built with Shadcn-style components, Tailwind CSS, and TypeScript.

**Key Points**

- **RTL / Persian**: Primary UX is Persian (Farsi) with right-to-left layout support.
- **Mobile-First**: Responsive and mobile-friendly layouts.
- **Colocated Features**: Feature routes keep their own `_components/` directories under `src/app`.

**Tech Stack**

- `Next.js 16` (App Router)
- `TypeScript` (strict)
- `Tailwind CSS` (v4)
- `Zustand` for client stores
- `Radix UI` + `Shadcn` component patterns

**Useful Scripts**

- `pnpm dev` — Start dev server (port 3000)
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm format` — Run Prettier
- `pnpm generate:presets` — Generate theme presets

**Important Conventions**

- Use `data-*` attributes for styling variants (avoid prop-driven class logic).
- Server actions must include `"use server"` and live in `src/server`.
- Preferences are persisted via cookies; use the provided `preferences` store and `layout-utils`/`theme-utils` helpers.

**Where to Look**

- App routes: `src/app/(main)/`
- Shared UI: `src/components/ui/`
- Stores: `src/stores/`
- Server actions: `src/server/server-actions.ts`

**Contributing**
Please follow existing TypeScript conventions, run `pnpm lint` and `pnpm format` before creating PRs. Tests and linters run in CI; keep changes focused and small.

**License**
See the `LICENSE` file in the repo root.
