# Studio Admin - AI Coding Agent Instructions

## Communication Style

- **Be concise**: Provide brief, actionable answers. Avoid unnecessary explanations.
- **Ask before acting**: If information is missing or unclear, ask follow-up questions before implementing.
- **Think like a senior frontend engineer**: Prioritize clean code, maintainability, and best practices.
- **Keep solutions simple**: Favor straightforward approaches over complex ones.
- **Type safety**: Never use `any` types - always provide proper TypeScript types.

- **Language**: Always respond in English.

## Project Context

- **RTL Support**: This is a Persian (Farsi) RTL application. All UI elements must support right-to-left layout.
- **Language**: Primary language is Persian. Use Persian text for labels, messages, and content.
- **Mobile-First**: All components and layouts must be fully responsive and mobile-friendly.

## Architecture Overview

This is a **Next.js 16 App Router** admin dashboard with a **colocation-based architecture**. Each feature route contains its own components, logic, and data in `_components/` subdirectories. Shared UI lives in `src/components/ui/` (Shadcn), while app-wide utilities are in `src/lib/`.

### Key Directories

- `src/app/(main)/dashboard/` - Dashboard routes (CRM, Finance, Default)
- `src/app/(main)/auth/` - Authentication screens
- `src/components/ui/` - Shadcn UI components (DO NOT edit manually unless fixing bugs)
- `src/stores/` - Zustand stores with vanilla store pattern
- `src/server/` - Server actions (must have `"use server"` directive)

## Critical Patterns

### 1. Data Attributes for Styling

Components use `data-*` attributes for conditional styling instead of prop-based classes:

```tsx
// ✅ Correct - use data attributes
<div data-size="sm" className="data-[size=sm]:h-8" />
<header data-navbar-style={style} className="data-[navbar-style=sticky]:sticky" />

// ❌ Avoid - don't use prop-driven className logic
<div className={size === 'sm' ? 'h-8' : 'h-9'} />
```

### 2. Server/Client Boundary

- Server actions in `src/server/server-actions.ts` must use `"use server"` directive
- Layouts use server components to fetch preferences from cookies via `getPreference()`
- Client components (with `"use client"`) handle theme/layout updates via Zustand stores and utility functions:
  - `updateThemeMode()`, `updateThemePreset()` from `src/lib/theme-utils.ts`
  - `updateContentLayout()`, `updateNavbarStyle()` from `src/lib/layout-utils.ts`

### 3. Theme & Layout System

User preferences persist via cookies and are managed by:

- **Server**: `getPreference()` reads cookies in layouts (e.g., `sidebar_variant`, `navbar_style`)
- **Client**: Zustand store (`preferences-store.ts`) + utility functions update DOM attributes
- Theme presets are CSS files in `src/styles/presets/` applied via `data-theme-preset` attribute
- Generate new presets with: `pnpm run generate:presets`

### 4. Component Colocation

Feature-specific components stay in route `_components/` folders:

```
src/app/(main)/dashboard/
├── default/
│   ├── page.tsx
│   └── _components/
│       ├── chart-area-interactive.tsx
│       └── data-table.tsx
├── crm/
│   ├── page.tsx
│   └── _components/
│       └── insight-cards.tsx
```

### 5. Shadcn UI Component Pattern

All UI components use `data-slot` for scoped styling and the `cn()` utility for class merging:

```tsx
import { cn } from "@/lib/utils";

function Button({ className, size = "default", ...props }) {
  return (
    <button
      data-slot="button"
      data-size={size}
      className={cn("base-classes", "data-[size=sm]:h-8", className)}
      {...props}
    />
  );
}
```

### 6. Scroll Lock Prevention

Radix UI components (Select, Dialog) may lock body scroll. Override with:

```css
body[data-scroll-locked] {
  overflow: visible !important;
  padding-right: 0 !important;
}
```

This pattern is in `globals.css` - apply to other portaled components if needed.

## Development Workflow

### Commands

- `pnpm dev` - Start dev server (port 3000)
- `pnpm build` - Production build
- `pnpm lint` - ESLint check
- `pnpm format` - Prettier format
- `pnpm generate:presets` - Generate theme preset types

### Adding New Features

1. Create route in `src/app/(main)/dashboard/[feature]/`
2. Add page component in `page.tsx`
3. Add feature components in `_components/` subdirectory
4. Use existing UI components from `src/components/ui/`
5. For new shared components, add to `src/components/`

### TypeScript Conventions

- Use `readonly` for props that shouldn't be modified
- Prefer `type` over `interface` for component props
- Use `as const` for constant arrays to get literal types (see `src/types/preferences/`)
- Extract types with `(typeof ARRAY)[number]` pattern

### Styling Guidelines

- Tailwind v4 with CSS variables for theming
- Use `cn()` utility for conditional classes
- Prefer data attributes over props for variant styling
- Never use arbitrary `[color:value]` - use CSS variables from theme
- Use `oklch()` color space for theme colors

## Integration Points

### State Management

- **Zustand** with vanilla stores (see `src/stores/preferences/`)
- Provider pattern: `preferences-provider.tsx` wraps store for React context
- Server state syncs via cookies, client state via store

### Forms & Validation

- React Hook Form + Zod (pattern used in auth forms)
- Use `<Form>` component from `src/components/ui/form.tsx`

### Data Tables

- TanStack Table (see `src/components/data-table/`)
- Drag-and-drop via `@dnd-kit` for column reordering

### Icons

- Primary: `lucide-react`
- Social: `simple-icons` (via `<SimpleIcon>` component)

## Common Gotchas

1. **Radix UI Imports**: Use `radix-ui` package, not individual `@radix-ui/*` packages
2. **Tailwind Classes**: Some classes use parentheses for CSS variables: `h-(--variable-name)`
3. **Route Groups**: `(main)` and `(external)` are route groups - don't create URLs
4. **ESLint**: Pre-commit hooks auto-fix linting - commits fail on errors
5. **React 19**: This project uses React 19.2 - some older patterns may not apply

## Testing & Quality

- ESLint with security, sonarjs, and unicorn plugins enabled
- Prettier with Tailwind plugin for class sorting
- Husky pre-commit hooks enforce linting/formatting
- TypeScript strict mode enabled
