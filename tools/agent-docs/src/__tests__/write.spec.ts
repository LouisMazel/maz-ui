import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { findOutdatedFiles, writeOutput } from '../write'

describe('given writeOutput', () => {
  let directory: string

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'agent-docs-write-'))
    mkdirSync(join(directory, 'out'))
    writeFileSync(join(directory, 'out/stale.md'), 'stale')
  })

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true })
  })

  describe('when writing nested files without clean', () => {
    it('then creates the folders and keeps existing files', () => {
      writeOutput(join(directory, 'out'), [{ path: 'components/maz-btn.md', content: '# MazBtn' }])

      expect(readFileSync(join(directory, 'out/components/maz-btn.md'), 'utf8')).toBe('# MazBtn')
      expect(existsSync(join(directory, 'out/stale.md'))).toBe(true)
    })
  })

  describe('when writing with clean', () => {
    it('then removes the previous files first', () => {
      writeOutput(join(directory, 'out'), [{ path: 'a.md', content: 'A' }], { clean: true })

      expect(existsSync(join(directory, 'out/stale.md'))).toBe(false)
      expect(readFileSync(join(directory, 'out/a.md'), 'utf8')).toBe('A')
    })
  })

  describe('when cleaning a folder that does not exist', () => {
    it('then writes the files', () => {
      writeOutput(join(directory, 'new'), [{ path: 'a.md', content: 'A' }], { clean: true })

      expect(readFileSync(join(directory, 'new/a.md'), 'utf8')).toBe('A')
    })
  })
})

describe('given findOutdatedFiles', () => {
  let directory: string

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'agent-docs-check-'))
    writeFileSync(join(directory, 'same.md'), 'same')
    writeFileSync(join(directory, 'changed.md'), 'old')
  })

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true })
  })

  describe('when some files are missing or differ', () => {
    it('then returns their paths', () => {
      expect(findOutdatedFiles(directory, [
        { path: 'same.md', content: 'same' },
        { path: 'changed.md', content: 'new' },
        { path: 'missing.md', content: 'x' },
      ])).toEqual(['changed.md', 'missing.md'])
    })
  })
})
