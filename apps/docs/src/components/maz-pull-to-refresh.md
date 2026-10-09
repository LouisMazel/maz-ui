---
title: MazPullToRefresh
description: MazPullToRefresh adds a native-feeling pull to refresh gesture to your app or to any scroll container, with a progress ring, haptic feedback and translated, accessible feedback.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Key Features

- Works on the window **and on any scroll container**: the closest scrollable ancestor is detected automatically, so it fits app shells with a fixed layout and a scrolling `<main>`
- Starts only when the container is scrolled to the top, never in the middle of a list
- Rubber band resistance beyond the trigger distance, and a progress ring that fills while pulling
- Ignores horizontal swipes and multi-touch gestures, and prevents the native bounce (and the browser's own pull to refresh) while pulling
- Haptic feedback when the trigger distance is reached (devices supporting `navigator.vibrate`)
- Texts from [@maz-ui/translations](./../ecosystem/translations.md), overridable with the `translations` prop or the slots
- Accessible: the refresh is announced to screen readers, `aria-busy` is set while refreshing, and `refresh()` is exposed for a button usable with a keyboard or a mouse
- Optional `standalone-mode` to enable it only in an installed PWA (browsers already have their own pull to refresh)
- Built on the headless [usePullToRefresh](./../composables/use-pull-to-refresh.md) composable

## Demo

<div class="maz:flex maz:flex-col maz:items-center maz:gap-3 vp-raw">
  <p class="maz:text-sm maz:text-muted">
    Pull down inside the box on a touch device (or with the touch emulation of your browser's device toolbar).
  </p>
  <div class="maz:h-80 maz:w-full maz:max-w-sm maz:overflow-y-auto maz:rounded-lg maz:border maz:border-divider maz:bg-container">
    <MazPullToRefresh ref="demo" :on-refresh="refreshDemo">
      <ul class="maz:m-0 maz:list-none maz:p-0">
        <li v-for="item in items" :key="item" class="maz:border-b maz:border-divider maz:px-4 maz:py-3">
          {{ item }}
        </li>
      </ul>
    </MazPullToRefresh>
  </div>
  <MazBtn size="sm" :loading="demo?.isRefreshing" @click="demo?.refresh()">
    Refresh ({{ refreshCount }})
  </MazBtn>
</div>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'

const demo = useTemplateRef('demo')
const refreshCount = ref(0)
const items = ref(Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`))

async function refreshDemo() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  refreshCount.value++
  items.value = [`New item ${refreshCount.value}`, ...items.value]
}
</script>

## Basic usage

Wrap your app (or a page) inside the component and give it the function that reloads your data. The spinner stays visible until the returned promise settles.

```vue
<script lang="ts" setup>
import MazPullToRefresh from 'maz-ui/components/MazPullToRefresh'

async function refresh() {
  await fetchData()
}
</script>

<template>
  <MazPullToRefresh :on-refresh="refresh">
    <main>App content</main>
  </MazPullToRefresh>
</template>
```

With Nuxt, `refreshNuxtData` reloads every `useFetch` / `useAsyncData` of the page:

```vue
<template>
  <MazPullToRefresh :on-refresh="() => refreshNuxtData()" standalone-mode>
    <NuxtPage />
  </MazPullToRefresh>
</template>
```

## Inside a scroll container

The pull can only start when its scroll container is at the top. By default, the component uses its **closest scrollable ancestor** (`overflow-y: auto | scroll`), or the window if there is none. Typical app shells with a fixed layout and a scrolling `<main>` work without configuration:

```vue
<template>
  <div class="app-shell maz:fixed maz:inset-0 maz:flex maz:flex-col">
    <header>…</header>
    <main class="maz:flex-1 maz:overflow-y-auto">
      <MazPullToRefresh :on-refresh="refresh">
        <slot />
      </MazPullToRefresh>
    </main>
  </div>
</template>
```

Use `container-selector` when the scroll container is not an ancestor of the component:

```vue
<template>
  <MazPullToRefresh container-selector="#page-scroller" :on-refresh="refresh">
    …
  </MazPullToRefresh>
</template>
```

## Installed apps only

Browsers already provide their own pull to refresh. With `standalone-mode`, the component is only active when the app runs as an installed PWA (`display-mode: standalone`):

```vue
<template>
  <MazPullToRefresh standalone-mode :on-refresh="refresh">
    …
  </MazPullToRefresh>
</template>
```

## Tuning the gesture

| Prop           | Default          | Effect                                                                                  |
| -------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `distance`     | `80`             | Pull distance (px, after resistance) needed to trigger a refresh                        |
| `max-distance` | `distance * 1.6` | Upper bound of the rubber band beyond `distance`                                        |
| `resistance`   | `0.5`            | Ratio between the finger movement and the pull distance (lower is stiffer)              |
| `min-duration` | `400`            | Minimum duration (ms) of the refreshing state, so fast refreshes still show the feedback |
| `haptic`       | `true`           | Short vibration when `distance` is reached                                              |

## Customize the indicator

The three states have their own slot. Each one receives the pull `progress` (0 to 1) and the current `distance` in px.

```vue
<template>
  <MazPullToRefresh :on-refresh="refresh" header-class="maz:bg-surface-600">
    <template #pull-before="{ progress }">
      <span>{{ Math.round(progress * 100) }}%</span>
    </template>
    <template #pull-ready>
      <span>Let go!</span>
    </template>
    <template #pull-loading>
      <MazSpinner color="secondary" />
    </template>

    <main>App content</main>
  </MazPullToRefresh>
</template>
```

`spinner-color` sets the color of the progress ring, the ready arrow and the default spinner (`primary` by default).

## Translations

Texts come from [@maz-ui/translations](./../ecosystem/translations.md) (`pullToRefresh.pull`, `pullToRefresh.release`, `pullToRefresh.refreshing`). Override them per instance with the `translations` prop:

```vue
<template>
  <MazPullToRefresh
    :on-refresh="refresh"
    :translations="{ pull: 'Swipe down', release: 'Release', refreshing: 'Updating…' }"
  >
    …
  </MazPullToRefresh>
</template>
```

## Accessibility

The gesture is touch only. To give keyboard and mouse users the same action, call the exposed `refresh()` from a button: the indicator and the events behave exactly as with the gesture.

```vue
<script lang="ts" setup>
import { useTemplateRef } from 'vue'

const pullToRefresh = useTemplateRef('pullToRefresh')
</script>

<template>
  <MazBtn :loading="pullToRefresh?.isRefreshing" @click="pullToRefresh?.refresh()">
    Refresh
  </MazBtn>

  <MazPullToRefresh ref="pullToRefresh" :on-refresh="refresh">
    …
  </MazPullToRefresh>
</template>
```

While refreshing, the root element has `aria-busy="true"` and the refreshing text is announced through a polite live region. The visual indicator is hidden from assistive technologies.

## Events

The events follow the life of a refresh: `start`, then `loaded` and `response` (with the value resolved by `on-refresh`) or `error`, and always `finish`. An error thrown by `on-refresh` is emitted, never thrown again.

## Headless usage

Need a different indicator, or a gesture on an element without wrapping it? Use the [usePullToRefresh](./../composables/use-pull-to-refresh.md) composable.

<!--@include: ./../../.vitepress/generated-docs/maz-pull-to-refresh.doc.md-->
