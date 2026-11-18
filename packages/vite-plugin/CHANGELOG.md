# Changelog

## v5.7.0-beta.7 (2026-11-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.6...v5.7.0-beta.7)

### 🚀 Features

- **vite-plugin:** Add MazUi(), the icons by name and the SVG of the project, with the CSS purge ([21629edc4](https://github.com/LouisMazel/maz-ui/commit/21629edc4))

  `MazUi()` holds two plugins, both enabled by default:

  - `icons` (`MazUiIcons()`): registers in each chunk the icons its files use by name, so only the icons of each page are bundled, and in the HTML of the server. The SVG of `src/icons` are names too (`hero`, or `app:hero` with a `prefix`), optimized by svgo. It writes `src/maz-icons.d.ts`, the types of the names, and rewrites the imports from the root of @maz-ui/icons to the module of each icon.
  - `purge` (`MazUiPurgeCss()`): removes the unused CSS of maz-ui at build time

- **vite-plugin:** MazUiThemePresets keeps in the build only the presets loaded by name ([512215cb3](https://github.com/LouisMazel/maz-ui/commit/512215cb3))

  getPreset of @maz-ui/themes imports each named preset on demand, so every preset is a chunk of the build. MazUi({ presets: ['maz-ui', 'ocean'] }), or MazUiThemePresets({ presets }) alone, keeps only the listed ones, `[]` none for an app that only uses preset objects. It also applies to the dependency optimizer, so a missing preset fails in dev as in production.

### 🩹 Fixes

- Publish the exports without the monorepo:dev condition ([61fd61c82](https://github.com/LouisMazel/maz-ui/commit/61fd61c82))

  The published package.json no longer has the monorepo:dev condition of the monorepo, which pointed to sources that are not published.

- **vite-plugin:** An icon used by name shares the raw module of maz-ui ([a7448f3b3](https://github.com/LouisMazel/maz-ui/commit/a7448f3b3))

  `MazUi()` imports an icon of `@maz-ui/icons` used by name from its `raw` module, resolved from maz-ui like the imports of its components: an icon used by name and by a component of maz-ui (the close cross of the toasts) is bundled once, instead of twice.

- **vite-plugin:** The SVG of an icon of maz-ui read from its built raw module ([064a47773](https://github.com/LouisMazel/maz-ui/commit/064a47773))

  When the `raw` module of an icon of `@maz-ui/icons` is not resolved, `MazUi()` reads its SVG from `dist/raw` instead of its SVG file, identical byte for byte: the flags and the logos need no file in the package.

### 🧪 Tests

- **vite-plugin:** Icons of a variable with a type annotation ([935faf353](https://github.com/LouisMazel/maz-ui/commit/935faf353))

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## v5.7.0-beta.6 (2026-11-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.5...v5.7.0-beta.6)

No relevant changes since last release

## v5.7.0-beta.5 (2026-11-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.4...v5.7.0-beta.5)

No relevant changes since last release

## v5.7.0-beta.4 (2026-11-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.3...v5.7.0-beta.4)

No relevant changes since last release

## v5.7.0-beta.3 (2026-11-13)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.2...v5.7.0-beta.3)

No relevant changes since last release

## v5.7.0-beta.2 (2026-11-12)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.1...v5.7.0-beta.2)

No relevant changes since last release

## v5.7.0-beta.1 (2026-11-11)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/v5.7.0-beta.0...v5.7.0-beta.1)

### 🚀 Features

- **vite-plugin:** Add MazUiPurgeCss to remove the unused CSS of maz-ui ([7b32087ec](https://github.com/LouisMazel/maz-ui/commit/7b32087ec))

  New package `@maz-ui/vite-plugin`, released with the other packages of maz-ui. `MazUiPurgeCss()` removes at build time the CSS of the components, plugins, directives and utilities of maz-ui that the app does not use, from the `purge-manifest.json` written by the build of maz-ui.

  Options: `content` (files to scan), `entries` (modules used at runtime), `safelist` and `report`. See https://maz-ui.com/ecosystem/vite-plugin

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
