# Changelog

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
