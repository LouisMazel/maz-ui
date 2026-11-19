import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { logger } from '@maz-ui/node'
import { cleanSvg, generateIcons, getComponentName, listIconFiles, toPascalCase } from '../generateIcons.ts'

vi.mock('@maz-ui/node', () => ({
  logger: {
    log: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const STAR = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111"><path d="M0 0"/></svg>'
const LINK = '<svg viewBox="0 0 24 24"><path fill="rgb(0, 0, 0)" d="M1 1"/></svg>'
const CHECK = '<svg width="1em" height="1em" viewBox="0 0 24 24"><path stroke="currentColor" d="M3 3"/></svg>'
const VUE = '<svg viewBox="0 0 24 24"><path fill="#41B883" d="M2 2"/></svg>'
const FLAG = '<svg viewBox="0 0 3 2"><path fill="#002654" d="M0 0h1v2H0z"/></svg>'

function createPackage(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'maz-icons-'))

  for (const dir of [
    'svg',
    'logos',
    'flags/1x1',
    'flags/3x2',
  ])
    mkdirSync(join(root, dir), { recursive: true })

  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }

  return root
}

describe('given the names of the icon files', () => {
  describe('when converting them to PascalCase', () => {
    it.each([
      ['academic-cap', 'AcademicCap'],
      ['flag-square-f-r', 'FlagSquareFR'],
      ['arrow_up', 'ArrowUp'],
      ['USER', 'User'],
    ])('then %s is %s', (name, pascal) => {
      expect(toPascalCase(name)).toBe(pascal)
    })
  })

  describe('when naming their components', () => {
    it.each([
      ['star', [], 'MazStar'],
      [
        'map',
        ['Map'],
        'MazMapIcon',
      ],
      [
        'link',
        ['MazLink'],
        'MazLinkIcon',
      ],
      [
        'radio',
        ['MazRadioIcon'],
        'MazRadioIcon',
      ],
    ])('then %s with the reserved names %j is %s', (name, reserved, component) => {
      expect(getComponentName(name, new Set(reserved))).toBe(component)
    })
  })
})

describe('given the SVG of an interface icon', () => {
  describe('when cleaning it', () => {
    it.each([
      ['a fixed size', STAR, '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor"><path d="M0 0"/></svg>'],
      ['no size', LINK, '<svg height="1em" width="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M1 1"/></svg>'],
      ['transparent and named colors', '<svg width="1em" height="1em"><path fill="transparent" stroke="red"/></svg>', '<svg width="1em" height="1em"><path fill="transparent" stroke="currentColor"/></svg>'],
      ['hsl colors', '<svg width="1em" height="1em"><stop stop-color="hsl(0, 0%, 0%)"/></svg>', '<svg width="1em" height="1em"><stop stop-color="currentColor"/></svg>'],
    ])('then an SVG with %s is 1em and in the color of the text', (_, svg, cleaned) => {
      expect(cleanSvg(svg)).toBe(cleaned)
    })
  })
})

describe('given a package of icons', () => {
  let root: string

  function read(path: string): string {
    return readFileSync(join(root, path), 'utf8')
  }

  beforeEach(() => {
    root = createPackage({
      'svg/star.svg': STAR,
      'svg/link.svg': LINK,
      'svg/check.svg': CHECK,
      'svg/notes.txt': 'not an icon',
      'logos/vue.svg': VUE,
      'flags/1x1/FR.svg': FLAG,
      'flags/3x2/FR.svg': FLAG,
    })
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when listing its icons', () => {
    it('then the SVG of each folder are named after it', () => {
      expect(listIconFiles(root).map(({ name, iconName, dir }) => [name, iconName, dir])).toEqual([
        ['check', 'check', 'svg'],
        ['link', 'link', 'svg'],
        ['star', 'star', 'svg'],
        ['logo-vue', 'logo-vue', 'logos'],
        ['flag-square-F-R', 'flag-square-fr', 'flags/1x1'],
        ['flag-F-R', 'flag-fr', 'flags/3x2'],
      ])
    })
  })

  describe('when generating its icons', () => {
    beforeEach(() => {
      generateIcons({
        root,
        reservedNames: ['MazLink'],
      })
    })

    it('then the SVG of the interface icons are cleaned in place', () => {
      expect([
        read('svg/star.svg'),
        read('svg/check.svg'),
      ]).toEqual([
        cleanSvg(STAR),
        CHECK,
      ])
    })

    it('then the logos and the flags keep their colors', () => {
      expect([
        read('logos/vue.svg'),
        read('flags/3x2/FR.svg'),
      ]).toEqual([VUE, FLAG])
    })

    it('then each icon has a static, a lazy and a raw module', () => {
      expect(read('src/static/MazLinkIcon.ts')).toBe(`/// <reference types="@maz-ui/vite-svg-loader/client" />

/**
 * This file is generated automatically, do not manually modify it
 */

import _component from '../../svg/link.svg?component'

export const MazLinkIcon = _component
`)
      expect(read('src/lazy/MazStar.ts')).toContain(`export const MazStar = markRaw(defineAsyncComponent(() => import('../static/MazStar.ts').then(module => module.MazStar)))`)
      expect(read('src/raw/MazFlagSquareFR.ts')).toContain(`import _raw from '../../flags/1x1/FR.svg?svg'\n\nexport const MazFlagSquareFR = _raw`)
    })

    it('then the entries export every icon in order', () => {
      expect(read('src/static/index.ts').split('\n').filter(line => line.startsWith('export'))).toEqual([
        `export { MazCheck } from './MazCheck.ts'`,
        `export { MazFlagFR } from './MazFlagFR.ts'`,
        `export { MazFlagSquareFR } from './MazFlagSquareFR.ts'`,
        `export { MazLinkIcon } from './MazLinkIcon.ts'`,
        `export { MazLogoVue } from './MazLogoVue.ts'`,
        `export { MazStar } from './MazStar.ts'`,
      ])
      expect(read('src/index.ts')).toContain('/// <reference path="./svg-modules.d.ts" />')
      expect(read('src/index.ts')).toContain(`export type * from './types.ts'\n\nexport * from './static/index.ts'\n\nexport { MazCheck as LazyMazCheck } from './lazy/MazCheck.ts'`)
      expect(read('src/lazy/index.ts')).toContain(`export { MazLogoVue } from './MazLogoVue.ts'`)
      expect(read('src/raw/index.ts')).toContain(`export { MazFlagFR } from './MazFlagFR.ts'`)
    })

    it('then the icon list has the components and their lazy version', () => {
      expect(read('src/icon-list.ts')).toContain(`'MazStar',\n  'MazLogoVue',\n  'MazFlagSquareFR',\n  'MazFlagFR',\n  'LazyMazCheck'`)
    })

    it('then icon-names.json gives the component and the file of each name, sorted', () => {
      expect(read('icon-names.json')).toBe(`${JSON.stringify({
        'check': { component: 'MazCheck', file: 'svg/check.svg' },
        'flag-fr': { component: 'MazFlagFR', file: 'flags/3x2/FR.svg' },
        'flag-square-fr': { component: 'MazFlagSquareFR', file: 'flags/1x1/FR.svg' },
        'link': { component: 'MazLinkIcon', file: 'svg/link.svg' },
        'logo-vue': { component: 'MazLogoVue', file: 'logos/vue.svg' },
        'star': { component: 'MazStar', file: 'svg/star.svg' },
      }, null, 2)}\n`)
    })

    it('then a new generation gives the same files', () => {
      const entry = read('src/index.ts')

      generateIcons({
        root,
        reservedNames: ['MazLink'],
      })

      expect([
        read('src/index.ts'),
        read('svg/star.svg'),
      ]).toEqual([
        entry,
        cleanSvg(STAR),
      ])
    })
  })

  describe('when generating its icons with the reserved names by default', () => {
    it('then an icon named like a component of maz-ui ends with Icon', () => {
      generateIcons({ root })

      expect(existsSync(join(root, 'src/static/MazLinkIcon.ts'))).toBe(true)
    })
  })
})

describe('given two icons with the same name', () => {
  let root: string

  beforeEach(() => {
    root = createPackage({
      'svg/logo-vue.svg': CHECK,
      'logos/vue.svg': VUE,
    })
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when generating the icons', () => {
    it('then it throws before writing any file', () => {
      expect(() => generateIcons({ root, reservedNames: [] })).toThrow('duplicated icon names: logo-vue')
      expect(logger.error).toHaveBeenCalledWith('[generateIcons] 🔴 error while generating the icons', 'Error: duplicated icon names: logo-vue')
      expect(existsSync(join(root, 'src'))).toBe(false)
    })
  })
})
