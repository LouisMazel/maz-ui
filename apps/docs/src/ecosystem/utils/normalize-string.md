---
title: normalizeString
description: Powerful string normalizer — strip accents, normalize whitespace, remove special characters, change case, and apply Unicode normalization forms.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The Swiss-army knife for turning user input into a safe, comparable, slug-ready string.

## Usage

```ts
import { normalizeString } from '@maz-ui/utils'

normalizeString('  Crème Brûlée  ')
// → 'creme-brulee'

normalizeString('Élégant Café', { case: 'kebab-case' })
// → 'elegant-cafe'

normalizeString('My Article Title!', {
  case: 'kebab-case',
  removeSpecialCharacters: true,
})
// → 'my-article-title'
```

## API

```ts
function normalizeString(
  input: string | number | boolean,
  options?: NormalizeStringOptions,
): string
```

### Options

| Option                     | Type         | Default            | Description                                                                                  |
| -------------------------- | ------------ | ------------------ | -------------------------------------------------------------------------------------------- |
| `removeAccents`            | `boolean`    | `true`             | Strip diacritics (`é → e`, `ç → c`, …)                                                       |
| `caseSensitive`            | `boolean`    | `false`            | When `false`, lowercases the result unless `case` is set                                     |
| `replaceSpaces`            | `boolean`    | `true`             | Replace spaces with `-`                                                                      |
| `removeSpecialCharacters`  | `boolean`    | `false`            | Strip non-alphanumeric / non-dash characters (Latin alphabet only)                           |
| `trim`                     | `boolean`    | `true`             | Trim leading/trailing whitespace                                                             |
| `normalizeSpaces`          | `boolean`    | `true`             | Collapse runs of whitespace into a single space                                              |
| `removeNumbers`            | `boolean`    | `false`            | Strip digits                                                                                 |
| `case`                     | `CaseFormat` | `undefined`        | Force a target case: `kebab-case`, `camelCase`, `PascalCase`, `snake_case`, `lowercase`, `UPPERCASE` |
| `customNormalizationForms` | `string[]`   | `['NFC', 'NFKD']`  | Unicode [normalization forms](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) applied at the end |

## Examples

Generate a URL-safe slug:

```ts
const slug = normalizeString(post.title, {
  case: 'kebab-case',
  removeSpecialCharacters: true,
})
```

Build a case-insensitive comparison key:

```ts
const a = normalizeString('Éléphant')
const b = normalizeString('elephant')
a === b // true
```

Preserve original casing but strip diacritics:

```ts
normalizeString('Crème Brûlée', { caseSensitive: true, replaceSpaces: false })
// → 'Creme Brulee'
```
