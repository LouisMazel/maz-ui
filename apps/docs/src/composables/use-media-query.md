---
title: useMediaQuery
description: Reactive result of a CSS media query, updated when it changes. SSR safe. Includes useReducedMotion for the prefers-reduced-motion preference.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it instead of `window.matchMedia` by hand. For the breakpoints of the theme, use [useBreakpoints](./use-breakpoints).

## Usage

```ts
import { useMediaQuery } from 'maz-ui/composables/useMediaQuery'

const { matches: isWide } = useMediaQuery('(min-width: 1024px)')
const { matches: isLandscape } = useMediaQuery(() => '(orientation: landscape)')
```

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
