---
title: formatRelativeTime
description: The module formatRelativeTime formats the delay between a date and now (`3 minutes ago`, `in 2 days`, `yesterday`) in any locale, with the native apis [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) and [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat). No translation is embedded in the module.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

> All the texts come from `Intl`: any [BCP 47](https://www.rfc-editor.org/info/bcp47) locale supported by the browser or Node.js works. To keep a date up to date on screen, use the [useRelativeTime](../../composables/use-relative-time) composable.

<div class="vp-raw maz:flex maz:flex-col maz:gap-4 maz:items-start">
  <MazSelect
    v-model="locale"
    label="Locale"
    :options="[
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ar', label: 'Arabic' },
      { value: 'de', label: 'German' },
    ]"
  />
  <MazSelect
    v-model="format"
    label="Format"
    :options="[
      { value: 'relative', label: 'relative (3 minutes ago)' },
      { value: 'compact', label: 'compact (3 min)' },
    ]"
  />
</div>

<div
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-surface-300);"
  class="maz:flex maz:flex-col maz:gap-1 maz:rounded-md"
>
  <div v-for="sample in samples" :key="sample.label">
    {{ sample.label }}: <strong>{{ sample.text }}</strong>
  </div>
</div>

```vue
<script lang="ts" setup>
import { formatRelativeTime } from '@maz-ui/utils/helpers/formatRelativeTime'
import { computed, ref } from 'vue'

const locale = ref('en')
const format = ref<'relative' | 'compact'>('relative')

const now = Date.now()

const samples = computed(() => [
  { label: '30 seconds ago', date: now - 30 * 1000 },
  { label: '3 minutes ago', date: now - 3 * 60 * 1000 },
  { label: '1 day ago', date: now - 24 * 60 * 60 * 1000 },
  { label: 'in 2 days', date: now + 2 * 24 * 60 * 60 * 1000 + 1000 },
  { label: '2 years ago', date: now - 800 * 24 * 60 * 60 * 1000 },
].map(({ label, date }) => ({
  label,
  text: formatRelativeTime(date, { locale: locale.value, format: format.value, now }),
})))
</script>
```

## Usage

```ts
import { formatRelativeTime } from '@maz-ui/utils/helpers/formatRelativeTime'

const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

formatRelativeTime(fiveMinutesAgo, { locale: 'en' }) // '5 minutes ago'
formatRelativeTime(fiveMinutesAgo, { locale: 'fr' }) // 'il y a 5 minutes'
formatRelativeTime(fiveMinutesAgo, { locale: 'ja' }) // '5 分前'
```

The date can be a `Date`, an ISO string or a timestamp. Without `locale`, the locale of the browser is used (see [getBrowserLocale](./get-browser-locale)), then the locale of the runtime.

## Compact format

The `compact` format returns the bare quantity without direction, like a messaging app does. It uses `Intl.NumberFormat` with the `unit` style, so it is localized too.

```ts
formatRelativeTime(fiveMinutesAgo, { locale: 'en', format: 'compact' }) // '5 min'
formatRelativeTime(fiveMinutesAgo, { locale: 'en', format: 'compact', style: 'narrow' }) // '5m'
formatRelativeTime(fiveMinutesAgo, { locale: 'fr', format: 'compact' }) // '5 min'
```

## Now

Under `thresholds.now` seconds (5 by default), in the past and in the future, the localized word for now is returned (`now`, `maintenant`, `今`), whatever the format.

## Absolute date

With `absoluteAfter`, a date too far from now is formatted as an absolute date with [formatDate](./date) instead.

```ts
const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

formatRelativeTime(lastMonth, {
  locale: 'en',
  absoluteAfter: 7 * 24 * 60 * 60 * 1000,
  absoluteOptions: { dateStyle: 'medium' },
}) // 'May 16, 2024'
```

## Thresholds

The unit is chosen with thresholds: a unit is used while the delay, expressed in this unit, is under its threshold. A threshold set to `0` skips the unit.

| Threshold | Default | Meaning                                        |
| --------- | ------- | ---------------------------------------------- |
| `now`     | `5`     | seconds under which `now` is displayed         |
| `second`  | `60`    | seconds are used under 60 seconds              |
| `minute`  | `60`    | minutes are used under 60 minutes              |
| `hour`    | `24`    | hours are used under 24 hours                  |
| `day`     | `7`     | days are used under 7 days                     |
| `week`    | `4`     | weeks are used under 4 weeks                   |
| `month`   | `12`    | months are used under 12 months, then years    |

```ts
// Days up to 30 days, no weeks
formatRelativeTime(date, { thresholds: { day: 30, week: 0 } })
```

The quantity is rounded down (`119 seconds` is `1 minute ago`) and is at least 1. A month lasts 30 days and a year 365 days.

## Details and next update

`getRelativeTime` returns the same text with details, including the time before the text changes. It is what [useRelativeTime](../../composables/use-relative-time) uses to schedule one timer at the right moment.

```ts
import { getRelativeTime } from '@maz-ui/utils/helpers/formatRelativeTime'

const result = getRelativeTime(new Date(Date.now() - 2 * 60 * 1000 - 20 * 1000), { locale: 'en' })

result.text // '2 minutes ago'
result.unit // 'minute'
result.value // -2
result.nextUpdateIn // 40000 (ms)
```

## Performance

`Intl.RelativeTimeFormat` and `Intl.NumberFormat` instances are expensive to create: they are memoized by locale and options, so calling the helper for each item of a list is cheap. The absolute date goes through [formatDate](./date), which is not memoized.

## Types

```ts
type RelativeTimeInput = Date | string | number

type RelativeTimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

interface RelativeTimeOptions {
  /**
   * Any BCP 47 locale (e.g. `fr`, `en-US`, `ja`)
   * @default getBrowserLocale() ?? runtime locale
   */
  locale?: string
  /**
   * Reference date (useful for tests and SSR)
   * @default Date.now()
   */
  now?: Date | number
  /**
   * `relative` returns a sentence (`3 minutes ago`), `compact` returns the bare quantity (`3 min`)
   * @default 'relative'
   */
  format?: 'relative' | 'compact'
  /**
   * Length of the units
   * @default 'long' for the `relative` format, 'short' for the `compact` format
   */
  style?: 'long' | 'short' | 'narrow'
  /**
   * `auto` uses idiomatic words when they exist (`yesterday`), `always` always uses a number.
   * Only used by the `relative` format
   * @default 'auto'
   */
  numeric?: 'always' | 'auto'
  /**
   * Thresholds used to choose the unit. A threshold set to `0` skips its unit
   */
  thresholds?: RelativeTimeThresholds
  /**
   * Delay in milliseconds (past or future) from which the absolute date is returned
   * @default undefined (never)
   */
  absoluteAfter?: number
  /**
   * Options of `Intl.DateTimeFormat` used for the absolute date
   * @default formatDate defaults (`Feb 1, 2022`)
   */
  absoluteOptions?: Intl.DateTimeFormatOptions
}

interface RelativeTimeResult {
  text: string
  /** `now`, `relative` or `absolute` */
  kind: 'now' | 'relative' | 'absolute'
  /** The chosen unit, `null` when the kind is `now` or `absolute` */
  unit: RelativeTimeUnit | null
  /** Quantity of `unit`, negative in the past, positive in the future */
  value: number
  isFuture: boolean
  date: Date
  /** The locale used to format */
  locale: string
  /** Milliseconds before `text` can change, `null` when it never changes */
  nextUpdateIn: number | null
}

function formatRelativeTime(date: RelativeTimeInput, options?: RelativeTimeOptions): string

function getRelativeTime(date: RelativeTimeInput, options?: RelativeTimeOptions): RelativeTimeResult
```

<script lang="ts" setup>
  import { formatRelativeTime } from '@maz-ui/utils/helpers/formatRelativeTime'
  import { computed, ref } from 'vue'

  const locale = ref('en')
  const format = ref<'relative' | 'compact'>('relative')

  const now = Date.now()

  const samples = computed(() => [
    { label: '30 seconds ago', date: now - 30 * 1000 },
    { label: '3 minutes ago', date: now - 3 * 60 * 1000 },
    { label: '1 day ago', date: now - 24 * 60 * 60 * 1000 },
    { label: 'in 2 days', date: now + 2 * 24 * 60 * 60 * 1000 + 1000 },
    { label: '2 years ago', date: now - 800 * 24 * 60 * 60 * 1000 },
  ].map(({ label, date }) => ({
    label,
    text: formatRelativeTime(date, { locale: locale.value, format: format.value, now }),
  })))
</script>
