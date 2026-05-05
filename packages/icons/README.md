# @maz-ui/icons

A comprehensive collection of **860+ SVG icons** for your Vue / Nuxt apps. Each icon ships in three flavors — pick the one that fits the situation.

## Installation

```bash
pnpm add @maz-ui/icons
```

## Three formats — pick what you need

### `raw/` — raw SVG string (lightest, recommended for inline icons)

The icon is a `string` containing the pre-processed SVG markup (`width`/`height` set to `1em`, fills replaced by `currentColor`). Use it via `<MazIcon :icon="MazStar" />` — no Vue component overhead, no async chunk, no fetch. This is the cheapest format at runtime and the default recommendation for icons that are always rendered.

```ts
import { MazStar } from '@maz-ui/icons/raw/MazStar'
import MazIcon from 'maz-ui/components/MazIcon'
```

```vue
<template>
  <MazIcon :icon="MazStar" class="maz:text-warning" />
</template>
```

### `static/` — eagerly-loaded Vue component

A small Vue component that renders the SVG directly. Use this when you need a real component to drop into a template (`<MazStar />`) and the icon is always rendered. Pays the Vue component overhead per icon but lets you skip the `<MazIcon>` wrapper.

```ts
import { MazStar } from '@maz-ui/icons/MazStar' // legacy path
// Or use the static path
import { MazStar } from '@maz-ui/icons/static/MazStar'
```

```vue
<template>
  <MazStar class="maz:text-warning" />
</template>
```

### `lazy/` — async Vue component (`defineAsyncComponent`)

A Vue component whose SVG payload is split into its own chunk and only loaded on demand. Use this for icons that appear conditionally (in a tooltip, behind a `v-if`, in a modal that opens on click, …) so you don't ship the SVG bytes upfront.

```ts
import { MazStar } from '@maz-ui/icons/lazy/MazStar'
```

```vue
<template>
  <MazStar v-if="isOpen" />
</template>
```

You can also import lazy icons from the main entry with the `Lazy` prefix:

```ts
import { LazyMazStar } from '@maz-ui/icons'
```

## When to use which?

| Situation                                                            | Format                                                         | Why                                                                  |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Inline always-rendered icon (e.g. button icon, list bullet)          | `raw/` via `MazIcon`                                           | Smallest runtime cost — just inserts a string                        |
| You need a drop-in component (`<MazStar />` directly in templates)   | `static/`                                                      | Standard Vue component, no wrapper                                   |
| Icon hidden behind `v-if` / opened in a dialog / shown after a click | `lazy/`                                                        | Icon code is split out and only fetched on demand                    |
| Dynamic icon name resolved at runtime                                | `static/` (or pass a URL/raw string to `<MazIcon icon="…" />`) | The component handles strings, URLs and Vue components transparently |

## Auto-import with resolver

```ts
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [MazIconsResolver()],
    }),
  ],
})
```

The resolver wires up both `MazXxx` (static) and `LazyMazXxx` (lazy) component imports. Raw entries are not auto-imported — they're values, not components, so import them explicitly.

## Documentation

Full documentation: [https://maz-ui.com/guide/icons](https://maz-ui.com/guide/icons)

## License

[MIT](./LICENSE)
