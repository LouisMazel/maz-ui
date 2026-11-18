import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  collectClasses,
  containsName,
  containsToken,
  generatePurgeManifest,
  loadPurgeManifest,
  PURGE_MANIFEST_FILE,
} from '../manifest'

function write(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

const roots: string[] = []

function createTemp(prefix: string): string {
  const root = mkdtempSync(join(tmpdir(), prefix))
  roots.push(root)

  return root
}

afterAll(() => {
  for (const root of roots)
    rmSync(root, { recursive: true, force: true })
})

describe('given collectClasses', () => {
  describe('when the CSS has several selectors', () => {
    it('then it returns the sorted unique classes passing the filter', () => {
      const css = '.maz\\:b, .other{a:b}.maz\\:a:hover{a:b}.maz\\:b{a:b}@media print{.maz\\:c{a:b}}'

      expect(collectClasses(css, className => className.startsWith('maz:'))).toEqual(['maz:a', 'maz:b', 'maz:c'])
      expect(collectClasses(css, () => true)).toEqual(['maz:a', 'maz:b', 'maz:c', 'other'])
    })
  })
})

describe('given containsToken', () => {
  describe('when the token is a whole word', () => {
    it('then it is found at the start, the end and the middle', () => {
      expect(containsToken('maz:p-2', 'maz:p-2')).toBe(true)
      expect(containsToken('class="a maz:p-2 b"', 'maz:p-2')).toBe(true)
      expect(containsToken('a maz:p-2.', 'maz:p-2')).toBe(true)
      expect(containsToken('a maz:p-2.x', 'maz:p-2')).toBe(true)
    })
  })

  describe('when the token continues in a longer class', () => {
    it('then it is not found', () => {
      expect(containsToken('maz:p-20', 'maz:p-2')).toBe(false)
      expect(containsToken('xmaz:p-2', 'maz:p-2')).toBe(false)
      expect(containsToken('maz:p-2.5', 'maz:p-2')).toBe(false)
      expect(containsToken('maz:p-2!', 'maz:p-2')).toBe(false)
      expect(containsToken('maz:p-2/50', 'maz:p-2')).toBe(false)
    })
  })

  describe('when a first occurrence is invalid and a later one is valid', () => {
    it('then it keeps searching', () => {
      expect(containsToken('maz:p-20 maz:p-2', 'maz:p-2')).toBe(true)
    })
  })

  describe('when the token is absent', () => {
    it('then it is not found', () => {
      expect(containsToken('nothing', 'maz:p-2')).toBe(false)
    })
  })
})

describe('given containsName', () => {
  describe('when the name is an identifier', () => {
    it('then it matches only whole identifiers', () => {
      expect(containsName('<MazBtn />', 'MazBtn')).toBe(true)
      expect(containsName('<maz-btn>', 'maz-btn')).toBe(true)
      expect(containsName('<MazBtnGroup />', 'MazBtn')).toBe(false)
      expect(containsName('$MazBtn', 'MazBtn')).toBe(false)
      expect(containsName('<maz-btn-group>', 'maz-btn')).toBe(false)
    })
  })
})

describe('given generatePurgeManifest', () => {
  let dist: string

  beforeAll(() => {
    dist = join(createTemp('maz-dist-'), 'dist')
    write(join(dist, 'css/main.css'), '.maz\\:p-2{a:b}.maz\\:flex{a:b}.maz\\:mt-2{a:b}.other{a:b}')
    write(join(dist, 'css/utilities.css'), '@layer maz{.text-title-1{a:b}.padded-container{a:b}}')
    write(join(dist, 'components/MazBtn.js'), 'import "../chunks/btn.js";\nimport("./missing.js");\nexport { MazBtn as default, MazBtn, helper as Helper, }')
    write(join(dist, 'components/MazCard.js'), 'const a = "maz:flex"\nexport { a as MazCardExport }')
    write(join(dist, 'components/index.js'), 'export {}')
    write(join(dist, 'components/readme.md'), 'maz:p-2')
    write(join(dist, 'chunks/btn.js'), 'const c = "maz:p-2 maz:mt-20"\nimport "../components/MazBtn.js"\nimport x from "./shared.js"')
    write(join(dist, 'chunks/shared.js'), 'export const s = "maz:mt-2"')
    write(join(dist, 'directives/vTooltip.js'), 'export { vTooltip, vTooltipInstall, default }')
    write(join(dist, 'composables/useToast.js'), 'export { useToast }')
  })

  describe('when the dist has styles, entries and chunks', () => {
    it('then it lists the classes and the utilities', () => {
      const manifest = generatePurgeManifest(dist, '5.7.0')

      expect(manifest.version).toBe('5.7.0')
      expect(manifest.classes).toEqual(['maz:flex', 'maz:mt-2', 'maz:p-2'])
      expect(manifest.utilities).toEqual(['padded-container', 'text-title-1'])
    })

    it('then it follows the relative imports to find the classes of an entry', () => {
      const { entries, classes } = generatePurgeManifest(dist, '5.7.0')
      const names = (key: string) => entries[key]!.classes.map(index => classes[index])

      expect(names('components/MazBtn')).toEqual(['maz:mt-2', 'maz:p-2'])
      expect(names('components/MazCard')).toEqual(['maz:flex'])
      expect(names('composables/useToast')).toEqual([])
    })

    it('then it skips index.js, non-js files and missing folders', () => {
      const { entries } = generatePurgeManifest(dist, '5.7.0')

      expect(Object.keys(entries).sort()).toEqual([
        'components/MazBtn',
        'components/MazCard',
        'composables/useToast',
        'directives/vTooltip',
      ])
    })

    it('then it computes the aliases per directory', () => {
      const { entries } = generatePurgeManifest(dist, '5.7.0')

      expect(entries['components/MazBtn']!.aliases).toEqual([
        'Helper',
        'LazyMazBtn',
        'MazBtn',
        'maz-btn',
      ])
      expect(entries['components/MazCard']!.aliases).toEqual([
        'LazyMazCard',
        'MazCard',
        'MazCardExport',
        'maz-card',
      ])
      expect(entries['composables/useToast']!.aliases).toEqual(['useToast'])
      expect(entries['directives/vTooltip']!.aliases).toEqual(['v-tooltip', 'vTooltip', 'vTooltipInstall'])
    })

    it('then it writes the manifest in css/', () => {
      const manifest = generatePurgeManifest(dist, '5.7.0')

      expect(JSON.parse(readFileSync(join(dist, 'css', PURGE_MANIFEST_FILE), 'utf8'))).toEqual(manifest)
    })
  })

  describe('when the dist has no utilities file and no entry folder', () => {
    it('then it returns empty utilities and entries', () => {
      const minimal = join(createTemp('maz-dist-min-'), 'dist')
      write(join(minimal, 'css/main.css'), '.maz\\:p-2{a:b}')

      const manifest = generatePurgeManifest(minimal, '1.0.0')

      expect(manifest).toEqual({
        version: '1.0.0',
        classes: ['maz:p-2'],
        utilities: [],
        entries: {},
      })
    })
  })
})

describe('given loadPurgeManifest', () => {
  describe('when maz-ui with a manifest is installed in the project', () => {
    it('then it reads the manifest', () => {
      const root = createTemp('maz-project-')
      const manifest = {
        version: '5.7.0',
        classes: ['maz:p-2'],
        utilities: [],
        entries: {},
      }
      write(join(root, 'package.json'), '{"name":"app"}')
      write(join(root, 'node_modules/maz-ui/package.json'), JSON.stringify({
        name: 'maz-ui',
        version: '5.7.0',
        exports: { './purge-manifest.json': './dist/css/purge-manifest.json' },
      }))
      write(join(root, 'node_modules/maz-ui/dist/css/purge-manifest.json'), JSON.stringify(manifest))

      expect(loadPurgeManifest(root)).toEqual(manifest)
    })
  })

  describe('when maz-ui has no manifest', () => {
    it('then it returns undefined', () => {
      const root = createTemp('maz-project-old-')
      write(join(root, 'package.json'), '{"name":"app"}')
      write(join(root, 'node_modules/maz-ui/package.json'), JSON.stringify({
        name: 'maz-ui',
        version: '5.0.0',
        exports: { '.': './index.js' },
      }))

      expect(loadPurgeManifest(root)).toBeUndefined()
    })
  })
})
