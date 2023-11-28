---
title: useWindowSize
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

::: warning
  More documentation to come
:::
