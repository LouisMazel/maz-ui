# Changelog

## v5.0.0-beta.32 (2026-06-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.31...v5.0.0-beta.32)

No relevant changes since last release

## v5.0.0-beta.31 (2026-06-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.30...v5.0.0-beta.31)

No relevant changes since last release

## v5.0.0-beta.30 (2026-06-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.29...v5.0.0-beta.30)

No relevant changes since last release

## v5.0.0-beta.28 (2026-06-10)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.27...v5.0.0-beta.28)

### 📦 Build

- **deps:** Upgrade dependencies ([82851e195](https://github.com/LouisMazel/maz-ui/commit/82851e195))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.26 (2026-06-10)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.25...v5.0.0-beta.26)

No relevant changes since last release

## v5.0.0-beta.25 (2026-06-09)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.24...v5.0.0-beta.25)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- **maz-ui:** Add MazSidebar component system ([#1574](https://github.com/LouisMazel/maz-ui/pull/1574))
  - feat(maz-ui): add MazSidebar component with sub-components and composable
    Implements a fully accessible, composable sidebar system for dashboard,
    admin, and SaaS applications. State is shared via provide/inject from
    the root MazSidebar component.
    Components added:
  * MazSidebar: root container (push/overlay modes, offcanvas/icon/none collapsible)
  * MazSidebarHeader, MazSidebarContent, MazSidebarFooter: layout zones
  * MazSidebarGroup: grouping with optional label (sr-only in icon mode)
  * MazSidebarSeparator: visual HR divider
  * MazSidebarMenu / MazSidebarMenuItem: ul/li with ARIA roles
  * MazSidebarMenuButton: link/button with icon, label, badge, tooltip auto-show
  * MazSidebarMenuSub: collapsible sub-menu with ArrowRight/ArrowLeft keyboard support
  * MazSidebarTrigger: toggle button with aria-expanded and aria-controls
    Composable added:
  * useMazSidebar: typed inject for open state, toggle, setOpen, state
    Closes #1573
  - refactor(maz-ui): polish MazSidebar to align with project conventions
  * Rename `useMazSidebar` composable to `useSidebar` (kept Maz-prefixed types)
  * Drop all scoped CSS in favour of Tailwind utilities and add `m-reset-css` on every sub-component root so theming and tree-shaking work as expected
  * MazSidebarMenuButton: `icon` accepts `MazIconLike`, `badge` accepts `MazBadgeProps`, tooltip via `v-tooltip` directive
  * MazSidebarMenuSub: smooth grid-rows expand/collapse via `MazExpandAnimation`, accepts `MazIconLike` icon
  * MazSidebarTrigger: replace inline SVG with `MazIcon` + `MazBars3`
  * Overlay mode delegated to `MazBackdrop` (reuses scroll-lock, focus trap, escape, click-outside)
  * Fix offcanvas-collapsed border leak and the icon-centering jump during collapse via `min(calc((var(--maz-sidebar-icon-width)-1.25rem)/2), calc((100%-1.25rem)/2))` — icons stay centred regardless of any padding applied to `MazSidebarContent`
  * Split the monolithic spec into one file per component (11 specs, 121 tests)
  * Doc: replace inline `style` with Tailwind classes and document the new prop shapes
  * Wire MazSidebar components and `useSidebar` into the Nuxt module auto-imports

- **docs:** Ecosystem documentations ([#1582](https://github.com/LouisMazel/maz-ui/pull/1582))
- **maz-ui:** Global component default props via MazUi plugin & Nuxt module ([#1596](https://github.com/LouisMazel/maz-ui/pull/1596))
  - refactor(maz-ui): add shared MazRoundedSize type
  - feat(maz-ui): add useGlobalConfig composable for global component defaults
  - feat(maz-ui): accept global component defaults in MazUi plugin
  - feat(maz-ui): MazBtn support global default props (size, roundedSize)
  - feat(maz-ui): MazContainer & MazCard support global default props
  - feat(maz-ui): support global default props on display components
  - feat(maz-ui): support global default props on form components
  - feat(@maz-ui/nuxt): support global component defaults
  - docs: document global component defaults
  - perf(maz-ui): resolve global component defaults once at setup
  - chore(docs): wire docs app to MazUi plugin with global defaults
  - test(@maz-ui/nuxt): cover global defaults plugin registration
  - test(@maz-ui/mcp): account for the global-defaults guide

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea9](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea9))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- **maz-ui:** Add MazSidebar component system ([#1574](https://github.com/LouisMazel/maz-ui/pull/1574))
  - feat(maz-ui): add MazSidebar component with sub-components and composable
    Implements a fully accessible, composable sidebar system for dashboard,
    admin, and SaaS applications. State is shared via provide/inject from
    the root MazSidebar component.
    Components added:
  * MazSidebar: root container (push/overlay modes, offcanvas/icon/none collapsible)
  * MazSidebarHeader, MazSidebarContent, MazSidebarFooter: layout zones
  * MazSidebarGroup: grouping with optional label (sr-only in icon mode)
  * MazSidebarSeparator: visual HR divider
  * MazSidebarMenu / MazSidebarMenuItem: ul/li with ARIA roles
  * MazSidebarMenuButton: link/button with icon, label, badge, tooltip auto-show
  * MazSidebarMenuSub: collapsible sub-menu with ArrowRight/ArrowLeft keyboard support
  * MazSidebarTrigger: toggle button with aria-expanded and aria-controls
    Composable added:
  * useMazSidebar: typed inject for open state, toggle, setOpen, state
    Closes #1573
  - refactor(maz-ui): polish MazSidebar to align with project conventions
  * Rename `useMazSidebar` composable to `useSidebar` (kept Maz-prefixed types)
  * Drop all scoped CSS in favour of Tailwind utilities and add `m-reset-css` on every sub-component root so theming and tree-shaking work as expected
  * MazSidebarMenuButton: `icon` accepts `MazIconLike`, `badge` accepts `MazBadgeProps`, tooltip via `v-tooltip` directive
  * MazSidebarMenuSub: smooth grid-rows expand/collapse via `MazExpandAnimation`, accepts `MazIconLike` icon
  * MazSidebarTrigger: replace inline SVG with `MazIcon` + `MazBars3`
  * Overlay mode delegated to `MazBackdrop` (reuses scroll-lock, focus trap, escape, click-outside)
  * Fix offcanvas-collapsed border leak and the icon-centering jump during collapse via `min(calc((var(--maz-sidebar-icon-width)-1.25rem)/2), calc((100%-1.25rem)/2))` — icons stay centred regardless of any padding applied to `MazSidebarContent`
  * Split the monolithic spec into one file per component (11 specs, 121 tests)
  * Doc: replace inline `style` with Tailwind classes and document the new prop shapes
  * Wire MazSidebar components and `useSidebar` into the Nuxt module auto-imports

- **docs:** Ecosystem documentations ([#1582](https://github.com/LouisMazel/maz-ui/pull/1582))
- **maz-ui:** Global component default props via MazUi plugin & Nuxt module ([#1596](https://github.com/LouisMazel/maz-ui/pull/1596))
  - refactor(maz-ui): add shared MazRoundedSize type
  - feat(maz-ui): add useGlobalConfig composable for global component defaults
  - feat(maz-ui): accept global component defaults in MazUi plugin
  - feat(maz-ui): MazBtn support global default props (size, roundedSize)
  - feat(maz-ui): MazContainer & MazCard support global default props
  - feat(maz-ui): support global default props on display components
  - feat(maz-ui): support global default props on form components
  - feat(@maz-ui/nuxt): support global component defaults
  - docs: document global component defaults
  - perf(maz-ui): resolve global component defaults once at setup
  - chore(docs): wire docs app to MazUi plugin with global defaults
  - test(@maz-ui/nuxt): cover global defaults plugin registration
  - test(@maz-ui/mcp): account for the global-defaults guide

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([d63f00ae2](https://github.com/LouisMazel/maz-ui/commit/d63f00ae2))
- **maz-ui:** Inputs - auto-fill with SSR ([9da60f52b](https://github.com/LouisMazel/maz-ui/commit/9da60f52b))
- Add default condition to exports for CJS resolver fallback ([3d078772a](https://github.com/LouisMazel/maz-ui/commit/3d078772a))
- **maz-ui:** Inputs - auto-fill with SSR ([9d0795031](https://github.com/LouisMazel/maz-ui/commit/9d0795031))

### 📦 Build

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea9](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea9))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))
- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.24 (2026-06-05)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.23...v5.0.0-beta.24)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03c](https://github.com/LouisMazel/maz-ui/commit/61883c03c))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- **maz-ui:** Add MazSidebar component system ([#1574](https://github.com/LouisMazel/maz-ui/pull/1574))
  - feat(maz-ui): add MazSidebar component with sub-components and composable
    Implements a fully accessible, composable sidebar system for dashboard,
    admin, and SaaS applications. State is shared via provide/inject from
    the root MazSidebar component.
    Components added:
  * MazSidebar: root container (push/overlay modes, offcanvas/icon/none collapsible)
  * MazSidebarHeader, MazSidebarContent, MazSidebarFooter: layout zones
  * MazSidebarGroup: grouping with optional label (sr-only in icon mode)
  * MazSidebarSeparator: visual HR divider
  * MazSidebarMenu / MazSidebarMenuItem: ul/li with ARIA roles
  * MazSidebarMenuButton: link/button with icon, label, badge, tooltip auto-show
  * MazSidebarMenuSub: collapsible sub-menu with ArrowRight/ArrowLeft keyboard support
  * MazSidebarTrigger: toggle button with aria-expanded and aria-controls
    Composable added:
  * useMazSidebar: typed inject for open state, toggle, setOpen, state
    Closes #1573
  - refactor(maz-ui): polish MazSidebar to align with project conventions
  * Rename `useMazSidebar` composable to `useSidebar` (kept Maz-prefixed types)
  * Drop all scoped CSS in favour of Tailwind utilities and add `m-reset-css` on every sub-component root so theming and tree-shaking work as expected
  * MazSidebarMenuButton: `icon` accepts `MazIconLike`, `badge` accepts `MazBadgeProps`, tooltip via `v-tooltip` directive
  * MazSidebarMenuSub: smooth grid-rows expand/collapse via `MazExpandAnimation`, accepts `MazIconLike` icon
  * MazSidebarTrigger: replace inline SVG with `MazIcon` + `MazBars3`
  * Overlay mode delegated to `MazBackdrop` (reuses scroll-lock, focus trap, escape, click-outside)
  * Fix offcanvas-collapsed border leak and the icon-centering jump during collapse via `min(calc((var(--maz-sidebar-icon-width)-1.25rem)/2), calc((100%-1.25rem)/2))` — icons stay centred regardless of any padding applied to `MazSidebarContent`
  * Split the monolithic spec into one file per component (11 specs, 121 tests)
  * Doc: replace inline `style` with Tailwind classes and document the new prop shapes
  * Wire MazSidebar components and `useSidebar` into the Nuxt module auto-imports

- **docs:** Ecosystem documentations ([#1582](https://github.com/LouisMazel/maz-ui/pull/1582))
- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- **maz-ui:** Add MazSidebar component system ([#1574](https://github.com/LouisMazel/maz-ui/pull/1574))
  - feat(maz-ui): add MazSidebar component with sub-components and composable
    Implements a fully accessible, composable sidebar system for dashboard,
    admin, and SaaS applications. State is shared via provide/inject from
    the root MazSidebar component.
    Components added:
  * MazSidebar: root container (push/overlay modes, offcanvas/icon/none collapsible)
  * MazSidebarHeader, MazSidebarContent, MazSidebarFooter: layout zones
  * MazSidebarGroup: grouping with optional label (sr-only in icon mode)
  * MazSidebarSeparator: visual HR divider
  * MazSidebarMenu / MazSidebarMenuItem: ul/li with ARIA roles
  * MazSidebarMenuButton: link/button with icon, label, badge, tooltip auto-show
  * MazSidebarMenuSub: collapsible sub-menu with ArrowRight/ArrowLeft keyboard support
  * MazSidebarTrigger: toggle button with aria-expanded and aria-controls
    Composable added:
  * useMazSidebar: typed inject for open state, toggle, setOpen, state
    Closes #1573
  - refactor(maz-ui): polish MazSidebar to align with project conventions
  * Rename `useMazSidebar` composable to `useSidebar` (kept Maz-prefixed types)
  * Drop all scoped CSS in favour of Tailwind utilities and add `m-reset-css` on every sub-component root so theming and tree-shaking work as expected
  * MazSidebarMenuButton: `icon` accepts `MazIconLike`, `badge` accepts `MazBadgeProps`, tooltip via `v-tooltip` directive
  * MazSidebarMenuSub: smooth grid-rows expand/collapse via `MazExpandAnimation`, accepts `MazIconLike` icon
  * MazSidebarTrigger: replace inline SVG with `MazIcon` + `MazBars3`
  * Overlay mode delegated to `MazBackdrop` (reuses scroll-lock, focus trap, escape, click-outside)
  * Fix offcanvas-collapsed border leak and the icon-centering jump during collapse via `min(calc((var(--maz-sidebar-icon-width)-1.25rem)/2), calc((100%-1.25rem)/2))` — icons stay centred regardless of any padding applied to `MazSidebarContent`
  * Split the monolithic spec into one file per component (11 specs, 121 tests)
  * Doc: replace inline `style` with Tailwind classes and document the new prop shapes
  * Wire MazSidebar components and `useSidebar` into the Nuxt module auto-imports

- **docs:** Ecosystem documentations ([#1582](https://github.com/LouisMazel/maz-ui/pull/1582))
- **maz-ui:** Global component default props via MazUi plugin & Nuxt module ([#1596](https://github.com/LouisMazel/maz-ui/pull/1596))
  - refactor(maz-ui): add shared MazRoundedSize type
  - feat(maz-ui): add useGlobalConfig composable for global component defaults
  - feat(maz-ui): accept global component defaults in MazUi plugin
  - feat(maz-ui): MazBtn support global default props (size, roundedSize)
  - feat(maz-ui): MazContainer & MazCard support global default props
  - feat(maz-ui): support global default props on display components
  - feat(maz-ui): support global default props on form components
  - feat(@maz-ui/nuxt): support global component defaults
  - docs: document global component defaults
  - perf(maz-ui): resolve global component defaults once at setup
  - chore(docs): wire docs app to MazUi plugin with global defaults
  - test(@maz-ui/nuxt): cover global defaults plugin registration
  - test(@maz-ui/mcp): account for the global-defaults guide

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([5f6c6f683](https://github.com/LouisMazel/maz-ui/commit/5f6c6f683))
- **maz-ui:** Inputs - auto-fill with SSR ([da00bc2da](https://github.com/LouisMazel/maz-ui/commit/da00bc2da))
- Add default condition to exports for CJS resolver fallback ([d63f00ae2](https://github.com/LouisMazel/maz-ui/commit/d63f00ae2))
- **maz-ui:** Inputs - auto-fill with SSR ([9da60f52b](https://github.com/LouisMazel/maz-ui/commit/9da60f52b))

### 📦 Build

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03c](https://github.com/LouisMazel/maz-ui/commit/61883c03c))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([76af016e0](https://github.com/LouisMazel/maz-ui/commit/76af016e0))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))
- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.19 (2026-05-19)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.18...v5.0.0-beta.19)

### 🩹 Fixes

- **maz-ui:** Inputs - auto-fill with SSR ([da00bc2da](https://github.com/LouisMazel/maz-ui/commit/da00bc2da))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.18 (2026-05-19)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.17...v5.0.0-beta.18)

### 🚀 Features

- **docs:** Ecosystem documentations ([#1582](https://github.com/LouisMazel/maz-ui/pull/1582))

### 📦 Build

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.17 (2026-05-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.16...v5.0.0-beta.17)

No relevant changes since last release

## v5.0.0-beta.11 (2026-05-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.10...v5.0.0-beta.11)

No relevant changes since last release

## v5.0.0-beta.9 (2026-05-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.8...v5.0.0-beta.9)

### 🚀 Features

- **maz-ui:** Add MazSidebar component system ([#1574](https://github.com/LouisMazel/maz-ui/pull/1574))
  - feat(maz-ui): add MazSidebar component with sub-components and composable
    Implements a fully accessible, composable sidebar system for dashboard,
    admin, and SaaS applications. State is shared via provide/inject from
    the root MazSidebar component.
    Components added:
  * MazSidebar: root container (push/overlay modes, offcanvas/icon/none collapsible)
  * MazSidebarHeader, MazSidebarContent, MazSidebarFooter: layout zones
  * MazSidebarGroup: grouping with optional label (sr-only in icon mode)
  * MazSidebarSeparator: visual HR divider
  * MazSidebarMenu / MazSidebarMenuItem: ul/li with ARIA roles
  * MazSidebarMenuButton: link/button with icon, label, badge, tooltip auto-show
  * MazSidebarMenuSub: collapsible sub-menu with ArrowRight/ArrowLeft keyboard support
  * MazSidebarTrigger: toggle button with aria-expanded and aria-controls
    Composable added:
  * useMazSidebar: typed inject for open state, toggle, setOpen, state
    Closes #1573
  - refactor(maz-ui): polish MazSidebar to align with project conventions
  * Rename `useMazSidebar` composable to `useSidebar` (kept Maz-prefixed types)
  * Drop all scoped CSS in favour of Tailwind utilities and add `m-reset-css` on every sub-component root so theming and tree-shaking work as expected
  * MazSidebarMenuButton: `icon` accepts `MazIconLike`, `badge` accepts `MazBadgeProps`, tooltip via `v-tooltip` directive
  * MazSidebarMenuSub: smooth grid-rows expand/collapse via `MazExpandAnimation`, accepts `MazIconLike` icon
  * MazSidebarTrigger: replace inline SVG with `MazIcon` + `MazBars3`
  * Overlay mode delegated to `MazBackdrop` (reuses scroll-lock, focus trap, escape, click-outside)
  * Fix offcanvas-collapsed border leak and the icon-centering jump during collapse via `min(calc((var(--maz-sidebar-icon-width)-1.25rem)/2), calc((100%-1.25rem)/2))` — icons stay centred regardless of any padding applied to `MazSidebarContent`
  * Split the monolithic spec into one file per component (11 specs, 121 tests)
  * Doc: replace inline `style` with Tailwind classes and document the new prop shapes
  * Wire MazSidebar components and `useSidebar` into the Nuxt module auto-imports

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.8 (2026-05-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.7...v5.0.0-beta.8)

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([5f6c6f683](https://github.com/LouisMazel/maz-ui/commit/5f6c6f683))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.6 (2026-05-11)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.5...v5.0.0-beta.6)

No relevant changes since last release

## v5.0.0-beta.5 (2026-05-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.4...v5.0.0-beta.5)

No relevant changes since last release

## v5.0.0-beta.4 (2026-05-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.3...v5.0.0-beta.4)

No relevant changes since last release

## v5.0.0-beta.3 (2026-05-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.2...v5.0.0-beta.3)

No relevant changes since last release

## v5.0.0-beta.2 (2026-05-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.1...v5.0.0-beta.2)

No relevant changes since last release

## v5.0.0-beta.1 (2026-05-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.0...v5.0.0-beta.1)

No relevant changes since last release

## v5.0.0-beta.0 (2026-05-05)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.9.3...v5.0.0-beta.0)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03](https://github.com/LouisMazel/maz-ui/commit/61883c03))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([61883c03](https://github.com/LouisMazel/maz-ui/commit/61883c03))

  Maz-UI v5 is a focused major: a theming overhaul on top of Tailwind v4,
  RTL-correct components, a lighter chart, a simpler icon API, and a one-shot
  CLI to make the upgrade itself painless.
  **Highlights**
  - **Theming, top to bottom** — OKLCh color system for perceptually uniform
    scales, honest token names (`background` → `surface`, `border` → `divider`),
    a real radius scale, a `components` block to override per-component tokens,
    the new `nova` preset, and preset persistence across reloads.
  - **Logical direction by default** — every `left`/`right` prop, slot and CSS
    hook is now `start`/`end`. Set `dir="rtl"` and components mirror correctly.
  - **Lighter chart** — `MazChart` drops `vue-chartjs`, lazy-loads `chart.js`,
    and only registers the modules the chart `type` actually needs.
  - **Simpler icons** — one `icon` prop instead of four. New
    `@maz-ui/icons/raw/*` subpath for raw SVG inlining without a Vue component.
  - **Standardized sizes** — `MazBadge` joins the rest of the library on the
    `MazSize` keyword scale.
  - **~8% lighter library bundle** thanks to the chart, icon and theming
    refactors.
  - Modern browsers required (Chromium 111+, Safari 16.4+, Firefox 128+).
    **Migration**
  - **Mechanical part:** `npx @maz-ui/upgrade ./` rewrites your code, bumps
    every `maz-ui` / `@maz-ui/*` entry in `package.json` to `^5.0.0`, and runs
    the right `pnpm`/`yarn`/`bun`/`npm install` for you.
  - **Judgment calls** (icon paths, theme preset reshape, chart animation
    default): connect [`@maz-ui/mcp`](https://maz-ui.com/guide/mcp) to your AI
    assistant and walk the guide section by section.
    **Links**
  - [Announcement](https://maz-ui.com/blog/v5)
  - [Migration guide](https://maz-ui.com/guide/migration-v5)
  - [`@maz-ui/upgrade` CLI](https://github.com/LouisMazel/maz-ui/tree/master/packages/upgrade)
  - [`@maz-ui/mcp` server](https://maz-ui.com/guide/mcp)
    > **Solo maintainer note:** v4 will receive no further support after v5
    > stable — no security fixes, no backports.

### ❤️ Contributors

- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v4.9.3 (2026-04-23)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.9.2...v4.9.3)

### 💅 Refactors

- **@maz-ui/mcp:** Use import attributes 'with' instead of deprecated 'assert' ([4eec201d](https://github.com/LouisMazel/maz-ui/commit/4eec201d))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.9.1 (2026-04-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.9.0...v4.9.1)

### 📦 Build

- Upgrade dependencies ([58c9be1e](https://github.com/LouisMazel/maz-ui/commit/58c9be1e))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.9.0 (2026-03-19)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.8.0...v4.9.0)

### 🚀 Features

- **@maz-ui/mcp:** Search engine improvements ([dc7d67e0](https://github.com/LouisMazel/maz-ui/commit/dc7d67e0))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.8.0 (2026-03-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.9...v4.8.0)

### 📦 Build

- **@maz-ui/eslint-config:** Upggrade @antfu/eslint-config to v7.7.2 ([4014c0a56](https://github.com/LouisMazel/maz-ui/commit/4014c0a56))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.10-beta.0 (2026-03-16)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.9...v4.7.10-beta.0)

### 📦 Build

- **@maz-ui/eslint-config:** Upggrade @antfu/eslint-config to v7.7.2 ([4b959a8a](https://github.com/LouisMazel/maz-ui/commit/4b959a8a))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.9 (2026-03-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.8...v4.7.9)

### 🩹 Fixes

- Replace internal barrel imports by selective imports ([4c9a8a1b](https://github.com/LouisMazel/maz-ui/commit/4c9a8a1b))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.6 (2026-03-14)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.5...v4.7.6)

### 📦 Build

- Minor dependency upgrades ([245cd0d1](https://github.com/LouisMazel/maz-ui/commit/245cd0d1))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.5...v4.7.6-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.5...v4.7.6-beta.0)

### 📦 Build

- Minor dependency upgrades ([67d9f6e2](https://github.com/LouisMazel/maz-ui/commit/67d9f6e2))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.3...v4.7.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.3...v4.7.4)

No relevant changes since last release

## v4.7.2...v4.7.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.2...v4.7.3)

### 📦 Build

- Upgrade dependencies ([68a1671b](https://github.com/LouisMazel/maz-ui/commit/68a1671b))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.1...v4.7.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.1...v4.7.2)

### 📦 Build

- Migrate to eslint v10 ([#1474](https://github.com/LouisMazel/maz-ui/pull/1474))
- Upgrade dependencies ([#1476](https://github.com/LouisMazel/maz-ui/pull/1476))

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.6.2...v4.7.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.6.2...v4.7.0)

### 🚀 Features

- **maz-ui:** MazUiProvider - alternative to MazUi plugin ([aa9f599b](https://github.com/LouisMazel/maz-ui/commit/aa9f599b))

### 📦 Build

- Upgrade dependencies ([6332ddd8](https://github.com/LouisMazel/maz-ui/commit/6332ddd8))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.0-beta.0...v4.7.0-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.0-beta.0...v4.7.0-beta.1)

No relevant changes since last release

## v4.6.2...v4.7.0-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.6.2...v4.7.0-beta.0)

### 🚀 Features

- **maz-ui:** MazUiProvider - alternative to MazUi plugin ([3a2018cc](https://github.com/LouisMazel/maz-ui/commit/3a2018cc))

### 📦 Build

- Upgrade dependencies ([f10305a9](https://github.com/LouisMazel/maz-ui/commit/f10305a9))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.6.0...v4.6.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.6.0...v4.6.1)

### 📦 Build

- Upgrade dependencies ([5dd041ed6](https://github.com/LouisMazel/maz-ui/commit/5dd041ed6))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.3.3...v4.4.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.4.0)

No relevant changes since last release

## v4.3.3...v4.4.0-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.4.0-beta.1)

No relevant changes since last release

## v4.3.3...v4.3.4-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.3...v4.3.4-beta.0)

No relevant changes since last release

## v4.3.1...v4.3.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2)

No relevant changes since last release

## v4.3.1...v4.3.2-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.2)

No relevant changes since last release

## v4.3.1...v4.3.2-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.1)

No relevant changes since last release

## v4.3.1...v4.3.2-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1...v4.3.2-beta.0)

No relevant changes since last release

## v4.3.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.1-beta.0...v4.3.1)

No relevant changes since last release

## v4.3.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.3.0...v4.3.1-beta.0)

No relevant changes since last release

## v4.2.1...v4.3.0

No relevant changes since last release

## v4.3.0-beta.0...v4.3.0-rc.0

No relevant changes since last release

## v4.3.0-alpha.0...v4.3.0-alpha.1

No relevant changes since last release

## v4.2.0...v4.2.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.0...v4.2.1)

No relevant changes since last release

## v4.2.1-beta.0...v4.2.1-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.2)

No relevant changes since last release

## v4.2.1-beta.0...v4.2.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-beta.0...v4.2.1-beta.1)

No relevant changes since last release

## v4.2.1-alpha.16...v4.2.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.16...v4.2.1-beta.0)

No relevant changes since last release

## v4.2.1-alpha.12...v4.2.1-alpha.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.12...v4.2.1-alpha.13)

No relevant changes for this release

## v4.2.1-alpha.9...v4.2.1-alpha.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.9...v4.2.1-alpha.10)

No relevant changes for this release

## v4.2.1-alpha.8...v4.2.1-alpha.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1-alpha.8...v4.2.1-alpha.9)

No relevant changes for this release

## v4.1.8-beta.2...v4.1.8-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.2...v4.1.8-beta.3)

**Note:** No relevant commits found

## v4.1.8-beta.1...v4.1.8-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.1...v4.1.8-beta.2)

**Note:** No relevant commits found

## v4.1.8-beta.0...v4.1.8-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.8-beta.0...v4.1.8-beta.1)

**Note:** No relevant commits found

## v4.1.7-beta.8...v4.1.8-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.8...v4.1.8-beta.0)

### 💅 Refactors

- **@maz-ui/mcp:** Improve tools, descriptions and add search to help agents ([db9e45a2](https://github.com/LouisMazel/maz-ui/commit/db9e45a2))
- **@maz-ui/mcp:** Improve tools, descriptions and add search to help agents ([05cf7939](https://github.com/LouisMazel/maz-ui/commit/05cf7939))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.6...v4.1.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7)

### 💅 Refactors

- **@maz-ui/mcp:** Improve tools, descriptions and add search to help agents ([05cf7939](https://github.com/LouisMazel/maz-ui/commit/05cf7939))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.7...v4.1.7-beta.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.7...v4.1.7-beta.8)

**Note:** No relevant commits found

## v4.1.7-beta.6...v4.1.7-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.6...v4.1.7-beta.7)

**Note:** No relevant commits found

## v4.1.7-beta.5...v4.1.7-beta.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.5...v4.1.7-beta.6)

**Note:** No relevant commits found

## v4.1.7-beta.4...v4.1.7-beta.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.4...v4.1.7-beta.5)

**Note:** No relevant commits found

## v4.1.7-beta.3...v4.1.7-beta.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.3...v4.1.7-beta.4)

### 💅 Refactors

- **@maz-ui/mcp:** Improve tools, descriptions and add search to help agents ([db9e45a2](https://github.com/LouisMazel/maz-ui/commit/db9e45a2))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.1.7-beta.2...v4.1.7-beta.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.2...v4.1.7-beta.3)

**Note:** No relevant commits found

## v4.1.7-beta.1...v4.1.7-beta.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.1...v4.1.7-beta.2)

**Note:** No relevant commits found

## v4.1.7-beta.0...v4.1.7-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.7-beta.0...v4.1.7-beta.1)

**Note:** No relevant commits found

## v4.1.6...v4.1.7-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7-beta.0)

**Note:** No relevant commits found

## v4.1.5...v4.1.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.5...v4.1.6)

**Note:** No relevant commits found

## v4.1.4...v4.1.5

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.4...v4.1.5)

**Note:** No relevant commits found

## v4.1.3...v4.1.4

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.3...v4.1.4)

**Note:** No relevant commits found

## v4.1.2...v4.1.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.2...v4.1.3)

**Note:** No relevant commits found

## v4.1.1-beta.1...v4.1.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.1...v4.1.2)

**Note:** No relevant commits found

## v4.1.1-beta.0...v4.1.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.0...v4.1.1)

## v4.1.1-beta.0...v4.1.1-beta.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.1-beta.0...v4.1.1-beta.1)

**Note:** No relevant commits found

## v4.1.0...v4.1.1-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.0...v4.1.1-beta.0)

**Note:** No relevant commits found

## v4.0.1...v4.1.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.1...v4.1.0)

**Note:** No relevant commits found

## v4.0.0-beta.39...v4.0.1

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.39...v4.0.1)

**Note:** No relevant commits found

## v4.0.0-beta.39...v4.0.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.39...v4.0.0)

**Note:** No relevant commits found

## v4.0.0-beta.37...v4.0.0-beta.38

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.37...v4.0.0-beta.38)

**Note:** No relevant commits found

## v4.0.0-beta.36...v4.0.0-beta.37

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.36...v4.0.0-beta.37)

**Note:** No relevant commits found

## v4.0.0-beta.35...v4.0.0-beta.36

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.35...v4.0.0-beta.36)

**Note:** No relevant commits found

## v4.0.0-beta.34...v4.0.0-beta.35

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.34...v4.0.0-beta.35)

**Note:** No relevant commits found

## v4.0.0-beta.33...v4.0.0-beta.34

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.33...v4.0.0-beta.34)

**Note:** No relevant commits found

## v4.0.0-beta.32...v4.0.0-beta.33

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.32...v4.0.0-beta.33)

**Note:** No relevant commits found

## v4.0.0-beta.31...v4.0.0-beta.32

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.31...v4.0.0-beta.32)

**Note:** No relevant commits found

## v4.0.0-beta.30...v4.0.0-beta.31

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.30...v4.0.0-beta.31)

**Note:** No relevant commits found

## v4.0.0-beta.29...v4.0.0-beta.30

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.29...v4.0.0-beta.30)

**Note:** No relevant commits found

## v4.0.0-beta.28...v4.0.0-beta.29

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.28...v4.0.0-beta.29)

### 🩹 Fixes

- **@maz-ui/mcp:** Fix dirname folder ([9f3692a6a](https://github.com/LouisMazel/maz-ui/commit/9f3692a6a))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.27...v4.0.0-beta.28

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.27...v4.0.0-beta.28)

### 🩹 Fixes

- **@maz-ui/mcp:** Get doc resources ([e37243362](https://github.com/LouisMazel/maz-ui/commit/e37243362))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.26...v4.0.0-beta.27

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.26...v4.0.0-beta.27)

**Note:** No relevant commits found

## v4.0.0-beta.25...v4.0.0-beta.26

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.25...v4.0.0-beta.26)

**Note:** No relevant commits found

## v4.0.0-beta.24...v4.0.0-beta.25

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.24...v4.0.0-beta.25)

### 🚀 Features

- **@maz-ui/mcp:** Transform http server to stdio server ([9aeeb4804](https://github.com/LouisMazel/maz-ui/commit/9aeeb4804))

### 💅 Refactors

- **@maz-ui/mcp:** Remove search tools ([17ce1c126](https://github.com/LouisMazel/maz-ui/commit/17ce1c126))

### 📖 Documentation

- **@maz-ui/mcp:** Update README.md ([7de4c1ec7](https://github.com/LouisMazel/maz-ui/commit/7de4c1ec7))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))
