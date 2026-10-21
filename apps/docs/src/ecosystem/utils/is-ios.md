---
title: isIos
description: Check whether the page runs on iOS or iPadOS, including iPads that report a desktop Mac user agent.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isIos } from '@maz-ui/utils'

if (isIos()) {
  console.log('Running on iOS')
}
```

## API

```ts
function isIos(): boolean
```

Returns `true` on iPhone, iPad and iPod, `false` otherwise (including during SSR).

## Detection rules

The check returns `true` when **either**:

- the user agent contains `iPhone`, `iPad` or `iPod`;
- the user agent contains `Macintosh` and the device has touch support (`navigator.maxTouchPoints > 1`) - iPadOS 13+ reports a desktop Mac user agent by default.

::: tip
Prefer feature detection when it exists (`CSS.supports`, `matchMedia`...). Use `isIos` for behaviors that are specific to the platform, like [preventIosInputZoom](./prevent-ios-input-zoom.md).
:::
