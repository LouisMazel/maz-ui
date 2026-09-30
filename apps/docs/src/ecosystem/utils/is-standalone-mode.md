---
title: isStandaloneMode
description: Check whether the app is running as an installed Progressive Web App (PWA) rather than inside a browser tab.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isStandaloneMode } from '@maz-ui/utils'

if (isStandaloneMode()) {
  console.log('Running as installed PWA')
}
```

## API

```ts
function isStandaloneMode(): boolean
```

Returns `true` if the page is rendered in standalone display mode, `false` otherwise (including during SSR).

## Detection rules

The check returns `true` when **either**:

- `window.matchMedia('(display-mode: standalone)').matches` — covers Chrome, Edge, Firefox, etc.
- `navigator.standalone` is truthy — iOS Safari's legacy property.

## Examples

Hide install prompts when already installed:

```ts
if (!isStandaloneMode()) {
  showInstallBanner()
}
```
