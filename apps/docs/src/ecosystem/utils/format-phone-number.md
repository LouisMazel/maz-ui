---
title: formatPhoneNumber
description: Format an arbitrary phone-number string into its international representation using `libphonenumber-js`.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

If the input can't be parsed, the original string is returned unchanged.

## Usage

```ts
import { formatPhoneNumber } from '@maz-ui/utils'

formatPhoneNumber('+33612345678') // → '+33 6 12 34 56 78'
formatPhoneNumber('0612345678') // → '0612345678' (unparseable without country context — returned as-is)
```

## API

```ts
function formatPhoneNumber(phoneNumber: string): string
```

| Parameter     | Type     | Description                              |
| ------------- | -------- | ---------------------------------------- |
| `phoneNumber` | `string` | The phone number to format (E.164 ideal) |

Throws a `TypeError` when `phoneNumber` is empty.

## Notes

- For maximum portability, supply the input in E.164 (`+CCXXXXXXXXX`). Otherwise, parsing falls back to passing the input through unchanged.
- For interactive phone-number input with country selection, see the [`MazInputPhoneNumber`](/components/maz-input-phone-number) component.
- Built on [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js).
