# Change Log

## v5.0.0-beta.11 (2026-05-15)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.10...v5.0.0-beta.11)

No relevant changes since last release

## v5.0.0-beta.8 (2026-05-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.0.0-beta.7...v5.0.0-beta.8)

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

## v4.7.2...v4.7.3

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.2...v4.7.3)

### 📦 Build

- Upgrade dependencies ([68a1671b](https://github.com/LouisMazel/maz-ui/commit/68a1671b))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.7.1...v4.7.2

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.1...v4.7.2)

### 📦 Build

- Update dependencies ([#1470](https://github.com/LouisMazel/maz-ui/pull/1470))
  - build: upgrade dependencies
  - ci: add canary release workflow
  - chore: use relizy canary version
  - chore: use relizy beta version

### ❤️ Contributors

- Mazel ([@mazel](https://github.com/mazel))

## v4.7.1...v4.7.2-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.7.1...v4.7.2-beta.0)

### 📦 Build

- Update dependencies ([#1470](https://github.com/LouisMazel/maz-ui/pull/1470))
  - build: upgrade dependencies
  - ci: add canary release workflow
  - chore: use relizy canary version
  - chore: use relizy beta version

### ❤️ Contributors

- Mazel ([@mazel](https://github.com/mazel))

## v4.6.2...v4.7.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.6.2...v4.7.0)

### 📦 Build

- Upgrade dependencies ([6332ddd8](https://github.com/LouisMazel/maz-ui/commit/6332ddd8))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.6.2...v4.7.0-beta.0

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.6.2...v4.7.0-beta.0)

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

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.2.1...v4.3.1-beta.0)

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

**Note:** No relevant commits found

## v4.1.6...v4.1.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.1.6...v4.1.7)

**Note:** No relevant commits found

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

**Note:** No relevant commits found

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

**Note:** No relevant commits found

## v4.0.0-beta.27...v4.0.0-beta.28

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.27...v4.0.0-beta.28)

**Note:** No relevant commits found

## v4.0.0-beta.26...v4.0.0-beta.27

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.26...v4.0.0-beta.27)

**Note:** No relevant commits found

## v4.0.0-beta.25...v4.0.0-beta.26

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.25...v4.0.0-beta.26)

**Note:** No relevant commits found

## v4.0.0-beta.24...v4.0.0-beta.25

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.24...v4.0.0-beta.25)

**Note:** No relevant commits found

## v4.0.0-beta.23...v4.0.0-beta.24

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.23...v4.0.0-beta.24)

**Note:** No relevant commits found

## v4.0.0-beta.22...v4.0.0-beta.23

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.22...v4.0.0-beta.23)

**Note:** No relevant commits found

## v4.0.0-beta.21...v4.0.0-beta.22

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.21...v4.0.0-beta.22)

**Note:** No relevant commits found

## v4.0.0-beta.20...v4.0.0-beta.21

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.20...v4.0.0-beta.21)

**Note:** No relevant commits found

## v4.0.0-beta.19...v4.0.0-beta.20

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.19...v4.0.0-beta.20)

**Note:** No relevant commits found

## v4.0.0-beta.18...v4.0.0-beta.19

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.18...v4.0.0-beta.19)

### 🚀 Features

- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([6254ffa7e](https://github.com/LouisMazel/maz-ui/commit/6254ffa7e))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([d81463fc0](https://github.com/LouisMazel/maz-ui/commit/d81463fc0))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([f6978f418](https://github.com/LouisMazel/maz-ui/commit/f6978f418))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([05f936be9](https://github.com/LouisMazel/maz-ui/commit/05f936be9))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([84366e00b](https://github.com/LouisMazel/maz-ui/commit/84366e00b))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([5c5a8f4f4](https://github.com/LouisMazel/maz-ui/commit/5c5a8f4f4))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([58344db69](https://github.com/LouisMazel/maz-ui/commit/58344db69))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([edebcbf3d](https://github.com/LouisMazel/maz-ui/commit/edebcbf3d))

### 🩹 Fixes

- **@maz-ui/icons:** Export svg files correctly ([5ede33435](https://github.com/LouisMazel/maz-ui/commit/5ede33435))
- Package config to be published on npm ([c4569ba86](https://github.com/LouisMazel/maz-ui/commit/c4569ba86))
- **@maz-ui/icons:** Export svg files correctly ([eb654c44c](https://github.com/LouisMazel/maz-ui/commit/eb654c44c))
- Package config to be published on npm ([64f4c6740](https://github.com/LouisMazel/maz-ui/commit/64f4c6740))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.17...v4.0.0-beta.18

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.17...v4.0.0-beta.18)

### 🚀 Features

- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([6254ffa7e](https://github.com/LouisMazel/maz-ui/commit/6254ffa7e))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([d81463fc0](https://github.com/LouisMazel/maz-ui/commit/d81463fc0))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([f6978f418](https://github.com/LouisMazel/maz-ui/commit/f6978f418))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([05f936be9](https://github.com/LouisMazel/maz-ui/commit/05f936be9))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([84366e00b](https://github.com/LouisMazel/maz-ui/commit/84366e00b))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([5c5a8f4f4](https://github.com/LouisMazel/maz-ui/commit/5c5a8f4f4))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([58344db69](https://github.com/LouisMazel/maz-ui/commit/58344db69))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([edebcbf3d](https://github.com/LouisMazel/maz-ui/commit/edebcbf3d))

### 🩹 Fixes

- **@maz-ui/icons:** Export svg files correctly ([5ede33435](https://github.com/LouisMazel/maz-ui/commit/5ede33435))
- Package config to be published on npm ([c4569ba86](https://github.com/LouisMazel/maz-ui/commit/c4569ba86))
- **@maz-ui/icons:** Export svg files correctly ([eb654c44c](https://github.com/LouisMazel/maz-ui/commit/eb654c44c))
- Package config to be published on npm ([64f4c6740](https://github.com/LouisMazel/maz-ui/commit/64f4c6740))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.16...v4.0.0-beta.17

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.16...v4.0.0-beta.17)

**Note:** No relevant commits found

## v4.0.0-beta.15...v4.0.0-beta.16

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.15...v4.0.0-beta.16)

### 🚀 Features

- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([b76f65c52](https://github.com/LouisMazel/maz-ui/commit/b76f65c52))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([7726ff8e7](https://github.com/LouisMazel/maz-ui/commit/7726ff8e7))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([bc23c6a66](https://github.com/LouisMazel/maz-ui/commit/bc23c6a66))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([f8c2518f0](https://github.com/LouisMazel/maz-ui/commit/f8c2518f0))
- **maz-ui:** MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) ([#1189](https://github.com/LouisMazel/maz-ui/pull/1189))
- **@maz-ui/icons:** Add resolver to auto-import icons as Vue Components ([6254ffa7e](https://github.com/LouisMazel/maz-ui/commit/6254ffa7e))
- **@maz-ui/themes:** New package - create and manage theme with maz-ui ([d81463fc0](https://github.com/LouisMazel/maz-ui/commit/d81463fc0))
- **maz-ui:** Implement new theme manager provided by @maz-ui/themes ([f6978f418](https://github.com/LouisMazel/maz-ui/commit/f6978f418))
- **@maz-ui/translations:** New packages to manage maz-ui's translations easily ([05f936be9](https://github.com/LouisMazel/maz-ui/commit/05f936be9))

### 🩹 Fixes

- **@maz-ui/icons:** Export svg files correctly ([dd760f3d0](https://github.com/LouisMazel/maz-ui/commit/dd760f3d0))
- Package config to be published on npm ([ceb1f68f2](https://github.com/LouisMazel/maz-ui/commit/ceb1f68f2))
- **@maz-ui/icons:** Export svg files correctly ([5ede33435](https://github.com/LouisMazel/maz-ui/commit/5ede33435))
- Package config to be published on npm ([c4569ba86](https://github.com/LouisMazel/maz-ui/commit/c4569ba86))

### ❤️ Contributors

- Louis Mazel ([@LouisMazel](https://github.com/LouisMazel))

## v4.0.0-beta.14...v4.0.0-beta.15

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.14...v4.0.0-beta.15)

**Note:** No relevant commits found

## v4.0.0-beta.13...v4.0.0-beta.14

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.13...v4.0.0-beta.14)

**Note:** No relevant commits found

## v4.0.0-beta.12...v4.0.0-beta.13

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.12...v4.0.0-beta.13)

**Note:** No relevant commits found

## v4.0.0-beta.11...v4.0.0-beta.12

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.11...v4.0.0-beta.12)

**Note:** No relevant commits found

## v4.0.0-beta.10...v4.0.0-beta.11

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.10...v4.0.0-beta.11)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.9...v4.0.0-beta.10

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.9...v4.0.0-beta.10)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.8...v4.0.0-beta.9

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.8...v4.0.0-beta.9)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.7...v4.0.0-beta.8

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.7...v4.0.0-beta.8)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.6...v4.0.0-beta.7

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.6...v4.0.0-beta.7)

**Note:** Version bump only to follow ecosystem versioning

## v4.0.0-beta.5...v4.0.0-beta.6

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.5...v4.0.0-beta.6)

**Note:** Version bump only to follow ecosystem versioning

## [4.0.0-beta.4](https://github.com/LouisMazel/maz-ui/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2025-07-10)

**Note:** Version bump only for package @maz-ui/cli

## 4.0.0-beta.3 (2025-07-10)

- chore: remove catalog feature from pnpm workspace ([0176319](https://github.com/LouisMazel/maz-ui/commit/0176319))

## 4.0.0-beta.1 (2025-07-09)

- chore: upgrade dependencies in major versions ([2d10379](https://github.com/LouisMazel/maz-ui/commit/2d10379))
- chore: upgrade dependencies in minor versions ([120c580](https://github.com/LouisMazel/maz-ui/commit/120c580))
- chore(release): bump version to 4.0.0-alpha.0 ([074e0b0](https://github.com/LouisMazel/maz-ui/commit/074e0b0))
- chore(release): bump version to 4.0.0-alpha.2 ([7eb3ec0](https://github.com/LouisMazel/maz-ui/commit/7eb3ec0))
- chore(release): bump version to 4.0.0-alpha.3 ([936c813](https://github.com/LouisMazel/maz-ui/commit/936c813))
- chore(release): bump version to 4.0.0-alpha.4 ([0cb8e72](https://github.com/LouisMazel/maz-ui/commit/0cb8e72))
- chore(release): bump version to 4.0.0-alpha.5 ([bebfcfb](https://github.com/LouisMazel/maz-ui/commit/bebfcfb))
- chore(release): bump version to v3.50.1 ([2874d45](https://github.com/LouisMazel/maz-ui/commit/2874d45))
- chore(release): version packages 4.0.0-beta.0 ([531325a](https://github.com/LouisMazel/maz-ui/commit/531325a))
- fix: package config to be published on npm ([ceb1f68](https://github.com/LouisMazel/maz-ui/commit/ceb1f68))
- feat(@maz-ui/icons): Add resolver to auto-import icons as Vue Components ([b76f65c](https://github.com/LouisMazel/maz-ui/commit/b76f65c))
- feat(@maz-ui/themes): new package - create and manage theme with maz-ui ([7726ff8](https://github.com/LouisMazel/maz-ui/commit/7726ff8))
- feat(@maz-ui/translations): new packages to manage maz-ui's translations easily ([f8c2518](https://github.com/LouisMazel/maz-ui/commit/f8c2518))
- fix(@maz-ui/icons): export svg files correctly ([dd760f3](https://github.com/LouisMazel/maz-ui/commit/dd760f3))
- feat(maz-ui): implement new theme manager provided by @maz-ui/themes ([bc23c6a](https://github.com/LouisMazel/maz-ui/commit/bc23c6a))
- feat(maz-ui): MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) (#118 ([cfabd9b](https://github.com/LouisMazel/maz-ui/commit/cfabd9b)), closes [#1189](https://github.com/LouisMazel/maz-ui/issues/1189)

## 4.0.0-beta.0 (2025-07-09)

- fix: package config to be published on npm ([ceb1f68](https://github.com/LouisMazel/maz-ui/commit/ceb1f68))
- feat(@maz-ui/icons): Add resolver to auto-import icons as Vue Components ([b76f65c](https://github.com/LouisMazel/maz-ui/commit/b76f65c))
- feat(@maz-ui/themes): new package - create and manage theme with maz-ui ([7726ff8](https://github.com/LouisMazel/maz-ui/commit/7726ff8))
- feat(@maz-ui/translations): new packages to manage maz-ui's translations easily ([f8c2518](https://github.com/LouisMazel/maz-ui/commit/f8c2518))
- fix(@maz-ui/icons): export svg files correctly ([dd760f3](https://github.com/LouisMazel/maz-ui/commit/dd760f3))
- feat(maz-ui): implement new theme manager provided by @maz-ui/themes ([bc23c6a](https://github.com/LouisMazel/maz-ui/commit/bc23c6a))
- feat(maz-ui): MazDropzone - new version - completely rewritten without deps (BREAKING_CHANGES) (#118 ([cfabd9b](https://github.com/LouisMazel/maz-ui/commit/cfabd9b)), closes [#1189](https://github.com/LouisMazel/maz-ui/issues/1189)
- chore: upgrade dependencies in major versions ([2d10379](https://github.com/LouisMazel/maz-ui/commit/2d10379))
- chore: upgrade dependencies in minor versions ([120c580](https://github.com/LouisMazel/maz-ui/commit/120c580))
- chore(release): bump version to 4.0.0-alpha.0 ([074e0b0](https://github.com/LouisMazel/maz-ui/commit/074e0b0))
- chore(release): bump version to 4.0.0-alpha.2 ([7eb3ec0](https://github.com/LouisMazel/maz-ui/commit/7eb3ec0))
- chore(release): bump version to 4.0.0-alpha.3 ([936c813](https://github.com/LouisMazel/maz-ui/commit/936c813))
- chore(release): bump version to 4.0.0-alpha.4 ([0cb8e72](https://github.com/LouisMazel/maz-ui/commit/0cb8e72))
- chore(release): bump version to 4.0.0-alpha.5 ([bebfcfb](https://github.com/LouisMazel/maz-ui/commit/bebfcfb))
- chore(release): bump version to v3.50.1 ([2874d45](https://github.com/LouisMazel/maz-ui/commit/2874d45))
