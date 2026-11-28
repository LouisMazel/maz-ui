---
title: useMediaQuery
description: Reactive result of a CSS media query, updated when it changes. SSR safe. Includes useReducedMotion for the prefers-reduced-motion preference.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it instead of `window.matchMedia` by hand. For the breakpoints of the theme, use [useBreakpoints](./use-breakpoints).

## Usage

Resize the window or change the color scheme of your system: the values follow.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-2 maz:text-sm">
    <div>(min-width: 1024px): <MazBadge :color="isWide ? 'success' : 'container'" size="sm">{{ isWide }}</MazBadge></div>
    <div>(orientation: landscape): <MazBadge :color="isLandscape ? 'success' : 'container'" size="sm">{{ isLandscape }}</MazBadge></div>
    <div>(prefers-color-scheme: dark): <MazBadge :color="isDark ? 'success' : 'container'" size="sm">{{ isDark }}</MazBadge></div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useMediaQuery } from 'maz-ui/composables/useMediaQuery'

const { matches: isWide } = useMediaQuery('(min-width: 1024px)')
const { matches: isLandscape } = useMediaQuery(() => '(orientation: landscape)')
const { matches: isDark } = useMediaQuery('(prefers-color-scheme: dark)')
</script>

<template>
  <p>Wide screen: {{ isWide }}</p>
  <p>Landscape: {{ isLandscape }}</p>
  <p>Dark scheme: {{ isDark }}</p>
</template>
```

  </template>
</ComponentDemo>

The query can be a string, a ref or a getter.

## API

```ts
function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  options?: { initialValue?: boolean, internalWindow?: Window },
): { matches: Ref<boolean>, isSupported: boolean }
```

`initialValue` (default `false`) is the value on the server, when `matchMedia` does not exist and, inside a component, until it is mounted (the first render matches the server markup, so hydration does not mismatch).

## useReducedMotion

`shouldReduceMotion` says when to turn your animations off or shorten them: the `prefers-reduced-motion: reduce` preference of the user, unless the [`motion` option](./../guide/vue.md#motion) of MazUi forces it. `prefersReducedMotion` is the preference alone.

```ts
import { useReducedMotion } from 'maz-ui/composables/useReducedMotion'

const { shouldReduceMotion } = useReducedMotion()

element.animate(keyframes, { duration: shouldReduceMotion.value ? 0 : 200 })
```

```ts
function useReducedMotion(options?: UseMediaQueryOptions): {
  shouldReduceMotion: ComputedRef<boolean>
  prefersReducedMotion: Ref<boolean>
  isSupported: boolean
}
```

<script lang="ts" setup>
import { useMediaQuery } from 'maz-ui/composables/useMediaQuery'

const { matches: isWide } = useMediaQuery('(min-width: 1024px)')
const { matches: isLandscape } = useMediaQuery(() => '(orientation: landscape)')
const { matches: isDark } = useMediaQuery('(prefers-color-scheme: dark)')
</script>
