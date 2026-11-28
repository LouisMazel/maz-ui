---
title: diffLines
description: Line by line diff of two texts (Myers algorithm) with the numbers of the lines, the counts of added and removed lines, and a fold of the unchanged lines.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

It powers the [`diff` prop of MazCodeHighlight](/components/maz-code-highlight#diff), and is useful alone: a change preview, a config diff, a test of what a function changed.

## Usage

```ts
import { diffLines } from '@maz-ui/utils/helpers/diffLines'

diffLines('a\nb\nc', 'a\nx\nc')
// [
//   { type: 'same', text: 'a', oldLine: 1, newLine: 1 },
//   { type: 'remove', text: 'b', oldLine: 2 },
//   { type: 'add', text: 'x', newLine: 2 },
//   { type: 'same', text: 'c', oldLine: 3, newLine: 3 },
// ]
```

Each line has a `type` (`same`, `add` or `remove`), its `text` and its 1-based numbers: `oldLine` (not on an added line) and `newLine` (not on a removed line). The result is the shortest list of changes, as `git diff` computes it. Line breaks (`\n`, `\r\n`) and the final line break are ignored.

The lines common to the start and to the end of both texts are skipped first, so a small change in a big text is cheap.

## Options

```ts
diffLines(before, after, {
  ignoreWhitespace: true,
  maxEditDistance: 4000,
})
```

- `ignoreWhitespace` (default `false`): lines that only differ by their whitespace are the same.
- `maxEditDistance` (default `4000`): the number of added plus removed lines the search goes to. Past it (huge texts with little in common), the lines between the common start and the common end are all reported as removed then added. It bounds the time and the memory.

## Count the changes

```ts
import { diffLines, diffStats } from '@maz-ui/utils/helpers/diffLines'

diffStats(diffLines('a\nb', 'a\nc\nd'))
// { additions: 2, deletions: 1 }
```

## Fold the unchanged lines

`foldDiff` keeps `context` (default `3`) unchanged lines around each change and replaces the others by a gap, which keeps the hidden lines in `lines` to show them again.

```ts
import { diffLines, foldDiff } from '@maz-ui/utils/helpers/diffLines'

foldDiff(diffLines(before, after), 2)
// [
//   { type: 'gap', lines: [...] },
//   { type: 'same', ... },
//   { type: 'remove', ... },
//   { type: 'add', ... },
//   { type: 'gap', lines: [...] },
// ]
```

## Types

```ts
type DiffLineType = 'same' | 'add' | 'remove'

interface DiffLine {
  type: DiffLineType
  text: string
  oldLine?: number
  newLine?: number
}

interface DiffGap {
  type: 'gap'
  lines: DiffLine[]
}

type DiffRow = DiffLine | DiffGap
```
