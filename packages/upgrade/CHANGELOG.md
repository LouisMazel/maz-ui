# Changelog

## v5.1.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0...v5.1.0)

No relevant changes since last release

## v5.1.0-beta.1 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.0-beta.0...v5.1.0-beta.1)

No relevant changes since last release

## v5.1.0-beta.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.1-beta.0...v5.1.0-beta.0)

No relevant changes since last release

## v5.0.0 (2026-10-21)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.9.3...v5.0.0)

### 🚀 Features

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac))

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

- **@maz-ui/upgrade:** MazAvatar - auto-multiply static size units by 3 ([6763fb25](https://github.com/LouisMazel/maz-ui/commit/6763fb25))

  The upgrade tool now rewrites `MazAvatar` static `size` values to match the v5 scale fix: a CSS-unit `size` no longer renders 3x too large, so the codemod multiplies the value by 3 to preserve the exact render (`size="2rem"` becomes `size="6rem"`). Every CSS unit is supported. `MazSize` keywords are left as-is, and bound `:size` expressions are reported as a warning for manual review.

- **@maz-ui/upgrade:** Add MazPullToRefresh on-click to on-refresh codemod ([6553dbdd](https://github.com/LouisMazel/maz-ui/commit/6553dbdd))

  The upgrade tool now rewrites the `MazPullToRefresh` callback prop, renaming `on-click`/`onClick` (bound or static, kebab-case or camelCase) to `on-refresh`/`onRefresh`. The rewrite is scoped to `<MazPullToRefresh>` tags, so native click handlers and the `onClick` prop of other components are left untouched.

- **@maz-ui/upgrade:** Cover the remaining mechanical v4 to v5 changes ([dbe6bbe9](https://github.com/LouisMazel/maz-ui/commit/dbe6bbe9))

  New rewrites: bare icon names on the icon components (start-icon="user" renders nothing in v5,
  rewritten to "/user.svg", the same file), MazIcon src / name / path to icon, camelCase / v-bind: /
  v-slot: forms of the icon props and slots, footerAlign / roundedSize / activeColor, internal class
  names (m-input-wrapper-_, drawer-anim-_, --has-*-icon also in stylesheets), css variables in
  scripts, the removed generateCSS / buildThemeCSS / buildSeparateThemeFiles options, maz-ui/dist/css
  imports, valibot added when imported (optional peer in v5). Stylesheets (.scss, .sass, .less, .styl,
  .pcss) are scanned. New warnings: bound MazIcon :name / :path, removed @loaded / @unloaded events,
  deep maz-ui/dist imports.
  Bugs of the existing rules: hsl(var() / alpha) produced an invalid color-mix (0.5 instead of 50%,
  broken parentheses with var() / calc()), imports of the v5 root types were moved to @maz-ui/utils,
  the icon props were rewritten on other libraries (Vant left-icon) and class names, kebab-case maz
  tags and attributes containing => were skipped, strategy: 'hybrid' and the light / dark preset
  blocks were rewritten in files unrelated to maz-ui, inline removed options were left, @maz-ui/cli
  (unpublished in v5) was bumped.

- **@maz-ui/upgrade:** Map the rem sizes of MazBadge to the MazSize keywords ([d5d845ea](https://github.com/LouisMazel/maz-ui/commit/d5d845ea))

  The v5 MazBadge size only accepts a MazSize keyword. The keywords are rem font-sizes, so a static
  rem size is mapped to the closest one (a tie goes to the larger keyword), which gives the table of
  the migration guide whatever the root font size. px / em sizes depend on the root or parent font
  size and are reported as warnings.

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([3d078772](https://github.com/LouisMazel/maz-ui/commit/3d078772))

### 📦 Build

- Upgrade dependencies ([8ad3dd67](https://github.com/LouisMazel/maz-ui/commit/8ad3dd67))
- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))

  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

- **deps:** Upgrade dependencies ([82851e19](https://github.com/LouisMazel/maz-ui/commit/82851e19))
- **deps:** Upgrade dependencies ([#1639](https://github.com/LouisMazel/maz-ui/pull/1639))
- **deps:** Upgrade minor and patch dependencies ([7665e43f](https://github.com/LouisMazel/maz-ui/commit/7665e43f))

  - `dompurify` from 3.4.16 to 3.4.17 (fixes 3 security advisories)
  - `marked` from 18.0.14 to 18.1.1
  - `@tanstack/vue-virtual` from 3.13.39 to 3.13.47
  - `libphonenumber-js` from 1.13.14 to 1.13.15
  - `@nuxt/kit` from 4.5.2 to 4.6.2
  - `@nuxt/devtools-kit` from 3.2.3 to 3.4.4
  - `@modelcontextprotocol/sdk` from 1.32.0 to 1.32.1
  - `globby` from 16.2.0 to 16.2.4
  - `eslint-plugin-better-tailwindcss` from 4.7.0 to 4.10.0
  - `eslint-plugin-vuejs-accessibility` from 2.6.0 to 2.6.2
  - `stylelint-config-recess-order` from 7.8.0 to 7.8.2
  - `stylelint-order` from 8.1.1 to 8.1.2

- Require Node.js 22.12 or later ([8135bc29](https://github.com/LouisMazel/maz-ui/commit/8135bc29))

  All the published packages now declare `engines.node` as `>=22.12.0`. Node.js 18 and 20 are no longer supported: upgrade to Node.js 22.12 or later (24 recommended).

#### ⚠️ Breaking Changes

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([b7dc0cea](https://github.com/LouisMazel/maz-ui/commit/b7dc0cea))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac))

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

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.44 (2026-09-29)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.43...v5.0.0-beta.44)

### 🚀 Features

- **@maz-ui/upgrade:** Add MazPullToRefresh on-click to on-refresh codemod ([6553dbdd](https://github.com/LouisMazel/maz-ui/commit/6553dbdd))

  The upgrade tool now rewrites the `MazPullToRefresh` callback prop, renaming `on-click`/`onClick` (bound or static, kebab-case or camelCase) to `on-refresh`/`onRefresh`. The rewrite is scoped to `<MazPullToRefresh>` tags, so native click handlers and the `onClick` prop of other components are left untouched.

### 📦 Build

- **deps:** Upgrade dependencies ([#1639](https://github.com/LouisMazel/maz-ui/pull/1639))

### ❤️ Contributors

- Mazel <me@loicmazuel.com>
- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.29 (2026-06-14)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.28...v5.0.0-beta.29)

### 🚀 Features

- **@maz-ui/upgrade:** MazAvatar - auto-multiply static size units by 3 ([6763fb255](https://github.com/LouisMazel/maz-ui/commit/6763fb255))

  The upgrade tool now rewrites `MazAvatar` static `size` values to match the v5 scale fix: a CSS-unit `size` no longer renders 3x too large, so the codemod multiplies the value by 3 to preserve the exact render (`size="2rem"` becomes `size="6rem"`). Every CSS unit is supported. `MazSize` keywords are left as-is, and bound `:size` expressions are reported as a warning for manual review.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac5](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac5))

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

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([d63f00ae2](https://github.com/LouisMazel/maz-ui/commit/d63f00ae2))
- Add default condition to exports for CJS resolver fallback ([3d078772a](https://github.com/LouisMazel/maz-ui/commit/3d078772a))

### 📦 Build

- Upgrade dependencies ([42df1a9f4](https://github.com/LouisMazel/maz-ui/commit/42df1a9f4))
- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

- Upgrade dependencies ([8ad3dd67f](https://github.com/LouisMazel/maz-ui/commit/8ad3dd67f))
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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([3b4b37ac5](https://github.com/LouisMazel/maz-ui/commit/3b4b37ac5))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

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

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([5f6c6f683](https://github.com/LouisMazel/maz-ui/commit/5f6c6f683))
- Add default condition to exports for CJS resolver fallback ([d63f00ae2](https://github.com/LouisMazel/maz-ui/commit/d63f00ae2))

### 📦 Build

- Upgrade dependencies ([69a1869b6](https://github.com/LouisMazel/maz-ui/commit/69a1869b6))
- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

- Upgrade dependencies ([42df1a9f4](https://github.com/LouisMazel/maz-ui/commit/42df1a9f4))
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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([ab834af76](https://github.com/LouisMazel/maz-ui/commit/ab834af76))

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

## v5.0.0-beta.18 (2026-05-19)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.17...v5.0.0-beta.18)

### 📦 Build

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))
  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

### ❤️ Contributors

- Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.11 (2026-05-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.10...v5.0.0-beta.11)

No relevant changes since last release

## v5.0.0-beta.8 (2026-05-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.7...v5.0.0-beta.8)

### 🩹 Fixes

- Add default condition to exports for CJS resolver fallback ([5f6c6f683](https://github.com/LouisMazel/maz-ui/commit/5f6c6f683))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.6 (2026-05-11)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.5...v5.0.0-beta.6)

### 📦 Build

- Upgrade dependencies ([69a1869b](https://github.com/LouisMazel/maz-ui/commit/69a1869b))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

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

- ⚠️ Maz-ui v5 — theming overhaul, RTL-native components, ~8% lighter ([78659718a](https://github.com/LouisMazel/maz-ui/commit/78659718a))

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
