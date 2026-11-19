import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getComponentList } from '../getComponentList.ts'

describe('given a folder of components', () => {
  let dir: string

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'maz-icons-components-'))
    for (const file of [
      'MazBtn.vue',
      'MazBtn.d.ts',
      'MazBtn.cjs',
      'MazBtn.js.map',
      'MazBtn.css',
      'helpers.ts',
    ])
      writeFileSync(join(dir, file), '')
    mkdirSync(join(dir, 'MazDatePicker'))
  })

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  describe('when listing the components', () => {
    it('then only the Maz files that are neither builds, types nor styles are listed', () => {
      expect(getComponentList(dir)).toEqual([
        { name: 'MazBtn', fullName: 'MazBtn.vue', path: `${dir}/MazBtn.vue` },
      ])
    })
  })
})

describe('given a folder that does not exist', () => {
  describe('when listing the components', () => {
    it('then it throws', () => {
      expect(() => getComponentList(join(tmpdir(), 'maz-icons-missing-components'))).toThrow('[getComponentList]')
    })
  })
})

describe('given the components of maz-ui', () => {
  describe('when listing them without a folder', () => {
    it('then the components of maz-ui are listed', () => {
      expect(getComponentList().map(({ name }) => name)).toContain('MazBtn')
    })
  })
})
