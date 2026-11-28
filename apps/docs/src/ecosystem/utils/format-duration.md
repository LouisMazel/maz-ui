---
title: formatDuration
description: Format a duration in seconds or milliseconds (`12 s`, `3 min 05 s`, `1 h 02 min`) in any locale, with the native api Intl.NumberFormat. No translation is embedded in the module.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { formatDuration } from '@maz-ui/utils/helpers/formatDuration'

formatDuration(12, { locale: 'fr' }) // '12 s'
formatDuration(185, { locale: 'fr' }) // '3 min 05 s'
formatDuration(3725, { locale: 'fr' }) // '1 h 02 min'
formatDuration(185, { locale: 'en' }) // '3 min 05 sec'
formatDuration(1500, { inputUnit: 'millisecond' }) // '2 sec' (in english)
formatDuration(250, { inputUnit: 'millisecond' }) // '250 ms'
```

The units are days, hours, minutes and seconds, or milliseconds under one second. Zero units at the end are dropped (`1 h` and not `1 h 00 min`).

## API

```ts
function formatDuration(value: number, options?: FormatDurationOptions): string
```

| Option      | Type                            | Default                         | Description                                                        |
| ----------- | ------------------------------- | ------------------------------- | ------------------------------------------------------------------ |
| `locale`    | `string`                        | browser locale                  | Any BCP 47 locale (`fr`, `en-US`, `ja`)                            |
| `inputUnit` | `'second' \| 'millisecond'`     | `'second'`                      | Unit of `value`                                                    |
| `style`     | `'long' \| 'short' \| 'narrow'` | `'short'`                       | `3 minutes`, `3 min`, `3m` (depends on the locale)                 |
| `precision` | `number`                        | `2`                             | Maximum number of units, from the largest non-zero one             |
| `pad`       | `boolean`                       | `true` unless `style` is `long` | Pad the units after the first one on two digits (`05`)             |

The last unit shown is rounded (`precision: 1` gives `1 h` for `3725` seconds). A negative value is prefixed with `-`, a value that is not finite gives zero.

## Related

- [`formatRelativeTime`](./relative-time): the delay between a date and now (`3 minutes ago`).
- [`useTimer`](../../composables/use-timer): a countdown with the remaining time.
