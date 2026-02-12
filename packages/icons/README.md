# @maz-ui/icons

A comprehensive collection of **840+ SVG icons** as Vue components for your Vue.js applications.

## Installation

```bash
pnpm add @maz-ui/icons
```

## Usage

### Static Icons (default — eagerly loaded)

```ts
import { MazCheck, MazHeart } from '@maz-ui/icons'
```

### Lazy Icons (async loaded via `defineAsyncComponent`)

```ts
// With Lazy prefix from main entry
import { LazyMazCheck, LazyMazHeart } from '@maz-ui/icons'

// Or from the lazy sub-path (no prefix)
import { MazCheck } from '@maz-ui/icons/lazy'
```

### Sub-path Imports

For fine-grained bundle control, import individual icons directly:

```ts
// lazy
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
// static
import { MazCheck } from '@maz-ui/icons/MazCheck'
```

### Auto-import with Resolver

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

The resolver supports both `MazXxx` (static) and `LazyMazXxx` (lazy) components.

## Documentation

Full documentation: [https://maz-ui.com/guide/icons](https://maz-ui.com/guide/icons)

## License

[MIT](./LICENSE)
