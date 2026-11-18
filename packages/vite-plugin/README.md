# @maz-ui/vite-plugin

Vite plugins for [Maz-UI](https://maz-ui.com). The first one, `MazUiPurgeCss`, removes from the CSS of maz-ui (`maz-ui/style.css`, `maz-ui/utilities.css`) the rules of the components, plugins, directives and utilities your app does not use. It runs at build time only.

With `@maz-ui/nuxt`, the module adds it for you (`css.purge`).

## Installation

```bash
npm install -D @maz-ui/vite-plugin
```

Requires `vite >=6 <9` and `maz-ui >= 5.7.0`.

## Usage

```ts
import { MazUiPurgeCss } from '@maz-ui/vite-plugin'
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    MazUiPurgeCss()
  ],
})
```

## Options

| Option     | Description                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `content`  | Globs of the files that use maz-ui, relative to the project root (a package of your monorepo, a dependency in `node_modules`) |
| `entries`  | Entries of maz-ui to keep: `MazBtn`, `vTooltip`, `plugins/toast`...                                                           |
| `safelist` | Classes to keep: `maz:` classes or public utilities (`text-title-1`, `/^rich-text/`)                                          |
| `report`   | Print the CSS saved by the purge (default: `true`)                                                                            |

## Documentation

https://maz-ui.com/ecosystem/vite-plugin

## License

MIT
