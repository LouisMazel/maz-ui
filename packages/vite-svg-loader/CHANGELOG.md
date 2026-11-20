# Changelog

## @maz-ui/vite-svg-loader@0.2.0 (2026-11-20)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/@maz-ui/vite-svg-loader@0.1.0...@maz-ui/vite-svg-loader@0.2.0)

### 🚀 Features

- **vite-svg-loader:** Add the ?svg and ?uri queries ([b87745ef3](https://github.com/LouisMazel/maz-ui/commit/b87745ef3))

  `?svg` is `?raw` and `?uri` is `?url`, typed as an SVG string and a URL: an icon prop with `strict` accepts them.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))

## @maz-ui/vite-svg-loader@0.1.0 (2026-11-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/@maz-ui/vite-svg-loader@0.1.0-beta.0...@maz-ui/vite-svg-loader@0.1.0)

No relevant changes since last release

## @maz-ui/vite-svg-loader@0.1.0-beta.0 (2026-11-18)

[compare changes](https://github.com/LouisMazel/maz-ui/compare/b625dcbd1cb1ef89a21acc9490ee2d7384e1c883...@maz-ui/vite-svg-loader@0.1.0-beta.0)

### 🚀 Features

- **vite-svg-loader:** Add @maz-ui/vite-svg-loader, SVG as Vue components, optimized strings or URLs ([fe3e3302c](https://github.com/LouisMazel/maz-ui/commit/fe3e3302c))

  A Vite plugin to import SVG files as Vue components (`?component`), strings optimized by svgo 4 (`?raw`) or URLs, with or without maz-ui. A drop-in replacement for vite-svg-loader.

### 🩹 Fixes

- Publish the exports without the monorepo:dev condition ([61fd61c82](https://github.com/LouisMazel/maz-ui/commit/61fd61c82))

  The published package.json no longer has the monorepo:dev condition of the monorepo, which pointed to sources that are not published.

### ❤️ Contributors

- LouisMazel ([@LouisMazel](https://github.com/LouisMazel))
