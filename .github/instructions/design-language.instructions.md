---
applyTo: "**/*.tsx,**/*.css,**/*.ts"
---

# Design Language

This document defines the visual design system for this project. All AI-generated UI code must follow these rules exactly.

---

## Typography

- **Font**: `Vazirmatn` — Persian-optimized, defined via `--font-display` CSS variable.
- **Direction**: All UI is **RTL** (`dir="rtl"`). Never produce LTR-only layouts.
- Use `font-display` Tailwind utility for headings/display text.

---

## Color System

**Color space**: `oklch()` — always use this for custom values. Never use hex or RGB for new design tokens.

**Rule**: Never hardcode colors. Always reference semantic CSS variable tokens via Tailwind utilities.

### Semantic Tokens

| Token                           | Tailwind Class                          | Usage                                        |
| ------------------------------- | --------------------------------------- | -------------------------------------------- |
| `--primary`                     | `bg-primary`, `text-primary`            | Main CTAs, active nav                        |
| `--secondary`                   | `bg-secondary`, `text-secondary`        | Supporting elements                          |
| `--muted`                       | `bg-muted`                              | Subtle backgrounds, disabled areas           |
| `--muted-foreground`            | `text-muted-foreground`                 | Captions, placeholders, disabled text        |
| `--accent`                      | `bg-accent`, `text-accent-foreground`   | Hover states, highlights                     |
| `--success`                     | `bg-success`, `text-success`            | Paid, confirmed, active states               |
| `--destructive`                 | `bg-destructive`, `text-destructive`    | Errors, delete actions, overdue              |
| `--warning`                     | `bg-warning`, `text-warning`            | Pending, needs attention                     |
| `--border`                      | `border-border`                         | Dividers, card/input borders                 |
| `--input`                       | `border-input`                          | Input field borders                          |
| `--ring`                        | `ring-ring`                             | Focus rings                                  |
| `--card`                        | `bg-card`, `text-card-foreground`       | Card surfaces                                |
| `--popover`                     | `bg-popover`, `text-popover-foreground` | Dropdowns, tooltips                          |
| `--background`                  | `bg-background`                         | Page base (`#ebf4f6` light, dark near-black) |
| `--navbar-bg` / `--navbar-text` | `bg-navbar-bg`, `text-navbar-text`      | Top nav bar                                  |

### Domain-Specific Tokens

| Token                                              | Tailwind Class                   | Usage                                  |
| -------------------------------------------------- | -------------------------------- | -------------------------------------- |
| `--loan-paid`                                      | `bg-loan-paid`, `text-loan-paid` | Paid installments (green)              |
| `--loan-overdue`                                   | `bg-loan-overdue`                | Overdue installments (red)             |
| `--loan-overdue-foreground`                        | `text-loan-overdue-foreground`   | Text on overdue backgrounds            |
| `--loan-future`                                    | `bg-loan-future`                 | Upcoming installments (muted)          |
| `--allocation-account` / `--allocation-account-bg` | —                                | Account allocation card accents (blue) |
| `--allocation-loan` / `--allocation-loan-bg`       | —                                | Loan allocation card accents (green)   |
| `--allocation-fee` / `--allocation-fee-bg`         | —                                | Fee allocation card accents (purple)   |

### State Color Conventions

| State                     | Token              | Example                               |
| ------------------------- | ------------------ | ------------------------------------- |
| Active / Paid / Success   | `success`          | Paid loans, active accounts           |
| Error / Overdue / Delete  | `destructive`      | Failed payments, overdue installments |
| Disabled / Secondary info | `muted-foreground` | Placeholder text, inactive items      |
| Pending / Warning         | `warning`          | Pending transactions                  |
| Neutral info              | `muted`            | Background chips, badges              |

---

## Border Radius

Use the scale — **never arbitrary radius values**.

| Utility      | Variable      | Size              |
| ------------ | ------------- | ----------------- |
| `rounded-sm` | `--radius-sm` | base − 4px        |
| `rounded-md` | `--radius-md` | base − 2px        |
| `rounded-lg` | `--radius-lg` | `0.625rem` (base) |
| `rounded-xl` | `--radius-xl` | base + 4px        |

---

## Numbers & Dates

### Numbers — always Persian digits

**Never render raw JS numbers directly.** Always use the `<FormattedNumber>` component from `@/components/formatted-number`:

```tsx
import { FormattedNumber } from "@/components/formatted-number";

// Regular number
<FormattedNumber value={count} />

// Price / currency (Toman)
<FormattedNumber value={amount} type="price" />
```

- Works for both plain integers and monetary values.
- Automatically converts to Persian digits and applies thousands separators.
- Do **not** use `toLocaleString`, `Intl.NumberFormat`, or raw `{number}` in JSX.

### Dates — always Persian calendar (Jalali)

**Never render Gregorian dates.** Always use the `<FormattedDate>` component from `@/components/formatted-date`:

```tsx
import { FormattedDate } from "@/components/formatted-date";

<FormattedDate date={isoDateString} />;
```

- Converts all dates to the Jalali (Shamsi) calendar with Persian digits.
- Do **not** use `new Date().toLocaleDateString()`, `format()` from date-fns, or raw date strings.

---

## Shadows

**Default: no shadows.** Do not add any shadow utilities (`shadow-*`, `drop-shadow-*`) unless the design explicitly calls for depth/elevation.

- If a shadow is explicitly requested: use `shadow-nice` for soft card elevation, or `shadow-sm` / `shadow-md` from the preset-aware scale.
- Never use arbitrary `shadow-[...]` values.

---

## Spacing & Layout

- **Mobile-first**: Design for small screens first, expand with `md:` / `lg:` breakpoints.
- **Page background**: `bg-background` + `bg-page-background` (gradient overlay via `--page-background`).
- **Cards**: `bg-card` with `rounded-lg`. No shadow by default.
- **Sidebar width**: Controlled by CSS variable `--sidebar-width` — do not hardcode.
- **Balance layouts**: Always distribute content across the full width. Never cluster everything to one side and leave dead space on the other. Use grid/flex layouts that fill space intentionally — labels left, values right; stats evenly distributed; actions at natural focal points.

---

## UI Complexity by Context

### User Dashboard — Minimal & Friendly

- Clean, low-density layouts — don't overwhelm regular users.
- Large touch targets, clear labels, generous whitespace.
- Prefer `Card` + simple stat displays over dense data tables.
- Single primary action per screen, clearly visible.
- Avoid jargon; use plain Persian language.
- Minimal visible chrome — borders only where structurally necessary.

### Admin Dashboard — Professional & Information-Dense

- Can use more complex layouts: multi-column, data tables, filter bars, tabs.
- Still must look intentional and polished — as if a senior UI/UX designer built it.
- Use `DataTable` with sorting/filtering for any list of entities.
- Group actions logically in toolbars or command areas.
- Secondary information goes in collapsible sections or tabs, not all on screen at once.

---

## UI Component Usage

**Always use Shadcn UI components** rather than writing raw JSX equivalents. Never hand-roll buttons, inputs, selects, dialogs, badges, or tables when a Shadcn component exists.

```tsx
// ✅ Use Shadcn
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ❌ Don't write raw equivalents
<button className="px-4 py-2 bg-primary text-white rounded">کلیک</button>
<div className="border rounded p-2">...</div>
```

Available Shadcn components live in `src/components/ui/`. Check that directory before writing any primitive UI.

---

## Component Patterns

### 1. Variant Styling — `data-*` attributes, NOT conditional classes

```tsx
// ✅ Correct
<div data-size="sm" className="h-8 data-[size=lg]:h-12 data-[size=sm]:h-8" />
<header data-navbar-style={style} className="data-[navbar-style=sticky]:sticky" />

// ❌ Wrong
<div className={size === 'sm' ? 'h-8' : 'h-12'} />
```

### 2. Class Merging — always use `cn()`

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", isActive && "bg-accent", className)} />;
```

### 3. Shadcn Component Slot Pattern

```tsx
<Component data-slot="component-name" />
```

### 4. Icon Usage

- Domain icons: `@/components/icons/index`
- Brand/social icons: `<SimpleIcon>` component (`simple-icons` package)
- Financial: `<TomanIcon>` from `@/icons/toman`

### 5. Radix UI

Import from the unified `radix-ui` package — **not** individual `@radix-ui/*` packages:

```tsx
// ✅
import * as Dialog from "radix-ui/react-dialog";

// ❌
import * as Dialog from "@radix-ui/react-dialog";
```

### 6. Scroll Lock Fix

Radix portaled components (Select, Dialog, etc.) may lock body scroll. Override in CSS if needed:

```css
body[data-scroll-locked] {
  overflow: visible !important;
  padding-right: 0 !important;
}
```

---

## Empty States

When a list, table, or section has no data, always use `<EmptyStateCard>` from `@/components/empty-state-card`. Never render `null`, an empty `<div>`, or a plain text message.

```tsx
import { EmptyStateCard } from "@/components/empty-state-card";

<EmptyStateCard
  title="موردی یافت نشد"
  description="هیچ داده‌ای برای نمایش وجود ندارد."
  icon={<SomeIcon className="text-muted-foreground" />}
/>
```

- Always provide a `title`. `description` and `icon` are optional but strongly encouraged.
- Default `dir` is `"rtl"` — only override for special cases.

---

## Loading States

Use `<Skeleton>` from `@/components/ui/skeleton` for content that is loading. Never use a spinner for page-level or list-level loading — skeletons are preferred because they preserve layout.

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Card skeleton
<div className="flex flex-col gap-3 p-4">
  <Skeleton className="h-5 w-1/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-2/3" />
</div>
```

- Match the skeleton shape to the real content layout (same number of rows, similar widths).
- Use `<Spinner>` from `@/components/ui/spinner` only for inline/button-level loading (e.g., a submit button in-flight).

---

## Forms

- Always wrap forms with `<Form>` from `@/components/ui/form.tsx` (React Hook Form integration).
- Validate with **Zod** schemas — never validate manually with if-statements.
- Field layout: **label above the input**, error message directly below the field.
- Use `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` for every field.

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

<FormField
  control={form.control}
  name="amount"
  render={({ field }) => (
    <FormItem>
      <FormLabel>مبلغ</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

- Use `<PhoneInput>` from `@/components/ui/phone-input` for phone number fields.
- Use `<CalendarHijri>` from `@/components/ui/calendar-hijri` for date picker fields.
- Never use `<input>`, `<textarea>`, or `<select>` directly — always Shadcn equivalents.

---

## Toasts / Feedback

Use the Sonner toaster (already configured in the app). Call `toast.success()`, `toast.error()`, or `toast.warning()`.

- **Toast**: for transient outcomes (saved, deleted, failed request).
- **Inline error**: for form validation errors — handled by `<FormMessage>` automatically.
- **Alert / Dialog**: for important warnings before a destructive action.

Keep toast messages short, Persian, and non-alarming. Use a calm tone — avoid words like "خطای جدی" for routine errors.

```tsx
import { toast } from "sonner";

toast.success("عملیات با موفقیت انجام شد");
toast.error("مشکلی پیش آمد. دوباره تلاش کنید.");
```

---

## Destructive Actions

**Always confirm before delete or irreversible operations.** Use `<AlertDialog>` from `@/components/ui/alert-dialog.tsx`:

```tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">حذف</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
      <AlertDialogDescription>این عمل قابل بازگشت نیست.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>انصراف</AlertDialogCancel>
      <AlertDialogAction>حذف</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Never delete on a single button click without confirmation.

---

## Pagination

All paginated lists must use `<PaginationControls>` from `@/components/pagination-controls`. Never build custom next/prev buttons.

```tsx
import { PaginationControls } from "@/components/pagination-controls";

<PaginationControls
  meta={data.meta}
  page={page}
  pageSize={pageSize}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

- Pass `meta` from the API response (`PageMetaDto`) — it drives all page state.
- `showPageSizeSelector` defaults to `true`; set to `false` for compact contexts.

---

## Filters & Search

All filterable entity lists must use the filter system from `@/components/filters`. Never build custom dropdown/search filter UIs.

```tsx
import { AdvancedFilter, ActiveFilters } from "@/components/filters";
```

- `<AdvancedFilter>` — main filter trigger + dropdown (desktop: dialog, mobile: drawer automatically).
- `<ActiveFilters>` — renders active filter chips below the toolbar with remove buttons.
- `<ComboboxFilter>` — for single-field dropdown filters inline in a toolbar.

---

## Animation

Use **Motion** (`motion/react`) for all animations. Do not use CSS keyframes, `tw-animate-css` classes, or raw `transition` utilities for enter/exit animations.

```tsx
import { motion, AnimatePresence } from "motion/react";
```

### Allowed patterns

```tsx
// Fade + slide in (page sections, cards)
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
/>

// List items with stagger
<motion.ul variants={{ visible: { transition: { staggerChildren: 0.07 } } }} initial="hidden" animate="visible">
  <motion.li variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} />
</motion.ul>

// Layout transitions (reordering, expand/collapse)
<motion.div layout transition={{ layout: { duration: 0.28, ease: "easeInOut" } }} />

// Conditional mount/unmount
<AnimatePresence>
  {isVisible && (
    <motion.div key="item" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```

### Rules

- Keep durations short: **0.2–0.35s**. Longer animations feel sluggish in a data dashboard.
- Use `ease: "easeOut"` for entering elements, `ease: "easeIn"` for exits.
- No bounce (`type: "spring"` with high `stiffness`) in the admin dashboard — only in the user dashboard for delight moments.
- No rotation, scale-pop, or decorative effects unless explicitly asked.
- Use `AnimatePresence` whenever an element is conditionally rendered so exit animations fire.

---

## Typography Scale

Never use arbitrary font sizes. Use only these Tailwind utilities:

| Usage | Class |
|---|---|
| Page title / H1 | `text-2xl font-bold` |
| Section heading / H2 | `text-xl font-semibold` |
| Card title / H3 | `text-base font-semibold` |
| Body text | `text-sm` |
| Secondary / caption | `text-xs text-muted-foreground` |
| Stat / metric (large) | `text-3xl font-bold` |

---

## Status Badges

Use `<Badge>` from `@/components/ui/badge` for all entity status indicators. Map business states to variants consistently:

| Status | Badge variant / classes |
|---|---|
| فعال / پرداخت شده / تایید شده | `variant="outline"` + `text-success border-success` |
| غیرفعال / لغو شده | `variant="outline"` + `text-muted-foreground` |
| معوق / خطا / رد شده | `variant="outline"` + `text-destructive border-destructive` |
| در انتظار / در حال بررسی | `variant="outline"` + `text-warning border-warning` |

Never use colored `<div>` or `<span>` as status chips — always `<Badge>`.

---

## Accessibility

- Icon-only buttons **must** have `aria-label` in Persian.
- All images must have a meaningful `alt` attribute in Persian (or `alt=""` if purely decorative).
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<header>`) — don't `<div>` everything.
- Interactive elements must be reachable by keyboard — Shadcn components handle this by default; don't remove or suppress focus styles.

---

## Responsive Breakpoints

| Breakpoint | Context |
|---|---|
| default (< `sm`) | Mobile — single column, stacked layout |
| `sm` (640px+) | Large mobile / small tablet |
| `md` (768px+) | Tablet — two columns, side-by-side possible |
| `lg` (1024px+) | Desktop — full layout, sidebar visible |
| `xl` (1280px+) | Wide desktop — admin dashboards expand further |

Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` patterns. Never hardcode `width` or `height` values for containers.

---

## File Placement

- **Feature-specific components**: create in the route's `_components/` folder (colocated).
- **Shared across multiple routes**: create in `src/components/`.
- **Shared UI primitives**: `src/components/ui/` — only Shadcn components live here; do not add custom components to this folder.
- **Page file**: always `page.tsx` at the route root — keep it thin, delegate to `_components/`.

---

## What NOT To Do

| ❌ Don't                                      | ✅ Do instead                                     |
| --------------------------------------------- | ------------------------------------------------- |
| `{amount}` or `{count}` in JSX                | `<FormattedNumber value={amount} />`              |
| Raw date strings or `toLocaleDateString()`    | `<FormattedDate date={date} />`                   |
| Adding `shadow-*` by default                  | Only add shadows when explicitly requested        |
| Writing raw `<button>`, `<input>`, `<select>` | Use Shadcn `<Button>`, `<Input>`, `<Select>`      |
| Clustering all content to one side            | Balance layout — use grid/flex to fill space      |
| `text-[#2b5987]`                              | `text-navbar-bg`                                  |
| `bg-[oklch(0.55 0.18 145)]`                   | `bg-loan-paid`                                    |
| `className={x ? 'a' : 'b'}`                   | `data-x={x}` + `data-[x=true]:class`              |
| `import from "@radix-ui/react-*"`             | `import from "radix-ui"`                          |
| TypeScript `any`                              | Proper typed interfaces/types                     |
| Hardcoded Persian strings in logic            | Keep text in JSX layer only                       |
| Arbitrary `rounded-[10px]`                    | Use `rounded-lg` / `rounded-xl` from scale        |
| Arbitrary `shadow-[...]`                      | Use `shadow-nice` or `shadow-sm` only when needed |
