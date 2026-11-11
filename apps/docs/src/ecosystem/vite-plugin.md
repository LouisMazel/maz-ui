---
title: Vite plugin
description: "@maz-ui/vite-plugin removes from the CSS of maz-ui the rules of the components, plugins, directives and utilities your app does not use, at build time."
head:
  - - meta
    - name: keywords
      content: vite, vite plugin, purge css, unused css, css size, bundle size, tree shaking css, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/vite-plugin" />

`maz-ui/style.css` holds the styles of every component. Most apps use a few of them: the plugin keeps the rules of what your code uses and removes the rest, in the CSS of your production build. It is the first plugin of the package, others may come.

::: tip Nuxt
With `@maz-ui/nuxt`, you do not install anything: the module adds the plugin for you, see [`css.purge`](./nuxt.md#css-configuration).
:::

## Installation

For Vue apps built with Vite (`vite >=6 <9`):

::: code-group

```bash [pnpm]
pnpm add -D @maz-ui/vite-plugin
```

```bash [npm]
npm install -D @maz-ui/vite-plugin
```

```bash [yarn]
yarn add -D @maz-ui/vite-plugin
```

:::

It requires `maz-ui >= 5.7.0`, which ships the manifest the plugin reads. Keep both on the same version.

## Usage

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { MazUiPurgeCss } from '@maz-ui/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    MazUiPurgeCss(),
  ],
})
```

Keep importing `maz-ui/style.css` as usual. The build prints a report:

```txt
[maz-ui:purge-css] 86.9 kB -> 32.8 kB of maz-ui CSS (-62%, 412 unused classes removed)
```

## How it works

1. At the build of maz-ui, `dist/css/purge-manifest.json` lists every class of `style.css`, the public utilities, and for each entry (`components/MazBtn`, `plugins/toast`, `directives/vTooltip`...) the classes it renders, with the entries it imports.
2. In your build, the plugin scans the source files of the project and finds the entries you use by their names: `MazBtn`, `<maz-btn>`, `LazyMazBtn`, `useToast`, `v-tooltip`, `ToastPlugin`... A namespace import of a barrel (`import * as components from 'maz-ui/components'`) keeps every component. It also finds the public utilities used (`text-title-1`, `padded-container`...).
3. When Vite transforms a CSS file, the plugin removes the rules of the unused entries and utilities, before the hash of the asset is computed, so the cache stays correct. It also removes the classes of `main.css` that no component renders.
4. At the end of the build, it checks the final JS and HTML: a purged class found there prints a warning, see [Bundle check](#bundle-check).

The plugin only touches the CSS of maz-ui. The CSS of your own app is never modified.

## Gains

Measured with `vite build`, the maz-ui preset, on the CSS assets of the app. Every Vue app imports `maz-ui/style.css`.

| App | Without purge | With purge | Saved |
| --- | --- | --- | --- |
| Landing (MazBtn, MazCard, MazBadge, MazAvatar, MazAccordion) | 103.2 kB (15.6 kB gzip) | 49.1 kB (8.8 kB gzip) | -52% |
| Sign in (MazInput, MazCheckbox, MazBtn, MazCard, MazLink, toast plugin) | 108.3 kB (16.0 kB gzip) | 64.7 kB (10.1 kB gzip) | -40% |
| Dashboard (MazTable, MazSelect, MazDatePicker, MazDialog, MazSidebar, MazTabs, MazDropdown, MazSwitch, toast, dialog, vTooltip...) | 156.1 kB (24.2 kB gzip) | 119.5 kB (19.4 kB gzip) | -23% |
| No Tailwind, with `maz-ui/utilities.css` (padded-container, text-display, rich-text, MazBtn, MazCard) | 118.8 kB (16.9 kB gzip) | 50.9 kB (8.4 kB gzip) | -57% |
| Every component | 212.0 kB (29.8 kB gzip) | 195.7 kB (28.0 kB gzip) | -8% |

The `style.css` of maz-ui alone goes from 86.9 kB to 32.8 kB (landing), 43.8 kB (sign in) and 50.3 kB (dashboard).

With Nuxt (2 pages using MazBtn, MazCard, MazBadge, LazyMazAccordion, MazInput, MazCheckbox, the toast plugin and vTooltip, `nuxi generate`), the CSS files go from 122.3 kB (21.0 kB gzip) to 78.6 kB (14.8 kB gzip) with the default `css.purge: true`, which is -36%.

::: warning The numbers depend on your app
They come from the demo apps above and this setup (preset, Tailwind or not, components used). The more components you use, the smaller the gain.
:::

## Options

All options are optional.

| Option | Type | Description |
| --- | --- | --- |
| `content` | `string[]` | Globs of the files that use maz-ui, relative to the root of the project. Added to the defaults |
| `entries` | `string[]` | Entries of maz-ui to keep even if the plugin does not find them in the code: a component (`MazBtn`), a directive (`vTooltip`), a plugin (`plugins/toast`) |
| `safelist` | `(string \| RegExp)[]` | Classes to keep: `maz:` classes of the components or public utilities (`text-title-1`, `/^rich-text/`) |
| `report` | `boolean` | Print the CSS saved by the purge (default: `true`) |

By default, the plugin scans every source file of the project (`vue`, `js`, `jsx`, `ts`, `tsx`, `html`, `md`, `mdx`, `astro`, `svelte`...), and ignores `node_modules`, `dist`, `.output`, `.nuxt`, `coverage` and `.d.ts` files.

### Monorepo

When your app uses components written in another package of the monorepo, add its sources:

```ts
MazUiPurgeCss({
  content: ['../../packages/ui/src/**/*.vue'],
})
```

### Dependency built on maz-ui

The default scan ignores `node_modules`, the globs of `content` do not: add the files of a dependency that renders maz-ui components (a design system of your company), or list the entries it uses with `entries`:

```ts
MazUiPurgeCss({
  content: ['node_modules/@acme/ui/dist/**/*.js'],
  // or
  entries: ['MazBtn', 'MazDialog', 'plugins/toast', 'vTooltip'],
})
```

### Names built at runtime

A component resolved from a dynamic name, or a class that only appears in HTML loaded at runtime (a CMS, an API), is not found in the source. Keep it explicitly:

```ts
MazUiPurgeCss({
  entries: ['MazBtn', 'MazCard'],
  safelist: ['text-title-1', /^rich-text/],
})
```

## Bundle check

At the end of the build, the plugin looks for the purged classes in the final JS and HTML. If one is found, a component of maz-ui is used by a file the plugin does not scan (a dependency, a package of your monorepo), and the build warns:

```txt
[maz-ui:purge-css] 3 purged classes are in the bundle: maz:rounded-lg, maz:flex, maz:p-4
A component of maz-ui is probably used by a file the plugin does not scan (a dependency, a package of your monorepo).
Add its files to the `content` option, or the component to `entries`.
```

Fix it with `content` (the files that use the component) or `entries`, then rebuild.

## Projects without Tailwind

`maz-ui/utilities.css` contains the public utilities of maz-ui without prefix: the `text-*` and `type-*` type scale, `rich-text`, `padded-container`, `flex-center`, `glass`, `scrollbar-themed`, `disabled-*`, `cursor-interactive`, `cap-f` and `z-default-backdrop`. It weighs 19.7 kB (2.6 kB gzip) and the plugin purges it like `style.css`.

```ts
import 'maz-ui/style.css'
import 'maz-ui/utilities.css'
```

::: warning With Tailwind CSS
Keep `@import 'maz-ui/tailwindcss/utilities.css'` in your Tailwind entry and do not import `maz-ui/utilities.css`: you would get duplicates, and no variants (`hover:`, `tab-m:`...). See [Tailwind CSS](./../guide/tailwind.md).
:::

## Limitations

- Vite only for now (no webpack, Rollup alone or other bundlers).
- Build only: the dev server keeps the whole CSS.
- Entries are found by name in the files of the project: names built at runtime need `entries` or `safelist`.
- Only the CSS of maz-ui is purged, not the CSS of your app.
