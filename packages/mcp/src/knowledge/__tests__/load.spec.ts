import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BUNDLE_DIR, cleanTempDirs, createTempDir, fakeManifest, writeFakeBundle, writeFakeMazUi } from '../../__tests__/helpers'
import { defaultBundledDir, findProjectMazUi, Knowledge, loadKnowledge, readManifest } from '../load'

describe('given the knowledge loader', () => {
  afterEach(() => {
    cleanTempDirs()
    vi.unstubAllEnvs()
  })

  describe('when an explicit docsDir is given', () => {
    it('then it loads the bundle of this directory as a custom source', () => {
      const directory = writeFakeBundle(createTempDir())
      const knowledge = loadKnowledge({ docsDir: directory, cwd: createTempDir() })

      expect(knowledge.source).toEqual({ kind: 'custom', directory })
      expect(knowledge.version).toBe('9.9.9')
    })
  })

  describe('when MAZ_UI_DOCS_DIR is set', () => {
    it('then it loads the bundle of the environment variable', () => {
      const directory = writeFakeBundle(createTempDir())
      vi.stubEnv('MAZ_UI_DOCS_DIR', directory)

      const knowledge = loadKnowledge({ cwd: createTempDir(), bundledDir: BUNDLE_DIR })

      expect(knowledge.source.kind).toBe('custom')
      expect(knowledge.source.directory).toBe(directory)
    })
  })

  describe('when the explicit directory has no valid manifest', () => {
    it('then it throws an explicit error', () => {
      const directory = createTempDir()

      expect(() => loadKnowledge({ docsDir: directory })).toThrow(`No valid maz-ui docs bundle (manifest.json) in ${directory}`)
    })
  })

  describe('when the project has maz-ui with docs', () => {
    it('then it loads the project bundle with the project version', () => {
      const project = createTempDir()
      writeFakeMazUi(project, { version: '5.4.3' })

      const knowledge = loadKnowledge({ cwd: project, bundledDir: BUNDLE_DIR })

      expect(knowledge.source.kind).toBe('project')
      expect(knowledge.source.projectVersion).toBe('5.4.3')
      expect(knowledge.version).toBe('5.4.3')
    })
  })

  describe('when maz-ui is installed in a workspace app of a monorepo', () => {
    it('then it finds it in apps/<name>/node_modules', () => {
      const project = createTempDir()
      writeFakeMazUi(join(project, 'apps', 'web'), { version: '5.1.0' })

      const knowledge = loadKnowledge({ cwd: project, bundledDir: BUNDLE_DIR })

      expect(knowledge.source.kind).toBe('project')
      expect(knowledge.version).toBe('5.1.0')
    })
  })

  describe('when the project maz-ui does not ship docs', () => {
    it('then it falls back to the bundled docs and keeps the project version', () => {
      const project = createTempDir()
      writeFakeMazUi(project, { version: '4.0.0', withDocs: false })

      const knowledge = loadKnowledge({ cwd: project, bundledDir: BUNDLE_DIR })

      expect(knowledge.source.kind).toBe('bundled')
      expect(knowledge.source.projectVersion).toBe('4.0.0')
    })
  })

  describe('when the bundled docs are missing', () => {
    it('then it throws a reinstall hint', () => {
      const bundledDir = createTempDir()

      expect(() => loadKnowledge({ cwd: createTempDir(), bundledDir })).toThrow('Reinstall the package')
    })
  })

  describe('when no bundledDir is given', () => {
    it('then it uses the default bundled directory', () => {
      const knowledge = loadKnowledge({ cwd: createTempDir() })

      expect(knowledge.source.directory).toBe(defaultBundledDir())
      expect(knowledge.source.projectVersion).toBeUndefined()
    })
  })
})

describe('given readManifest', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when the manifest does not match the schema', () => {
    it('then it returns undefined', () => {
      const directory = writeFakeBundle(createTempDir(), { ...fakeManifest(), schemaVersion: 2 })

      expect(readManifest(directory)).toBeUndefined()
    })
  })

  describe('when there is no manifest', () => {
    it('then it returns undefined', () => {
      expect(readManifest(createTempDir())).toBeUndefined()
    })
  })
})

describe('given findProjectMazUi', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when maz-ui is in packages/<name>/node_modules', () => {
    it('then it returns its directory and version', () => {
      const project = createTempDir()
      const directory = writeFakeMazUi(join(project, 'packages', 'ui'), { version: '2.0.0' })

      expect(findProjectMazUi(project)).toEqual({ directory, version: '2.0.0' })
    })
  })

  describe('when the workspace folders contain files', () => {
    it('then it ignores them', () => {
      const project = createTempDir()
      mkdirSync(join(project, 'apps'))
      writeFileSync(join(project, 'apps', 'README.md'), 'readme')

      expect(findProjectMazUi(project)).toBeUndefined()
    })
  })

  describe('when maz-ui is not installed', () => {
    it('then it returns undefined', () => {
      expect(findProjectMazUi(createTempDir())).toBeUndefined()
    })
  })
})

describe('given a Knowledge instance', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when a doc is read twice', () => {
    it('then the second read comes from the cache', () => {
      const directory = writeFakeBundle(createTempDir())
      const knowledge = new Knowledge(fakeManifest(), { kind: 'custom', directory })

      expect(knowledge.readDoc('components/maz-fake')).toContain('Fake content')

      writeFileSync(join(directory, 'components/maz-fake.md'), 'changed')

      expect(knowledge.readDoc('components/maz-fake')).toContain('Fake content')
    })
  })

  describe('when an unknown doc is read', () => {
    it('then it throws', () => {
      const knowledge = new Knowledge(fakeManifest(), { kind: 'custom', directory: createTempDir() })

      expect(() => knowledge.readDoc('components/nope')).toThrow('Unknown doc "components/nope"')
    })
  })

  describe('when a file of the bundle is read', () => {
    it('then it returns its content or undefined', () => {
      const directory = writeFakeBundle(createTempDir())
      const knowledge = new Knowledge(fakeManifest(), { kind: 'custom', directory })

      expect(knowledge.readFile('components/maz-fake.md')).toContain('MazFake')
      expect(knowledge.readFile('missing.md')).toBeUndefined()
    })
  })

  describe('when the indexes are built', () => {
    it('then docs, components and icons are indexed', () => {
      const knowledge = new Knowledge(fakeManifest(), { kind: 'custom', directory: createTempDir() })

      expect(knowledge.docs).toHaveLength(1)
      expect(knowledge.docsById.has('components/maz-fake')).toBe(true)
      expect(knowledge.iconNames.has('MazTrash')).toBe(true)
      expect(knowledge.componentsByName.size).toBe(0)
    })
  })
})
