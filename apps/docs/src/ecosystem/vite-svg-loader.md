---
title: Vite SVG loader
description: "@maz-ui/vite-svg-loader imports SVG files as Vue components, optimized strings or URLs, with svgo 4. A drop-in replacement for vite-svg-loader."
head:
  - - meta
    - name: keywords
      content: vite, svg, svg loader, vite-svg-loader, svgo, vue, svg component, raw svg, optimize svg
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/vite-svg-loader" />

It works in any Vue 3 app built with Vite, with or without maz-ui.

## Installation

For Vue apps built with Vite (`vite >=6 <9`):

::: code-group

```bash [pnpm]
pnpm add -D @maz-ui/vite-svg-loader
```

```bash [npm]
npm install -D @maz-ui/vite-svg-loader
```

```bash [yarn]
yarn add -D @maz-ui/vite-svg-loader
```

:::

## Usage

```ts
// vite.config.ts
import svgLoader from '@maz-ui/vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), svgLoader()],
})
```

Add the types of the imports to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@maz-ui/vite-svg-loader/client"]
  }
}
```

Then pick what an import returns with its query:

```ts
import iconUrl from './icon.svg' // URL (Vite), see defaultImport
import IconComponent from './icon.svg?component' // Vue component
import iconRaw from './icon.svg?raw' // optimized SVG string
import IconSource from './icon.svg?skipsvgo' // component, without svgo
import iconSource from './icon.svg?raw&skipsvgo' // string, without svgo
```

```vue
<template>
  <IconComponent class="size-6 text-primary" />
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `svgo` | `boolean` | `true` | Optimize the SVG files with svgo |
| `svgoConfig` | `Config \| (defaults: Config) => Config` | see below | An object replaces the default config, a function receives it (for each file) to extend it |
| `defaultImport` | `'url' \| 'raw' \| 'component'` | `'url'` | What an import without query returns |

```ts
// Keep the default config, with fewer decimals for large illustrations
svgLoader({
  svgoConfig: defaults => ({ ...defaults, floatPrecision: 2 }),
})
```

## Default svgo config

It is made not to alter icons: every SVG of [@maz-ui/icons](./icons/index.md) (icons, flags, logos) is rendered before and after optimization in the tests, and compared pixel by pixel.

- `preset-default` with `multipass`, plus `convertStyleToAttrs`, `cleanupListOfValues`, `convertOneStopGradients`, `removeXlink`, `removeDeprecatedAttrs` and `removeScripts`. They clean the exports of Illustrator, Figma or Inkscape.
- **Ids prefixed by the path of the file**: two inline SVGs with the same `id` would point to each other's `url(#id)`.
- **Decimals from the size of the SVG**: 3 below a viewBox of 480 (icons), 2 up to 4800, 1 beyond.
- `mergePaths` is off: merging overlapping paths changes how they are filled.
- The `viewBox`, the `width`/`height` and the `<title>` are kept.

## From vite-svg-loader

Replace the import and the types, the options are the same.

```diff
- import svgLoader from 'vite-svg-loader'
+ import svgLoader from '@maz-ui/vite-svg-loader'
```

```diff
- "types": ["vite-svg-loader"]
+ "types": ["@maz-ui/vite-svg-loader/client"]
```

What changes:

- An import without query is the URL, like in Vite (`<img src="./logo.svg">` works): set `defaultImport: 'component'` to keep the components of vite-svg-loader.
- svgo 4 instead of svgo 3.
- `?raw` returns the optimized SVG (`?raw&skipsvgo` for the source).
- The default config keeps the `viewBox`, prefixes the ids and adapts the decimals.
- `svgoConfig` also accepts a function, to extend the default config.

## Helpers

The functions of the loader, for other tools and plugins:

```ts
import { compileSvgComponent, optimizeSvg } from '@maz-ui/vite-svg-loader'

const svg = optimizeSvg(source, { path: '/app/icons/logo.svg', root: '/app' })
const code = compileSvgComponent(svg, { id: 'logo.svg', path: '/app/icons/logo.svg' })
```

`getDefaultSvgoConfig(svg, { path, root })`, `getFloatPrecision(svg)` and `getIdPrefix(svg, { path, root })` are exported too.

`@maz-ui/vite-svg-loader/optimize` exports the svgo functions only, without the compiler of Vue:

```ts
import { optimizeSvg } from '@maz-ui/vite-svg-loader/optimize'
```
