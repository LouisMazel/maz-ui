---
title: Desktop apps (Tauri, Electron)
description: Open the links of Maz-UI components in the system browser instead of the WebView of a Tauri or Electron app, with one global option.
head:
  - - meta
    - name: keywords
      content: tauri, electron, webview, open links in the system browser, external links, openExternal, shell.openExternal, desktop app, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

In a WebView, a click on an external link navigates the app itself. Set `openExternal` once and every Maz-UI component with an `href` calls it instead, with the navigation prevented.

## Vue

Pass `openExternal` to the `MazUi` plugin:

```ts
import { openUrl } from '@tauri-apps/plugin-opener'
import { MazUi } from 'maz-ui/plugins/maz-ui'

app.use(MazUi, {
  theme: { preset: mazUi },
  openExternal: href => openUrl(href),
})
```

With Electron, call your own bridge: `openExternal: href => window.api.openExternal(href)` (`shell.openExternal` in the main process).

[`MazUiProvider`](./maz-ui-provider.md) takes the same props: `<MazUiProvider :open-external="openUrl" ... />`.

## Nuxt

A function cannot go through the module options: give the path of a file whose default export is the function.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  mazUi: {
    openExternal: '~/utils/open-external',
  },
})
```

```ts
// utils/open-external.ts
import { openUrl } from '@tauri-apps/plugin-opener'

export default function openExternal(href: string) {
  return openUrl(href)
}
```

Nothing is added to your build unless the option is set.

## Which links are external?

By default: the absolute `http(s)` URLs of another origin, and every link with `target="_blank"`. Relative links, anchors, `mailto:` and router links (`to`) are never touched.

Replace the rule with `isExternalLink`:

```ts
app.use(MazUi, {
  theme: { preset: mazUi },
  openExternal: href => openUrl(href),
  isExternalLink: (href, target) => target === '_blank' || href.startsWith('https://docs.my-app.com'),
})
```

The external icon of [MazLink](/components/maz-link#external-icon-true-by-default) (`auto-external`) follows the same rule, not only `target="_blank"`.

## Which components?

`MazLink`, `MazBtn` (and so `MazBtnGroup`, `MazDropdown` items), `MazCard`, `MazAvatar`, `MazListItem`, `MazSidebarMenuButton` and the links of `MazMarkdown`. For `MazMarkdown`, `link-click` is emitted first: call `event.preventDefault()` in it to handle a link yourself.

::: tip No more hand-made buttons
Do not wrap a `MazLink as="button"` with a click that calls `open` or `shell.openExternal`: keep the `href` and set the option once.
:::
