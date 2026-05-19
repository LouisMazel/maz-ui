# `@maz-ui/utils` — Dedicated documentation section

**Date:** 2026-05-19
**Status:** Design — pending implementation plan
**Scope:** Documentation only (no changes to the `@maz-ui/utils` package itself)

---

## Goal

Promote `@maz-ui/utils` from a flat "Utilities" section in the global VitePress sidebar to a **dedicated sub-documentation** with its own multi-path sidebar, landing page, and complete coverage of every exported helper.

The current state has two problems:
1. The ecosystem entry `@maz-ui/utils` in `apps/docs/.vitepress/configs/ecosystem.mts` is a broken placeholder (points to `/guide/themes`).
2. Only 21 out of ~32 exported helpers are listed in `utils.mts`, and many of the 21 existing pages are still stubs (`TO DO`). TypeScript helpers (`DeepKeyOf`, `DeepPartial`, etc.) have no documentation at all.

After this work, clicking `@maz-ui/utils` in the ecosystem menu lands on a dedicated overview page; all helpers have a real page; the sidebar visible under `/utils/*` is the package-specific one, categorized by topic.

## Non-goals

- No code changes to `packages/utils/` (exports, types, runtime).
- No new helpers added to the package.
- No restructuring of the global sidebar beyond removing the "Utilities" entry.
- No Algolia re-index step (it re-crawls automatically).
- No change to navigation for components/composables/directives/plugins.

---

## Architecture overview

### File moves

```
apps/docs/src/helpers/         →  apps/docs/src/utils/
  *.md (21 existing pages)         *.md (same filenames, kept kebab-case)
                                   index.md                   ← NEW landing page
                                   cookie.md                  ← NEW
                                   idle-timeout.md            ← NEW
                                   swipe-handler.md           ← NEW
                                   format-json.md             ← NEW
                                   get-error-message.md       ← NEW
                                   is-server.md               ← NEW
                                   textarea-autogrow.md       ← NEW
                                   truthy-filter.md           ← NEW
                                   upper-first.md             ← NEW
                                   user-visibility.md         ← NEW
                                   types/                     ← NEW subfolder
                                     deep-key-of.md
                                     deep-partial.md
                                     deep-required.md
                                     flatten-object-keys.md
                                     generic-instance-type.md
                                     infer-maybe-ref.md
```

Resulting URLs: `/utils/`, `/utils/sleep`, `/utils/format-currency`, `/utils/types/deep-key-of`, etc.

**Exclusions** (present in source but not exported via `packages/utils/src/helpers/index.ts`, therefore not part of the public API):
- `fetchLocaleIp.ts`
- `formatPhoneNumber.ts`
- `getBrowserLocale.ts`

These files are NOT documented.

### Sidebar configuration (multi-path)

`apps/docs/.vitepress/configs/sidebar.mts` switches from a flat array to a path-keyed object:

```ts
export const sidebar: DefaultTheme.Sidebar = {
  '/utils/': [utils],
  '/': [guide, components, plugins, composables, directives, ecosystem],
}
```

Under any `/utils/*` URL, VitePress shows the dedicated utils sidebar. Everywhere else, the global sidebar is shown — **without** the previous "Utilities" entry (the `utils` import is removed from the `'/'` array).

`apps/docs/.vitepress/configs/utils.mts` is rewritten from a flat alphabetical list into a categorized sidebar:

```
Utilities
  - Getting Started → /utils/
Strings
  - camelCase, capitalize, kebab-case, pascal-case, snake-case, upperFirst, normalizeString
Numbers & Currency
  - formatCurrency, formatNumber
Dates
  - formatDate
Timing
  - debounce, debounceCallback, debounceId, throttle, throttleId, sleep, idleTimeout
Browser & DOM
  - isClient, isServer, isStandaloneMode, scriptLoader, swipeHandler, TextareaAutogrow, userVisibility, cookie
Country & Flags
  - countryCodeToUnicodeFlag, getCountryFlagUrl
Validation & Comparison
  - isEqual, checkAvailability, truthyFilter
Formatting & Errors
  - formatJson, getErrorMessage
TypeScript Helpers
  - DeepKeyOf, DeepPartial, DeepRequired, FlattenObjectKeys, GenericInstanceType, InferMaybeRef
```

Each section uses `collapsed: true` on initial render.

### Navbar adjustments

`apps/docs/.vitepress/configs/navbar.mts`:
- The "Modules" dropdown currently embeds the full `utils` sidebar group. Replace it with a single link entry: `{ text: 'Utilities', link: '/utils/' }`.

`apps/docs/.vitepress/configs/ecosystem.mts`:
- Change the `@maz-ui/utils` entry's `link` from `/guide/themes` to `/utils/`.

---

## Landing page (`apps/docs/src/utils/index.md`)

Structure modeled on `apps/docs/src/ecosystem/eslint-config.md`:

1. **Frontmatter** — title `@maz-ui/utils`, description (one-liner about lightweight tree-shakeable utilities).
2. **Heading + intro** — what the package is, why it exists (extracted from the main lib, zero Vue dependency, works in Node/browser/SSR).
3. **Installation** — `pnpm add @maz-ui/utils`.
4. **Basic usage** — one minimal `import { sleep, formatCurrency } from '@maz-ui/utils'` example.
5. **What's inside** — dynamically generated catalogue (see below).
6. **Tree-shaking note** — named imports, no side effects, dead code is dropped.

### Dynamic catalogue component

A small Vue component lives in `apps/docs/.vitepress/theme/components/UtilsCatalogue.vue`. It imports the `utils` sidebar config (the same one that drives the sidebar) and renders a responsive grid of cards — one per category, listing the helpers as links.

The component is registered globally via `apps/docs/.vitepress/theme/index.ts` so the landing page can use `<UtilsCatalogue />` directly in markdown.

This avoids duplicating the catalogue between the sidebar and the landing page.

---

## Redirects from `/helpers/*` to `/utils/*`

The site is statically built (VitePress) and deployed to Hostinger via FTP (`apps/docs/ftp-deploy.mjs`). Hostinger uses Apache, so `.htaccess` rewrites are supported.

**Strategy:** generate a `public/.htaccess` file that VitePress copies to the build output, containing 301 redirects from `/helpers/<name>` to `/utils/<name>` for every util. Generated automatically from the same list that drives the sidebar — no hand-maintained mapping.

**Fallback in case `.htaccess` is unavailable or insufficient:** also keep stub `.md` files at the old path (`apps/docs/src/helpers/*.md`) containing a meta-refresh + `<link rel="canonical">` pointing to the new URL. Decision deferred to the implementation plan, but **`.htaccess` is the preferred primary mechanism** since it preserves the 301 status code (better for SEO than meta-refresh).

**Dev-server redirects:** add equivalent entries in `apps/docs/.vitepress/config.mts`'s existing `redirect-plugin` `configureServer` middleware so `pnpm dev` mirrors prod behaviour.

---

## Internal link updates

Existing markdown links pointing to `/helpers/*` inside `apps/docs/src/` must be rewritten to `/utils/*`:

- `apps/docs/src/guide/resolvers.md` lines 242–243: links to `../helpers/currency.md`, `../helpers/date.md`, `../helpers/sleep.md`, `../helpers/debounce.md`, `../helpers/throttle.md`, `../helpers/is-equal.md` → all moved to `../utils/`.

JavaScript `import` statements referencing `@maz-ui/utils/helpers/...` (e.g. in `getting-started.md`) are **not** URL links — they are real subpath imports from the package and stay unchanged.

A grep audit (`grep -rn "/helpers/" apps/docs/src/`) must come back clean of markdown-link occurrences before merge.

---

## Documentation content for every helper

### Page template

```markdown
---
title: <helperName>
description: <one-liner explaining the role>
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage
<minimal TypeScript example>

## API
<signature + parameters + return type, extracted from package types>

## Examples
<1–2 richer examples when relevant>

## Notes
<edge cases, options, warnings — optional>
```

All pages are in English.

### Source-of-truth for content

For each helper, the writer (i.e. Claude during implementation):
1. Reads the source in `packages/utils/src/helpers/<name>.ts` — extracts signature, JSDoc, options.
2. Reads `packages/utils/src/helpers/__tests__/<name>.test.ts` (when present) — extracts realistic usage patterns.
3. Writes the page in the template above.

### Pages to write or rewrite (full inventory)

**Stubs to flesh out (16):**
sleep, debounce, throttle, debounceCallback, debounceId, throttleId,
camelCase, pascalCase, snakeCase, kebabCase, normalizeString,
scriptLoader, isClient, isEqual, isStandaloneMode, checkAvailability

**Brand-new helper pages (10):**
cookie, idleTimeout, swipeHandler, formatJson, getErrorMessage,
isServer, TextareaAutogrow, truthyFilter, upperFirst, userVisibility

**Landing page (1):** `index.md`

**TypeScript helpers (6, new sub-section under `/utils/types/`):**
DeepKeyOf, DeepPartial, DeepRequired, FlattenObjectKeys,
GenericInstanceType, InferMaybeRef

### Special cases requiring richer documentation

- **`cookie`** — multi-export module (`getCookie`, `setCookie`, `removeCookie`, etc.). Page has one section per export rather than a single API block.
- **`idleTimeout`, `swipeHandler`, `userVisibility`, `TextareaAutogrow`, `scriptLoader`** — stateful classes/handlers, not pure functions. Documentation covers constructor options + public methods + lifecycle.
- **TypeScript helpers** — type-only utilities, no runtime example. Pages show the type signature, a typed usage snippet, and one realistic scenario.

---

## Validation

**During development:**
- `pnpm --filter docs dev` to verify visually: sidebar swaps correctly between `/utils/*` and other paths, landing page renders, redirects work in dev.
- Manual check: hit `/helpers/sleep`, `/helpers/format-currency` → 301 to `/utils/...`.
- Each new/rewritten page renders without markdown errors; interactive code blocks (like in `currency.md`) still compile.

**Before merge:**
- `pnpm --filter docs build` passes (vitepress build).
- `pnpm lint:all` passes.
- `pnpm typecheck:all` passes.
- `grep -rn "/helpers/" apps/docs/src/ --include="*.md"` returns only JS-import strings (no markdown links).
- The generated `dist/.htaccess` contains expected 301 rules.

---

## Risks & open questions

1. **Multi-path sidebar specificity** — VitePress picks the most specific path match. The pattern is documented; needs a one-shot manual verification on first dev run.
2. **`.htaccess` propagation through VitePress build** — VitePress copies files from `public/` verbatim to `dist/`. Verify Hostinger reads `.htaccess` at the deploy root.
3. **Algolia index lag** — old `/helpers/*` URLs may persist in search results for ~1 week post-deploy. The 301 redirects make this transparent for users; no action required.
4. **Sheer volume of pages to write (33)** — 16 stubs + 10 new helpers + 6 TS helpers + 1 landing. The implementation plan should batch the writing phase by category to enable incremental review.

---

## Implementation phasing (single PR, but ordered)

The implementation plan (to be produced by the next step) should sequence the work so that the site stays buildable after each step:

1. Sidebar config + file moves (rename `helpers/` → `utils/` in one go).
2. Multi-path sidebar wiring + navbar + ecosystem link update.
3. Landing page + dynamic catalogue component.
4. Redirects (`.htaccess` generator + dev-server middleware).
5. Internal link rewrites in `guide/resolvers.md` (and any others found).
6. Content writing for the 16 stubs (batched by category).
7. Content writing for the 11 new helpers + 6 TS helpers.
8. Final validation pass (build, lint, typecheck, grep audit).
