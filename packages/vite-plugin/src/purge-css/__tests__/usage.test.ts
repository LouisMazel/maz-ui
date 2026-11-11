import type { PurgeManifest } from '../manifest'
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DEFAULT_CONTENT, DEFAULT_IGNORE, readContent, resolveUsage } from '../usage'

const manifest: PurgeManifest = {
  version: '5.7.0',
  classes: [
    'maz:p-2',
    'maz:flex',
    'maz:mt-2',
    'maz:m-1',
  ],
  utilities: ['text-title-1', 'padded-container'],
  entries: {
    'components/MazBtn': {
      aliases: ['MazBtn', 'maz-btn'],
      classes: [0],
    },
    'components/MazCard': {
      aliases: ['MazCard', 'maz-card'],
      classes: [1],
    },
    'composables/useToast': {
      aliases: ['useToast'],
      classes: [2],
    },
    'plugins/toast': {
      aliases: ['toastPlugin'],
      classes: [],
    },
  },
}

const none = { entries: [], safelist: [] }

describe('given readContent', () => {
  let root: string

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'maz-usage-'))
    mkdirSync(join(root, 'src'), { recursive: true })
    mkdirSync(join(root, 'node_modules/lib'), { recursive: true })
    mkdirSync(join(root, 'dist'), { recursive: true })
    mkdirSync(join(root, '.hidden'), { recursive: true })
    writeFileSync(join(root, 'src/App.vue'), 'APP_VUE')
    writeFileSync(join(root, 'src/main.ts'), 'MAIN_TS')
    writeFileSync(join(root, 'src/types.d.ts'), 'TYPES_DTS')
    writeFileSync(join(root, 'src/notes.txt'), 'NOTES_TXT')
    writeFileSync(join(root, 'node_modules/lib/index.js'), 'NODE_MODULES_JS')
    writeFileSync(join(root, 'dist/bundle.js'), 'DIST_JS')
    writeFileSync(join(root, '.hidden/secret.ts'), 'HIDDEN_TS')
  })

  afterAll(() => {
    rmSync(root, { recursive: true, force: true })
  })

  describe('when the default content globs are used', () => {
    it('then it reads the sources and skips the ignored folders', async () => {
      const source = await readContent(root, DEFAULT_CONTENT)

      expect(source).toContain('APP_VUE')
      expect(source).toContain('MAIN_TS')
      expect(source).not.toContain('NODE_MODULES_JS')
      expect(source).not.toContain('DIST_JS')
      expect(source).not.toContain('TYPES_DTS')
      expect(source).not.toContain('NOTES_TXT')
      expect(source).not.toContain('HIDDEN_TS')
    })
  })

  describe('when a custom glob is used', () => {
    it('then it reads the matching files', async () => {
      expect(await readContent(root, ['src/*.txt'])).toBe('NOTES_TXT')
    })
  })

  describe('when no file matches', () => {
    it('then it returns an empty string', async () => {
      expect(await readContent(root, ['nothing/**/*.ts'])).toBe('')
    })
  })

  describe('when a matched path cannot be read', () => {
    it('then it ignores it', async () => {
      writeFileSync(join(root, 'src/locked.ts'), 'LOCKED_TS')
      chmodSync(join(root, 'src/locked.ts'), 0o000)

      const source = await readContent(root, ['src/**/*.ts'])

      expect(source).toContain('MAIN_TS')
      expect(source).not.toContain('LOCKED_TS')
    })
  })

  describe('when the defaults are read', () => {
    it('then the ignore list covers the build folders', () => {
      expect(DEFAULT_IGNORE).toContain('**/node_modules/**')
      expect(DEFAULT_IGNORE).toContain('**/dist/**')
    })
  })
})

describe('given resolveUsage', () => {
  describe('when the source is empty', () => {
    it('then nothing is used', () => {
      const usage = resolveUsage(manifest, '', none)

      expect(usage.entries.size).toBe(0)
      expect(usage.classes.size).toBe(0)
    })
  })

  describe('when the source uses a component by name', () => {
    it('then it registers the entry and its classes', () => {
      const usage = resolveUsage(manifest, '<MazBtn />', none)

      expect([...usage.entries]).toEqual(['components/MazBtn'])
      expect([...usage.classes]).toEqual(['maz:p-2'])
    })

    it('then the kebab-case alias matches too', () => {
      expect([
        ...resolveUsage(manifest, '<maz-btn />', none).entries,
      ]).toEqual(['components/MazBtn'])
    })

    it('then a longer identifier does not match', () => {
      expect(resolveUsage(manifest, '<MazBtnGroup />', none).entries.size).toBe(0)
    })
  })

  describe('when the source uses a composable', () => {
    it('then it registers it', () => {
      const usage = resolveUsage(manifest, 'const toast = useToast()', none)

      expect([...usage.classes]).toEqual(['maz:mt-2'])
    })
  })

  describe('when the source has a namespace import of a barrel', () => {
    it('then it registers every entry of the directory', () => {
      const usage = resolveUsage(manifest, 'import * as components from "maz-ui/components"', none)

      expect([...usage.entries].sort()).toEqual(['components/MazBtn', 'components/MazCard'])
      expect([...usage.classes].sort()).toEqual(['maz:flex', 'maz:p-2'])
    })

    it('then a named import of a barrel is not a namespace import', () => {
      expect(resolveUsage(manifest, 'import { x } from "maz-ui/plugins"', none).entries.size).toBe(0)
    })
  })

  describe('when entries are given explicitly', () => {
    it('then it matches the key, the end of the key and the aliases', () => {
      expect([
        ...resolveUsage(manifest, '', {
          entries: ['components/MazBtn'],
          safelist: [],
        }).entries,
      ]).toEqual(['components/MazBtn'])
      expect([
        ...resolveUsage(manifest, '', {
          entries: ['toast'],
          safelist: [],
        }).entries,
      ]).toEqual(['plugins/toast'])
      expect([
        ...resolveUsage(manifest, '', {
          entries: ['MazCard'],
          safelist: [],
        }).entries,
      ]).toEqual(['components/MazCard'])
      expect([
        ...resolveUsage(manifest, '', {
          entries: ['toastPlugin'],
          safelist: [],
        }).entries,
      ]).toEqual(['plugins/toast'])
    })

    it('then an unknown entry matches nothing', () => {
      expect(resolveUsage(manifest, '', {
        entries: ['Unknown'],
        safelist: [],
      }).entries.size).toBe(0)
    })
  })

  describe('when the source uses public utilities', () => {
    it('then it keeps the utilities found as whole tokens', () => {
      const usage = resolveUsage(manifest, '<div class="text-title-1 other">', none)

      expect([...usage.classes]).toEqual(['text-title-1'])
    })

    it('then a longer class does not match', () => {
      expect(resolveUsage(manifest, 'text-title-10', none).classes.size).toBe(0)
    })
  })

  describe('when a safelist is given', () => {
    it('then it keeps the classes matching a string', () => {
      const usage = resolveUsage(manifest, '', {
        entries: [],
        safelist: ['maz:flex', 'padded-container', 'unknown'],
      })

      expect([...usage.classes].sort()).toEqual(['maz:flex', 'padded-container'])
    })

    it('then it keeps the classes matching a RegExp, even a global one', () => {
      const usage = resolveUsage(manifest, '', {
        entries: [],
        safelist: [/^maz:m/g],
      })

      expect([...usage.classes].sort()).toEqual(['maz:m-1', 'maz:mt-2'])
    })
  })
})
