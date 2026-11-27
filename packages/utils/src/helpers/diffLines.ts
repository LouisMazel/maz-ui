export type DiffLineType = 'same' | 'add' | 'remove'

export interface DiffLine {
  /** `same`: in both texts, `add`: only in the new one, `remove`: only in the old one */
  type: DiffLineType
  text: string
  /** 1-based line number in the old text (absent for an added line) */
  oldLine?: number
  /** 1-based line number in the new text (absent for a removed line) */
  newLine?: number
}

export interface DiffLinesOptions {
  /**
   * Ignore the whitespace differences (indentation, trailing spaces, repeated spaces) when comparing lines.
   * @default false
   */
  ignoreWhitespace?: boolean
  /**
   * Maximum number of added plus removed lines the algorithm looks for before giving up: past it, the lines left
   * between the common start and the common end are all reported as removed then added. It bounds the time and the
   * memory used on huge texts that have little in common.
   * @default 4000
   */
  maxEditDistance?: number
}

export interface DiffStats {
  additions: number
  deletions: number
}

export interface DiffGap {
  type: 'gap'
  /** Unchanged lines hidden by the fold, in order */
  lines: DiffLine[]
}

export type DiffRow = DiffLine | DiffGap

type Edit = 'same' | 'add' | 'remove'

function splitLines(text: string): string[] {
  if (text === '')
    return []
  const lines = text.split(/\r\n|\r|\n/)
  if (lines.at(-1) === '')
    lines.pop()
  return lines
}

function shortestEdit(a: string[], b: string[], maxEditDistance: number): Edit[] | undefined {
  const n = a.length
  const m = b.length
  const max = Math.min(n + m, maxEditDistance)
  const offset = max + 1
  const v = new Int32Array(2 * max + 3)
  const trace: Int32Array[] = []

  for (let d = 0; d <= max; d++) {
    trace.push(v.slice(offset - d, offset + d + 1))
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && v[offset + k - 1]! < v[offset + k + 1]!)
        ? v[offset + k + 1]!
        : v[offset + k - 1]! + 1
      let y = x - k
      while (x < n && y < m && a[x] === b[y]) {
        x++
        y++
      }
      v[offset + k] = x
      if (x >= n && y >= m)
        return backtrack(trace, d, n, m)
    }
  }

  return undefined
}

function backtrack(trace: Int32Array[], distance: number, n: number, m: number): Edit[] {
  const edits: Edit[] = []
  let x = n
  let y = m

  for (let d = distance; d > 0; d--) {
    const previous = trace[d]!
    const read = (k: number) => previous[k + d]!
    const k = x - y
    const previousK = k === -d || (k !== d && read(k - 1) < read(k + 1))
      ? k + 1
      : k - 1
    const previousX = read(previousK)
    const previousY = previousX - previousK

    while (x > previousX && y > previousY) {
      edits.push('same')
      x--
      y--
    }
    edits.push(x === previousX
      ? 'add'
      : 'remove')
    x = previousX
    y = previousY
  }

  while (x > 0 && y > 0) {
    edits.push('same')
    x--
    y--
  }

  return edits.reverse()
}

function normalizeWhitespace(line: string): string {
  return line.trim().replace(/\s+/g, ' ')
}

/**
 * Line by line diff of two texts, with the Myers algorithm (the one of git): the shortest list of added and
 * removed lines, each line with its number in the old and the new text. The lines common to the start and the end of
 * both texts are skipped first, so a small change in a big text is cheap.
 *
 * @example
 * diffLines('a\nb', 'a\nc')
 * // [
 * //   { type: 'same', text: 'a', oldLine: 1, newLine: 1 },
 * //   { type: 'remove', text: 'b', oldLine: 2 },
 * //   { type: 'add', text: 'c', newLine: 2 },
 * // ]
 */
export function diffLines(oldText: string, newText: string, options: DiffLinesOptions = {}): DiffLine[] {
  const { ignoreWhitespace = false, maxEditDistance = 4000 } = options
  const oldLines = splitLines(oldText)
  const newLines = splitLines(newText)
  const oldKeys = ignoreWhitespace
    ? oldLines.map(normalizeWhitespace)
    : oldLines
  const newKeys = ignoreWhitespace
    ? newLines.map(normalizeWhitespace)
    : newLines

  let start = 0
  const shortest = Math.min(oldKeys.length, newKeys.length)
  while (start < shortest && oldKeys[start] === newKeys[start])
    start++

  let end = 0
  while (end < shortest - start && oldKeys.at(-1 - end) === newKeys.at(-1 - end))
    end++

  const oldMiddle = oldKeys.slice(start, oldKeys.length - end)
  const newMiddle = newKeys.slice(start, newKeys.length - end)

  const edits: Edit[] = oldMiddle.length === 0 || newMiddle.length === 0
    ? [...oldMiddle.map((): Edit => 'remove'), ...newMiddle.map((): Edit => 'add')]
    : shortestEdit(oldMiddle, newMiddle, maxEditDistance)
      ?? [...oldMiddle.map((): Edit => 'remove'), ...newMiddle.map((): Edit => 'add')]

  const lines: DiffLine[] = []
  let oldIndex = 0
  let newIndex = 0

  for (; oldIndex < start; oldIndex++, newIndex++)
    lines.push({ type: 'same', text: newLines[newIndex]!, oldLine: oldIndex + 1, newLine: newIndex + 1 })

  for (const edit of edits) {
    if (edit === 'same') {
      lines.push({ type: 'same', text: newLines[newIndex]!, oldLine: oldIndex + 1, newLine: newIndex + 1 })
      oldIndex++
      newIndex++
    }
    else if (edit === 'remove') {
      lines.push({ type: 'remove', text: oldLines[oldIndex]!, oldLine: oldIndex + 1 })
      oldIndex++
    }
    else {
      lines.push({ type: 'add', text: newLines[newIndex]!, newLine: newIndex + 1 })
      newIndex++
    }
  }

  for (let i = 0; i < end; i++, oldIndex++, newIndex++)
    lines.push({ type: 'same', text: newLines[newIndex]!, oldLine: oldIndex + 1, newLine: newIndex + 1 })

  return lines
}

/**
 * Counts the added and the removed lines of a diff.
 */
export function diffStats(lines: DiffLine[]): DiffStats {
  let additions = 0
  let deletions = 0
  for (const line of lines) {
    if (line.type === 'add')
      additions++
    else if (line.type === 'remove')
      deletions++
  }
  return { additions, deletions }
}

/**
 * Keeps `context` unchanged lines around each change and folds the others into gaps (the hidden lines are kept in
 * the `lines` of the gap, to show them again).
 */
export function foldDiff(lines: DiffLine[], context = 3): DiffRow[] {
  const keep = Array.from<boolean>({ length: lines.length }).fill(false)
  const margin = Math.max(0, context)

  for (const [index, line] of lines.entries()) {
    if (line.type === 'same')
      continue
    const from = Math.max(0, index - margin)
    const to = Math.min(lines.length - 1, index + margin)
    for (let i = from; i <= to; i++)
      keep[i] = true
  }

  const rows: DiffRow[] = []
  let hidden: DiffLine[] = []

  for (const [index, line] of lines.entries()) {
    if (keep[index]) {
      if (hidden.length > 0) {
        rows.push({ type: 'gap', lines: hidden })
        hidden = []
      }
      rows.push(line)
    }
    else {
      hidden.push(line)
    }
  }

  if (hidden.length > 0)
    rows.push({ type: 'gap', lines: hidden })

  return rows
}
