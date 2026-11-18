---
title: useBreakpoints
description: This composable extends the functionality of the useWindowSize composable to manage responsive breakpoints
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

```ts
const breakpoints = {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}

const {
  isLargeScreen,
  isMediumScreen,
  isSmallScreen,
} = useBreakpoints({
  breakpoints,
  initialWidth: 0,
  mediumBreakPoint: 'md',
  largeBreakPoint: 'lg',
})
```

## Use the maz-ui breakpoints

To use the same thresholds as the `mob-*`, `tab-*` and `lap-*` Tailwind variants, feed the composable with `screens` (the scale of maz-ui, in `px` strings). `getNumericScreensFromTailwind` converts such a scale to numbers: `useBreakpoints` calls it for you, use it only when you need the numeric values yourself.

```ts
import { useBreakpoints } from 'maz-ui/composables/useBreakpoints'
import { getNumericScreensFromTailwind, screens } from 'maz-ui/tailwindcss'

const { isSmallScreen, isMediumScreen, isLargeScreen, numericBreakpoints } = useBreakpoints({
  breakpoints: screens,
  mediumBreakPoint: 'tab-m',
  largeBreakPoint: 'lap-s',
})

const thresholds = getNumericScreensFromTailwind(screens)
// { 'mob-s': 320, 'mob-m': 425, ..., 'tab-m': 768, 'lap-s': 1024, ... }
```

See [Breakpoints](./../guide/tailwind.md#breakpoints) for the scale.

::: warning
More documentation to come
:::
