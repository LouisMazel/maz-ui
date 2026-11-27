import { diffLines, diffStats, foldDiff } from '../diffLines.ts'

function lcsLength(a: string[], b: string[]) {
  const table = Array.from({ length: a.length + 1 }, () => Array.from<number>({ length: b.length + 1 }).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i]![j] = a[i] === b[j]
        ? table[i + 1]![j + 1]! + 1
        : Math.max(table[i + 1]![j]!, table[i]![j + 1]!)
    }
  }
  return table[0]![0]!
}

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

describe('diffLines', () => {
  describe('given two identical texts', () => {
    describe('when diffing them', () => {
      it('then every line is the same with both numbers', () => {
        expect(diffLines('a\nb', 'a\nb')).toEqual([
          { type: 'same', text: 'a', oldLine: 1, newLine: 1 },
          { type: 'same', text: 'b', oldLine: 2, newLine: 2 },
        ])
      })
    })
  })

  describe('given empty texts', () => {
    describe('when diffing two empty texts', () => {
      it('then there is no line', () => {
        expect(diffLines('', '')).toEqual([])
      })
    })

    describe('when the old text is empty', () => {
      it('then every line is added', () => {
        expect(diffLines('', 'a\nb')).toEqual([
          { type: 'add', text: 'a', newLine: 1 },
          { type: 'add', text: 'b', newLine: 2 },
        ])
      })
    })

    describe('when the new text is empty', () => {
      it('then every line is removed', () => {
        expect(diffLines('a\nb', '')).toEqual([
          { type: 'remove', text: 'a', oldLine: 1 },
          { type: 'remove', text: 'b', oldLine: 2 },
        ])
      })
    })
  })

  describe('given a changed line', () => {
    describe('when diffing the texts', () => {
      it('then the line is removed then added between the unchanged ones', () => {
        expect(diffLines('a\nb\nc', 'a\nx\nc')).toEqual([
          { type: 'same', text: 'a', oldLine: 1, newLine: 1 },
          { type: 'remove', text: 'b', oldLine: 2 },
          { type: 'add', text: 'x', newLine: 2 },
          { type: 'same', text: 'c', oldLine: 3, newLine: 3 },
        ])
      })
    })
  })

  describe('given line breaks of several kinds and a final line break', () => {
    describe('when diffing the texts', () => {
      it('then they compare as the same lines', () => {
        const lines = diffLines('a\r\nb\r\n', 'a\nb\n')
        expect(lines.map(line => line.type)).toEqual(['same', 'same'])
      })
    })
  })

  describe('given texts that only differ by whitespace', () => {
    describe('when diffing them without the option', () => {
      it('then the lines differ', () => {
        expect(diffStats(diffLines('  a  b', 'a b'))).toEqual({ additions: 1, deletions: 1 })
      })
    })

    describe('when diffing them with ignoreWhitespace', () => {
      it('then the lines are the same, with the text of the new one', () => {
        expect(diffLines('  a  b', 'a b', { ignoreWhitespace: true })).toEqual([
          { type: 'same', text: 'a b', oldLine: 1, newLine: 1 },
        ])
      })
    })
  })

  describe('given texts with nothing in common beyond the edit distance limit', () => {
    describe('when diffing them', () => {
      it('then every line is removed then added', () => {
        const lines = diffLines('a\nb\nc\nd', 'w\nx\ny\nz', { maxEditDistance: 2 })
        expect(lines.map(line => line.type)).toEqual(['remove', 'remove', 'remove', 'remove', 'add', 'add', 'add', 'add'])
      })
    })
  })

  describe('given random texts', () => {
    describe('when diffing them', () => {
      it('then the result rebuilds both texts with the shortest edit script', () => {
        const random = seededRandom(42)
        for (let run = 0; run < 200; run++) {
          const make = () => Array.from({ length: Math.floor(random() * 14) }, () => String.fromCodePoint(97 + Math.floor(random() * 4)))
          const a = make()
          const b = make()
          const lines = diffLines(a.join('\n'), b.join('\n'))

          expect(lines.filter(line => line.type !== 'add').map(line => line.text)).toEqual(a)
          expect(lines.filter(line => line.type !== 'remove').map(line => line.text)).toEqual(b)
          expect(lines.filter(line => line.type === 'same')).toHaveLength(lcsLength(a, b))
        }
      })
    })
  })

  describe('given large texts with one change', () => {
    describe('when diffing them', () => {
      it('then it finds the change', () => {
        const lines = Array.from({ length: 20_000 }, (_, index) => `line ${index}`)
        const changed = [...lines]
        changed[10_000] = 'changed'

        const diff = diffLines(lines.join('\n'), changed.join('\n'))

        expect(diffStats(diff)).toEqual({ additions: 1, deletions: 1 })
      })
    })
  })
})

describe('diffStats', () => {
  describe('given a diff', () => {
    describe('when counting it', () => {
      it('then it returns the added and the removed lines', () => {
        expect(diffStats(diffLines('a\nb\nc', 'a\nx\ny\nc'))).toEqual({ additions: 2, deletions: 1 })
      })
    })
  })
})

describe('foldDiff', () => {
  const lines = diffLines(
    Array.from({ length: 20 }, (_, index) => `l${index}`).join('\n'),
    Array.from({ length: 20 }, (_, index) => index === 10
      ? 'changed'
      : `l${index}`).join('\n'),
  )

  describe('given a change in the middle of a long text', () => {
    describe('when folding with a context of 2', () => {
      it('then it keeps the context and folds the rest into gaps', () => {
        const rows = foldDiff(lines, 2)

        expect(rows.map(row => row.type)).toEqual(['gap', 'same', 'same', 'remove', 'add', 'same', 'same', 'gap'])
        expect(rows[0]).toMatchObject({ type: 'gap', lines: expect.any(Array) })
        expect(rows[0]!.type === 'gap' && rows[0]!.lines).toHaveLength(8)
      })
    })

    describe('when folding with a context larger than the text', () => {
      it('then nothing is folded', () => {
        expect(foldDiff(lines, 100)).toEqual(lines)
      })
    })

    describe('when folding with a negative context', () => {
      it('then it keeps only the changes', () => {
        expect(foldDiff(lines, -1).map(row => row.type)).toEqual(['gap', 'remove', 'add', 'gap'])
      })
    })
  })

  describe('given no change', () => {
    describe('when folding', () => {
      it('then everything is one gap', () => {
        const rows = foldDiff(diffLines('a\nb', 'a\nb'))

        expect(rows).toHaveLength(1)
        expect(rows[0]!.type).toBe('gap')
      })
    })
  })

  describe('given an empty diff', () => {
    describe('when folding', () => {
      it('then there is no row', () => {
        expect(foldDiff([])).toEqual([])
      })
    })
  })
})
