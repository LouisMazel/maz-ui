import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getSourcePaths } from '../../paths'
import { collectIconIds, collectIconNames, groupIcons } from '../icons'
import { collectNuxtAutoImports } from '../nuxt'

const paths = getSourcePaths()

describe('given collectIconNames', () => {
  describe('when reading the generated icon list', () => {
    const names = collectIconNames(paths.iconList)

    it('then returns unique sorted static names', () => {
      expect(names.length).toBeGreaterThan(800)
      expect(names).toContain('MazTrash')
      expect(names.some(name => name.startsWith('LazyMaz'))).toBe(false)
      expect(new Set(names).size).toBe(names.length)
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    })
  })

  describe('when the file contains no icon', () => {
    let directory: string

    beforeEach(() => {
      directory = mkdtempSync(join(tmpdir(), 'agent-docs-icons-'))
    })

    afterEach(() => {
      rmSync(directory, { recursive: true, force: true })
    })

    it('then throws', () => {
      const file = join(directory, 'icon-list.ts')
      writeFileSync(file, 'export const iconList = []')

      expect(() => collectIconNames(file)).toThrow(/No icon found/)
    })
  })
})

describe('given collectIconIds', () => {
  describe('when reading the names and the static icons of @maz-ui/icons', () => {
    const ids = collectIconIds(paths.iconNames, paths.iconStatic)

    it('then each static icon has the name of its SVG file', () => {
      expect(Object.keys(ids).length).toBeGreaterThan(800)
      expect(ids).toMatchObject({
        MazTrash: 'trash',
        MazCog6Tooth: 'cog-6-tooth',
        MazH1: 'h1',
        MazFlagFR: 'flag-fr',
        MazFlagSquareFR: 'flag-square-fr',
      })
    })
  })

  describe('when a static icon imports a file without name', () => {
    let directory: string

    beforeEach(() => {
      directory = mkdtempSync(join(tmpdir(), 'agent-docs-icon-ids-'))
    })

    afterEach(() => {
      rmSync(directory, { recursive: true, force: true })
    })

    it('then it has no name', () => {
      writeFileSync(join(directory, 'icon-names.json'), JSON.stringify({ star: 'svg/star.svg' }))
      writeFileSync(join(directory, 'MazStar.ts'), 'import _component from \'../../svg/star.svg?component\'')
      writeFileSync(join(directory, 'MazMoon.ts'), 'import _component from \'../../svg/moon.svg?component\'')
      writeFileSync(join(directory, 'index.ts'), 'export {}')

      expect(collectIconIds(join(directory, 'icon-names.json'), directory)).toEqual({ MazStar: 'star' })
    })
  })
})

describe('given groupIcons', () => {
  describe('when names mix interface icons, logos and flags', () => {
    it('then splits them into groups', () => {
      const groups = groupIcons([
        'MazTrash',
        'MazFlag',
        'MazLogoVue',
        'MazFlagFR',
        'MazFlagSquareFR',
        'MazFlagGEAB',
      ])

      expect(groups.map(group => [group.title, group.names])).toEqual([
        [
          'Interface icons',
          ['MazTrash', 'MazFlag'],
        ],
        [
          'Logos',
          ['MazLogoVue'],
        ],
        [
          'Country flags (3x2)',
          ['MazFlagFR', 'MazFlagGEAB'],
        ],
        [
          'Country flags (1x1)',
          ['MazFlagSquareFR'],
        ],
      ])
    })
  })
})

describe('given collectNuxtAutoImports', () => {
  describe('when reading the Nuxt module source', () => {
    const result = collectNuxtAutoImports(join(paths.root, 'packages/nuxt/src/module.ts'))

    it('then lists the auto-imported components and composables', () => {
      expect(result.components).toContain('MazBtn')
      expect(result.components).not.toContain('useMazDialogConfirm')
      expect(result.composables).toEqual(expect.arrayContaining(['useBreakpoints', 'useTheme', 'useTranslations']))
      expect(result.pluginComposables.useToast).toBe('toast')
    })
  })

  describe('when the module declares no map', () => {
    let directory: string

    beforeEach(() => {
      directory = mkdtempSync(join(tmpdir(), 'agent-docs-nuxt-'))
    })

    afterEach(() => {
      rmSync(directory, { recursive: true, force: true })
    })

    it('then returns empty lists', () => {
      const file = join(directory, 'module.ts')
      writeFileSync(file, 'export default {}')

      expect(collectNuxtAutoImports(file)).toMatchObject({ components: [], composables: [] })
    })
  })
})
