# Changelog

## v5.7.0-beta.4 (2026-11-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.3...v5.7.0-beta.4)

No relevant changes since last release

## v5.7.0-beta.3 (2026-11-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.2...v5.7.0-beta.3)

No relevant changes since last release

## v5.7.0-beta.2 (2026-11-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.1...v5.7.0-beta.2)

### 🩹 Fixes

- **mcp:** Name Codex, Cline and Zed as the agents without a project MCP config in init ([32752a7f4](https://github.com/LouisMazel/maz-ui/commit/32752a7f4))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.7.0-beta.1 (2026-11-11)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.0...v5.7.0-beta.1)

### 🚀 Features

- **mcp:** Show the effective theme colors and review brand colors, type scale and raw icons ([8f4074c9f](https://github.com/LouisMazel/maz-ui/commit/8f4074c9f))

  - `get_theme_tokens` shows the effective colors of the project preset, or of a bundled one with `preset`: every color and step in light and dark, with the WCAG contrasts and what to check. `colors` and `steps` narrow the output
  - New `maz-ui-mcp colors [preset]` command
  - New `get_theme_tokens` topics: `container-queries`, `layout`, `type-scale` and `rich-text`
  - New review rules: `pale-brand-color`, `type-scale`, `arbitrary-font-size`, `multiple-primary-actions` and `raw-icon-tag` (a `@maz-ui/icons/raw` import used as a tag renders nothing)
  - `theme-colors` flags `bg-background` and suggests `surface`
  - More search synonyms, and the `base-font-size` hint points to `noArbitraryPx.baseFontSize` of `@maz-ui/eslint-config`

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.7.0-beta.0 (2026-11-09)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.6.0...v5.7.0-beta.0)

No relevant changes since last release

## v5.6.0 (2026-11-08)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.5.0...v5.6.0)

### 🚀 Features

- **mcp:** Serve the docs of each package at its installed version ([e93188c13](https://github.com/LouisMazel/maz-ui/commit/e93188c13))

  - Each installed maz-ui package now serves its own docs, at its installed version: the docs of `@maz-ui/eslint-config` or `@maz-ui/stylelint-config` no longer follow the version of maz-ui.
  - The docs of the packages that are not installed still come from the bundle of @maz-ui/mcp, with a note when the installed version differs.
  - `list_docs` lists every package of the ecosystem, installed or not.
  - An older maz-ui that ships its docs in `docs/` is still read.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.5.0 (2026-11-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.4.0...v5.5.0)

No relevant changes since last release

## v5.4.0 (2026-11-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.3.0...v5.4.0)

### 🚀 Features

- **@maz-ui/mcp:** Show the color scale mode of the project preset in `get_theme_tokens` ([1777f8781](https://github.com/LouisMazel/maz-ui/commit/1777f8781))

### 🩹 Fixes

- **@maz-ui/mcp:** Label the bundled docs with the maz-ui version they document ([3df0ec36c](https://github.com/LouisMazel/maz-ui/commit/3df0ec36c))

### 📦 Build

- **@maz-ui/mcp:** Bundle @maz-ui/node and @maz-ui/utils without declaring them as optional peers ([2443858ef](https://github.com/LouisMazel/maz-ui/commit/2443858ef))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.3.1-beta.0 (2026-11-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.3.0...v5.3.1-beta.0)

### 🩹 Fixes

- **@maz-ui/mcp:** Label the bundled docs with the maz-ui version they document ([3df0ec36c](https://github.com/LouisMazel/maz-ui/commit/3df0ec36c))

### 📦 Build

- **@maz-ui/mcp:** Bundle @maz-ui/node and @maz-ui/utils without declaring them as optional peers ([2443858ef](https://github.com/LouisMazel/maz-ui/commit/2443858ef))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.3.0 (2026-11-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.2.0...v5.3.0)

### 🚀 Features

- **@maz-ui/node:** Load the Claude Code rule only for the files that use maz-ui ([fbca64ec3](https://github.com/LouisMazel/maz-ui/commit/fbca64ec3))

  The generated `.claude/rules/maz-ui.md` now starts with a `paths:` frontmatter listing the workspaces that depend on maz-ui (e.g. `apps/pwa/**/*.{vue,ts,tsx,css,scss}`), so Claude Code loads it when it reads or edits one of these files instead of at every turn. The rule is also cut to its core (about 2.9 KB instead of 6.3 KB); the rest is served on demand by the MCP tools.

  Set `paths: 'all'` or a list of globs in `setupAgents`, `--paths` in `npx @maz-ui/mcp init`, or `mazUi.agents.paths` in Nuxt. Rules generated before are updated, unless you edited them. See [setupAgents](https://maz-ui.com/ecosystem/node/setup-agents).

### 📦 Build

- **deps:** Upgrade minor and patch dependencies ([ac04f8577](https://github.com/LouisMazel/maz-ui/commit/ac04f8577))

  - `marked` from 18.1.1 to 18.1.3 (hardening against quadratic emphasis scans and ReDoS-class backtracking)
  - `@tanstack/vue-virtual` from 3.13.47 to 3.13.52
  - `chart.js` from 4.5.1 to 4.6.1
  - `@nuxt/kit` from 4.6.2 to 4.6.4
  - `eslint-plugin-vuejs-accessibility` from 2.6.2 to 2.6.3
  - `stylelint-config-recess-order` from 7.8.2 to 7.10.0
  - `stylelint-order` from 8.1.2 to 8.1.3

- Require Node.js releases with the October 2026 security fixes ([9db85d136](https://github.com/LouisMazel/maz-ui/commit/9db85d136))

  All the published packages now declare `engines.node` as `^22.23.4 || ^24.22.1 || >=26.12.1`: the Node.js releases of October 21, 2026 fix 10 vulnerabilities, including a remote code execution in the Brotli decoder (CVE-2026-111497) and TLS hostname verification bypasses. Upgrade to Node.js 22.23.4, 24.22.1 or 26.12.1 or later. Node.js 23 and 25 are end-of-life and no longer accepted.

- **deps:** Upgrade @antfu/eslint-config to v10, nx to v24, glob to v14 and @types/node to v26 ([2364673d9](https://github.com/LouisMazel/maz-ui/commit/2364673d9))

  `@maz-ui/eslint-config` now uses `@antfu/eslint-config` v10, which adds new formatting rules: multiline ternaries, arrays and objects. Your lint may report new errors on existing code, run `eslint --fix` to apply them.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.2.0 (2026-11-01)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.1...v5.2.0)

### 🚀 Features

- **@maz-ui/mcp:** Init starts the installed @maz-ui/mcp or pins its version ([1c3b7222f](https://github.com/LouisMazel/maz-ui/commit/1c3b7222f))

  Install it in the project (`pnpm add -D @maz-ui/mcp`), then run `npx @maz-ui/mcp init`: the MCP configs start the installed version through your package manager, in about a second. Otherwise they run `npx -y @maz-ui/mcp@<version>`, pinned to the version of `init`: with `@latest`, npx queries the registry at every start.

  An existing entry that runs `@maz-ui/mcp@latest` gets the new command and keeps its other fields, a command written by hand is left untouched.

- **@maz-ui/mcp:** Tell the agents which icon format to use for each usage ([2d3a5b34f](https://github.com/LouisMazel/maz-ui/commit/2d3a5b34f))

  `find_icons` and the instructions of the server recommend `@maz-ui/icons/raw` for the icon props, `static` directly in a template and `lazy` only for the icons not visible at first render.

- **@maz-ui/mcp:** Report the buttons that only show an icon without an accessible name ([f67e9a9ad](https://github.com/LouisMazel/maz-ui/commit/f67e9a9ad))

  The new `icon-button-label` rule of `review_code` warns about a `MazBtn` with only an icon and no `text`, content nor `aria-label`.

- **@maz-ui/mcp:** Only register the MCP server with init in a project without maz-ui ([9d660fa5b](https://github.com/LouisMazel/maz-ui/commit/9d660fa5b))

  The rules document the maz-ui components: in a project that only uses @maz-ui/utils or @maz-ui/node, init no longer fails and registers the MCP server, which serves the docs bundled with @maz-ui/mcp. Pass --docs to write the rules anyway.

  The fallback of the tool errors now points to the docs folder in use.

### 🔥 Performance

- **@maz-ui/mcp:** Install a single package and answer the agents right away ([d624b026f](https://github.com/LouisMazel/maz-ui/commit/d624b026f))

  The runtime dependencies are bundled: `npx @maz-ui/mcp` downloads one package of less than 1 MB instead of a hundred, so the first start stays under the start timeout of the agents behind a slow registry. The server answers on start and loads the search index, the Vue compiler and Babel on first use.

### 📦 Build

- **deps:** Publish the internal dependencies with caret ranges ([aa5baf40a](https://github.com/LouisMazel/maz-ui/commit/aa5baf40a))

  `workspace:*` is published as the exact version: a project that installs another version of an internal package (`@maz-ui/utils`...) gets two copies. `workspace:^` is published as `^<version>`, so the package managers deduplicate them.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.2.0-beta.0 (2026-11-01)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.1...v5.2.0-beta.0)

### 🚀 Features

- **@maz-ui/mcp:** Init starts the installed @maz-ui/mcp or pins its version ([1c3b7222f](https://github.com/LouisMazel/maz-ui/commit/1c3b7222f))

  Install it in the project (`pnpm add -D @maz-ui/mcp`), then run `npx @maz-ui/mcp init`: the MCP configs start the installed version through your package manager, in about a second. Otherwise they run `npx -y @maz-ui/mcp@<version>`, pinned to the version of `init`: with `@latest`, npx queries the registry at every start.

  An existing entry that runs `@maz-ui/mcp@latest` gets the new command and keeps its other fields, a command written by hand is left untouched.

- **@maz-ui/mcp:** Tell the agents which icon format to use for each usage ([2d3a5b34f](https://github.com/LouisMazel/maz-ui/commit/2d3a5b34f))

  `find_icons` and the instructions of the server recommend `@maz-ui/icons/raw` for the icon props, `static` directly in a template and `lazy` only for the icons not visible at first render.

- **@maz-ui/mcp:** Report the buttons that only show an icon without an accessible name ([f67e9a9ad](https://github.com/LouisMazel/maz-ui/commit/f67e9a9ad))

  The new `icon-button-label` rule of `review_code` warns about a `MazBtn` with only an icon and no `text`, content nor `aria-label`.

- **@maz-ui/mcp:** Only register the MCP server with init in a project without maz-ui ([9d660fa5b](https://github.com/LouisMazel/maz-ui/commit/9d660fa5b))

  The rules document the maz-ui components: in a project that only uses @maz-ui/utils or @maz-ui/node, init no longer fails and registers the MCP server, which serves the docs bundled with @maz-ui/mcp. Pass --docs to write the rules anyway.

  The fallback of the tool errors now points to the docs folder in use.

### 🔥 Performance

- **@maz-ui/mcp:** Install a single package and answer the agents right away ([d624b026f](https://github.com/LouisMazel/maz-ui/commit/d624b026f))

  The runtime dependencies are bundled: `npx @maz-ui/mcp` downloads one package of less than 1 MB instead of a hundred, so the first start stays under the start timeout of the agents behind a slow registry. The server answers on start and loads the search index, the Vue compiler and Babel on first use.

### 📦 Build

- **deps:** Publish the internal dependencies with caret ranges ([4994c255c](https://github.com/LouisMazel/maz-ui/commit/4994c255c))

  `workspace:*` is published as the exact version: a project that installs another version of an internal package (`@maz-ui/utils`...) gets two copies. `workspace:^` is published as `^<version>`, so the package managers deduplicate them.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.1.1 (2026-10-28)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.0...v5.1.1)

### 🩹 Fixes

- **@maz-ui/mcp:** Explain that an HTML attribute with a prop counterpart is only forwarded ([e8720bc5e](https://github.com/LouisMazel/maz-ui/commit/e8720bc5e))

  `<MazInput autofocus />` is no longer reported as an unknown prop: the review says that `autofocus` only reaches the HTML element and suggests `auto-focus`, the prop the component handles.

- **@maz-ui/mcp:** Leave clickable cards and empty hit areas out of prefer-maz-component ([66a447ecf](https://github.com/LouisMazel/maz-ui/commit/66a447ecf))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.1.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0...v5.1.0)

### 🚀 Features

- **@maz-ui/mcp:** Search by need, component APIs, icons, theme tokens and code review for AI agents ([feedfb4e3](https://github.com/LouisMazel/maz-ui/commit/feedfb4e3))

  The server provides the tools `search_docs` (find what maz-ui provides for a need described in plain words), `get_component_api` (props with accepted values, `v-model`, events, slots), `find_icons`, `get_theme_tokens` (every Tailwind class and CSS variable of the theme), `get_doc`, `list_docs`, `get_setup_guide` and `review_code`, and the prompts `build`, `audit` and `setup`.

  It serves the docs of the maz-ui version installed in the project (`node_modules/maz-ui/docs`), and falls back on its bundled docs.

  The package is also a CLI: `npx @maz-ui/mcp init` configures the AI agents of a project, `npx @maz-ui/mcp review "src/**/*.vue"` reviews files against maz-ui (unknown props or values, unknown icons, native elements, duplicated libraries, default Tailwind palette, `maz:` prefix...) and fails on errors in CI.

- **@maz-ui/mcp:** Add the --no-rules option to init to only register the MCP server ([574b3dd60](https://github.com/LouisMazel/maz-ui/commit/574b3dd60))

  `npx @maz-ui/mcp init --no-rules` adds the `maz-ui` server to the MCP config of the agents without writing any rule file: the instructions of the server already give the maz-ui rules to the agents.

- **@maz-ui/mcp:** Read the Tailwind theme and the preset of the project ([010a50d8c](https://github.com/LouisMazel/maz-ui/commit/010a50d8c))

### 🩹 Fixes

- **@maz-ui/mcp:** Reduce the noise of the search and of the code review ([b788b393b](https://github.com/LouisMazel/maz-ui/commit/b788b393b))
- **@maz-ui/mcp:** Read the reason of an ignore comment and show absolute paths outside the project ([eb83caf52](https://github.com/LouisMazel/maz-ui/commit/eb83caf52))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.1.0-beta.2 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.0-beta.1...v5.1.0-beta.2)

### 🩹 Fixes

- **@maz-ui/mcp:** Read the reason of an ignore comment and show absolute paths outside the project ([eb83caf52](https://github.com/LouisMazel/maz-ui/commit/eb83caf52))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.1.0-beta.1 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.1.0-beta.0...v5.1.0-beta.1)

### 🚀 Features

- **@maz-ui/mcp:** Read the Tailwind theme and the preset of the project ([010a50d8c](https://github.com/LouisMazel/maz-ui/commit/010a50d8c))

### 🩹 Fixes

- **@maz-ui/mcp:** Reduce the noise of the search and of the code review ([b788b393b](https://github.com/LouisMazel/maz-ui/commit/b788b393b))

### ❤️ Contributors

- LouisMazel <me@loicmazuel.com>

## v5.1.0-beta.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.1-beta.0...v5.1.0-beta.0)

### 🚀 Features

- **@maz-ui/mcp:** Search by need, component APIs, icons, theme tokens and code review for AI agents ([feedfb4e3](https://github.com/LouisMazel/maz-ui/commit/feedfb4e3))

  The server provides the tools `search_docs` (find what maz-ui provides for a need described in plain words), `get_component_api` (props with accepted values, `v-model`, events, slots), `find_icons`, `get_theme_tokens` (every Tailwind class and CSS variable of the theme), `get_doc`, `list_docs`, `get_setup_guide` and `review_code`, and the prompts `build`, `audit` and `setup`.

  It serves the docs of the maz-ui version installed in the project (`node_modules/maz-ui/docs`), and falls back on its bundled docs.

  The package is also a CLI: `npx @maz-ui/mcp init` configures the AI agents of a project, `npx @maz-ui/mcp review "src/**/*.vue"` reviews files against maz-ui (unknown props or values, unknown icons, native elements, duplicated libraries, default Tailwind palette, `maz:` prefix...) and fails on errors in CI.

- **@maz-ui/mcp:** Add the --no-rules option to init to only register the MCP server ([574b3dd60](https://github.com/LouisMazel/maz-ui/commit/574b3dd60))

  `npx @maz-ui/mcp init --no-rules` adds the `maz-ui` server to the MCP config of the agents without writing any rule file: the instructions of the server already give the maz-ui rules to the agents.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.1-beta.0 (2026-10-27)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0...v5.0.1-beta.0)

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

- Add default condition to exports for CJS resolver fallback ([3d078772](https://github.com/LouisMazel/maz-ui/commit/3d078772))
- **maz-ui:** Inputs - auto-fill with SSR ([9d079503](https://github.com/LouisMazel/maz-ui/commit/9d079503))
- **@maz-ui/mcp:** Make docs copy resilient to concurrent removal ([7f536dbe](https://github.com/LouisMazel/maz-ui/commit/7f536dbe))

### 📖 Documentation

- **docs:** Document usePullToRefresh and the new MazPullToRefresh ([bbecd17b](https://github.com/LouisMazel/maz-ui/commit/bbecd17b))

  - new usePullToRefresh page, listed in the composables, resolvers and Nuxt docs
  - MazPullToRefresh page rewritten (demo, scroll container, standalone mode,
    tuning, slots, translations, accessibility, events)
  - migration guide: behavior changes of MazPullToRefresh
  - MCP documentation tests count the new composable

### 📦 Build

- Upgrade dependencies ([#1583](https://github.com/LouisMazel/maz-ui/pull/1583))

  - build: upgrade dependencies
  - build: update pnpm-workspace.yaml
  - chore: add eslint-config dep to root package.json
  - build: upgrade major dependencies (#1584)

- **deps:** Upgrade dependencies ([82851e19](https://github.com/LouisMazel/maz-ui/commit/82851e19))
- **deps:** Upgrade dependencies ([#1639](https://github.com/LouisMazel/maz-ui/pull/1639))
- **deps:** Upgrade dependencies ([a47a6aeb](https://github.com/LouisMazel/maz-ui/commit/a47a6aeb))
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

### 🧪 Tests

- **@maz-ui/mcp:** Include useDrag in documentation service expectations ([ed937a81](https://github.com/LouisMazel/maz-ui/commit/ed937a81))
- **@maz-ui/mcp:** Update the utils documentation count ([43fea25b](https://github.com/LouisMazel/maz-ui/commit/43fea25b))

  Two utils pages were added (isIos, preventIosInputZoom).

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

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
- Mazel <me@loicmazuel.com>
- Mazel (Loïc Mazuel) ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.51 (2026-10-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.50...v5.0.0-beta.51)

No relevant changes since last release

## v5.0.0-beta.50 (2026-10-09)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.49...v5.0.0-beta.50)

### 📖 Documentation

- **docs:** Document usePullToRefresh and the new MazPullToRefresh ([bbecd17b](https://github.com/LouisMazel/maz-ui/commit/bbecd17b))

  - new usePullToRefresh page, listed in the composables, resolvers and Nuxt docs
  - MazPullToRefresh page rewritten (demo, scroll container, standalone mode,
    tuning, slots, translations, accessibility, events)
  - migration guide: behavior changes of MazPullToRefresh
  - MCP documentation tests count the new composable

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.49 (2026-10-08)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.48...v5.0.0-beta.49)

No relevant changes since last release

## v5.0.0-beta.48 (2026-10-07)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.47...v5.0.0-beta.48)

No relevant changes since last release

## v5.0.0-beta.47 (2026-10-06)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.46...v5.0.0-beta.47)

### 📦 Build

- **deps:** Upgrade dependencies ([a47a6aeb](https://github.com/LouisMazel/maz-ui/commit/a47a6aeb))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.46 (2026-10-05)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.45...v5.0.0-beta.46)

### 🩹 Fixes

- **@maz-ui/mcp:** Make docs copy resilient to concurrent removal ([7f536dbe](https://github.com/LouisMazel/maz-ui/commit/7f536dbe))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.44 (2026-09-29)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.43...v5.0.0-beta.44)

### 📦 Build

- **deps:** Upgrade dependencies ([#1639](https://github.com/LouisMazel/maz-ui/pull/1639))

### ❤️ Contributors

- Mazel <me@loicmazuel.com>

## v5.0.0-beta.42 (2026-07-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.41...v5.0.0-beta.42)

No relevant changes since last release

## v5.0.0-beta.41 (2026-07-08)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.40...v5.0.0-beta.41)

No relevant changes since last release

## v5.0.0-beta.40 (2026-07-01)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.39...v5.0.0-beta.40)

### 🧪 Tests

- **@maz-ui/mcp:** Include useDrag in documentation service expectations ([ed937a813](https://github.com/LouisMazel/maz-ui/commit/ed937a813))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.0.0-beta.39 (2026-06-22)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.38...v5.0.0-beta.39)

No relevant changes since last release

## v5.0.0-beta.38 (2026-06-22)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.37...v5.0.0-beta.38)

No relevant changes since last release

## v5.0.0-beta.37 (2026-06-22)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.36...v5.0.0-beta.37)

No relevant changes since last release

## v5.0.0-beta.36 (2026-06-21)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.35...v5.0.0-beta.36)

No relevant changes since last release

## v5.0.0-beta.35 (2026-06-20)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.34...v5.0.0-beta.35)

No relevant changes since last release

## v5.0.0-beta.34 (2026-06-20)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.33...v5.0.0-beta.34)

No relevant changes since last release

## v5.0.0-beta.33 (2026-06-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.32...v5.0.0-beta.33)

No relevant changes since last release

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
