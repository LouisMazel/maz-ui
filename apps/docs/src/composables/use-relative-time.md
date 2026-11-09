---
title: useRelativeTime
description: The useRelativeTime composable returns a reactive, localized relative time (`3 minutes ago`, `in 2 days`) that refreshes itself at the right moment, with a single timer. It is built on the formatRelativeTime helper and the native Intl API, so every locale is supported.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<div class="maz:flex maz:flex-col maz:gap-4 maz:items-start">
  <MazSelect
    v-model="locale"
    label="Locale"
    :options="[
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ar', label: 'Arabic' },
    ]"
  />
  <MazBtn @click="date = Date.now()">
    Set the date to now
  </MazBtn>
  <p>
    Last update: <strong :title="title">{{ text }}</strong>
    (unit: {{ unit ?? 'none' }})
  </p>
</div>

```vue
<script lang="ts" setup>
import { useRelativeTime } from 'maz-ui/composables/useRelativeTime'
import { ref } from 'vue'

const locale = ref('en')
const date = ref(Date.now() - 20 * 1000)

const { text, title, unit } = useRelativeTime(date, { locale })
</script>

<template>
  <MazSelect
    v-model="locale"
    label="Locale"
    :options="[
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ar', label: 'Arabic' },
    ]"
  />
  <MazBtn @click="date = Date.now()">
    Set the date to now
  </MazBtn>
  <p>
    Last update: <strong :title="title">{{ text }}</strong>
  </p>
</template>
```

## How it updates

The composable does not run a permanent `setInterval`. After each computation it asks the helper when the text will change next and schedules one `setTimeout` for that moment:

- every second under a minute,
- then at each minute, hour, day... change,
- and no timer at all when the text can no longer change (an absolute date in the past).

The timer is rescheduled when the date, the locale or the options change, cleared when the scope is disposed (component unmounted, `effectScope` stopped), and never created on the server.

When the page is hidden (see [useUserVisibility](./use-user-visibility)), the timer is paused. The text is refreshed as soon as the page is visible again. Set `pauseWhenHidden: false` to keep it running.

## Reactive inputs

The date and the options accept refs, getters and plain values (`MaybeRefOrGetter`), and so does each option `locale`, `now` and `autoUpdate`.

```ts
const date = ref('2024-06-15T10:00:00Z')

const { text } = useRelativeTime(date, () => ({
  locale: currentLocale.value,
  format: 'compact',
}))
```

A missing (`null`, `undefined`, empty string) or invalid date gives an empty `text` (an invalid date also logs a warning).

## Locale

The locale is resolved in this order:

1. the `locale` option,
2. the locale of [@maz-ui/translations](../ecosystem/translations) when its plugin is installed (so the text follows `setLocale`),
3. the locale of the browser, then the locale of the runtime.

## Disable the auto update

```ts
const { text, refresh } = useRelativeTime(date, { autoUpdate: false })

refresh() // recompute now
```

Giving a `now` option also disables the auto update: the reference date is yours.

## Absolute date and title

Use the helper options to switch to an absolute date, and `title` for a tooltip with the full date.

```vue
<script lang="ts" setup>
const { text, title } = useRelativeTime(date, {
  absoluteAfter: 7 * 24 * 60 * 60 * 1000,
  absoluteOptions: { dateStyle: 'medium' },
  titleOptions: { dateStyle: 'full', timeStyle: 'short' },
})
</script>

<template>
  <time :title="title">{{ text }}</time>
</template>
```

## Options

All the options of [formatRelativeTime](../ecosystem/utils/relative-time) (`format`, `style`, `numeric`, `thresholds`, `absoluteAfter`, `absoluteOptions`) are available, plus:

| Option            | Type                                   | Default                                    | Description                                          |
| ----------------- | -------------------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `locale`          | `MaybeRefOrGetter<string \| undefined>` | translations locale, then browser locale   | Any BCP 47 locale                                    |
| `now`             | `MaybeRefOrGetter<Date \| number \| undefined>` | `Date.now()`                      | Fixed reference date, disables the auto update       |
| `autoUpdate`      | `MaybeRefOrGetter<boolean>`            | `true`                                     | Refresh the text when it changes                     |
| `pauseWhenHidden` | `boolean`                              | `true`                                     | Pause the timer while the page is hidden             |
| `titleOptions`    | `Intl.DateTimeFormatOptions`           | `{ dateStyle: 'long', timeStyle: 'short' }` | Format of the `title`                                |

## Return

| Property  | Type                                      | Description                                                       |
| --------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `text`    | `ComputedRef<string>`                     | The relative time, empty when the date is missing or invalid      |
| `title`   | `ComputedRef<string>`                     | The full localized date, for a `title` attribute                  |
| `unit`    | `ComputedRef<RelativeTimeUnit \| null>`   | The chosen unit, `null` for `now`, an absolute date or no date    |
| `result`  | `ComputedRef<RelativeTimeResult \| undefined>` | The detailed result of `getRelativeTime`                     |
| `refresh` | `() => void`                              | Recompute now and reschedule the timer                            |

## Types

```ts
interface UseRelativeTimeOptions extends Omit<RelativeTimeOptions, 'locale' | 'now'> {
  locale?: MaybeRefOrGetter<string | undefined>
  now?: MaybeRefOrGetter<Date | number | undefined>
  autoUpdate?: MaybeRefOrGetter<boolean>
  pauseWhenHidden?: boolean
  titleOptions?: Intl.DateTimeFormatOptions
}

function useRelativeTime(
  date: MaybeRefOrGetter<Date | string | number | null | undefined>,
  options?: MaybeRefOrGetter<UseRelativeTimeOptions | undefined>,
): UseRelativeTimeReturn
```

<script lang="ts" setup>
  import { useRelativeTime } from 'maz-ui/composables/useRelativeTime'
  import { ref } from 'vue'

  const locale = ref('en')
  const date = ref(Date.now() - 20 * 1000)

  const { text, title, unit } = useRelativeTime(date, { locale })
</script>
