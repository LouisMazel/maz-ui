# @maz-ui/vite-svg-loader

Vite plugin that imports SVG files as Vue components, optimized strings or URLs, with svgo 4. A drop-in replacement for `vite-svg-loader`, usable with or without [Maz-UI](https://maz-ui.com).

## Installation

```bash
npm install -D @maz-ui/vite-svg-loader
```

Requires `vite >=6 <9` and `vue >=3.5`.

## Usage

```ts
// vite.config.ts
import svgLoader from '@maz-ui/vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader()
  ],
})
```

```ts
import IconComponent from './icon.svg?component' // Vue component
import iconRaw from './icon.svg?raw' // optimized SVG string
import IconSource from './icon.svg?skipsvgo' // component, without svgo
```

Types: add `"@maz-ui/vite-svg-loader/client"` to `compilerOptions.types`.

The default svgo config is checked not to alter icons (pixel comparison of 868 SVG files): ids prefixed by the path of the file, decimals adapted to the size of the SVG, `viewBox` kept.

## Documentation

[maz-ui.com/ecosystem/vite-svg-loader](https://maz-ui.com/ecosystem/vite-svg-loader)
