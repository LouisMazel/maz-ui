import type { Fragment } from '../schema'

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { BUNDLE_DIR, cleanTempDirs, createTempDir, fakeDoc, fakeFragment, fakeKnowledge, fakeLegacyManifest, writeFakeBundle, writeFakeFragment, writeFakeMazUi, writeFakePackage } from '../../__tests__/helpers'
import { defaultBundledDir, findProjectMazUi, installedMazUiPackages, Knowledge, loadKnowledge, readBundle, readFragment, readLegacyManifest, splitLegacyManifest } from '../load'

const themesDoc = fakeDoc({
  id: 'ecosystem/themes',
  category: 'ecosystem',
  slug: 'themes',
  title: 'Themes',
  package: '@maz-ui/themes',
  file: 'ecosystem/themes.md',
  symbols: [],
})

function themesFragment(version = '9.9.9'): Fragment {
  return fakeFragment({
    package: '@maz-ui/themes',
    version,
    docs: [themesDoc],
    icons: undefined,
    tailwind: undefined,
  })
}

function bundledDir(): string {
  return writeFakeBundle(createTempDir(), [
    fakeFragment(),
    themesFragment(),
  ])
}

function kindOf(knowledge: Knowledge, name: string): string | undefined {
  return knowledge.fragmentsByPackage.get(name)?.source.kind
}

describe('given the knowledge loader', () => {
  afterEach(() => {
    cleanTempDirs()
    vi.unstubAllEnvs()
  })

  describe('when an explicit docsDir is a bundle', () => {
    it('then it replaces the bundled docs and the installed packages', () => {
      const directory = writeFakeBundle(createTempDir(), [
        fakeFragment({ version: '1.0.0' }),
      ])
      const project = createTempDir()

      writeFakeMazUi(project, { version: '5.4.3' })

      const knowledge = loadKnowledge({ docsDir: directory, cwd: project, bundledDir: BUNDLE_DIR })

      expect(knowledge.fragments.map(loaded => loaded.source.kind)).toEqual(['custom'])
      expect(knowledge.version).toBe('1.0.0')
      expect(knowledge.fragmentsByPackage.get('@maz-ui/themes')).toBeUndefined()
    })
  })

  describe('when MAZ_UI_DOCS_DIR is set', () => {
    it('then it loads the bundle of the environment variable', () => {
      const directory = writeFakeBundle(createTempDir())

      vi.stubEnv('MAZ_UI_DOCS_DIR', directory)

      const knowledge = loadKnowledge({
        cwd: createTempDir(),
        bundledDir: BUNDLE_DIR,
      })

      expect(kindOf(knowledge, 'maz-ui')).toBe('custom')
      expect(knowledge.fragmentsByPackage.get('maz-ui')?.source.directory).toBe(join(directory, 'maz-ui'))
    })
  })

  describe('when an explicit docsDir is the fragment of an installed package', () => {
    it('then it pins this package with the version of its package.json and keeps the others', () => {
      const project = createTempDir()
      const packageDir = writeFakePackage(project, '@maz-ui/themes', {
        version: '5.7.0',
        fragment: themesFragment('5.6.0'),
      })

      const knowledge = loadKnowledge({
        docsDir: join(packageDir, 'agent-docs'),
        cwd: createTempDir(),
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('custom')
      expect(knowledge.versionOf('@maz-ui/themes')).toBe('5.7.0')
      expect(kindOf(knowledge, 'maz-ui')).toBe('bundled')
    })

    it('then the version of the manifest is used without package.json', () => {
      const directory = writeFakeFragment(join(createTempDir(), 'docs'), themesFragment('5.6.0'))

      const knowledge = loadKnowledge({
        docsDir: directory,
        cwd: createTempDir(),
        bundledDir: bundledDir(),
      })

      expect(knowledge.versionOf('@maz-ui/themes')).toBe('5.6.0')
    })
  })

  describe('when an explicit docsDir is the legacy docs folder of maz-ui', () => {
    it('then it pins maz-ui only', () => {
      const project = createTempDir()
      const packageDir = writeFakePackage(project, 'maz-ui', { version: '5.2.0', legacy: true })

      const knowledge = loadKnowledge({
        docsDir: join(packageDir, 'docs'),
        cwd: createTempDir(),
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, 'maz-ui')).toBe('custom')
      expect(knowledge.version).toBe('5.2.0')
      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('bundled')
    })

    it('then the version of the manifest is used without package.json', () => {
      const directory = writeFakeFragment(join(createTempDir(), 'docs'), fakeLegacyManifest('5.1.0'))

      expect(loadKnowledge({
        docsDir: directory,
        cwd: createTempDir(),
        bundledDir: bundledDir(),
      }).version).toBe('5.1.0')
    })
  })

  describe('when the explicit directory holds no valid docs', () => {
    it('then it throws an explicit error', () => {
      const directory = createTempDir()

      expect(() => loadKnowledge({ docsDir: directory })).toThrow(`No valid maz-ui docs (index.json or manifest.json) in ${directory}`)
    })
  })

  describe('when the explicit bundle has no maz-ui fragment', () => {
    it('then it throws', () => {
      const directory = writeFakeBundle(createTempDir(), [
        themesFragment(),
      ])

      expect(() => loadKnowledge({ docsDir: directory })).toThrow('The docs of maz-ui are missing or invalid')
    })
  })

  describe('when the project has maz-ui with agent-docs', () => {
    it('then it loads the project fragment with the version of its package.json', () => {
      const project = createTempDir()

      writeFakePackage(project, 'maz-ui', {
        version: '5.4.3',
        fragment: fakeFragment({ version: '5.4.0' }),
      })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, 'maz-ui')).toBe('project')
      expect(knowledge.version).toBe('5.4.3')
      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('bundled')
    })
  })

  describe('when maz-ui is installed in a workspace app of a monorepo', () => {
    it('then it finds it in apps/<name>/node_modules', () => {
      const project = createTempDir()

      writeFakeMazUi(join(project, 'apps', 'web'), { version: '5.1.0' })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, 'maz-ui')).toBe('project')
      expect(knowledge.version).toBe('5.1.0')
    })
  })

  describe('when an installed package ships its agent-docs', () => {
    it('then each package gets the docs of its installed version', () => {
      const project = createTempDir()

      writeFakeMazUi(project, { version: '5.4.0' })
      writeFakePackage(project, '@maz-ui/themes', {
        version: '5.3.0',
        fragment: themesFragment('5.3.0'),
      })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('project')
      expect(knowledge.versionOf('@maz-ui/themes')).toBe('5.3.0')
      expect(knowledge.version).toBe('5.4.0')
    })
  })

  describe('when the agent-docs of an installed package are invalid', () => {
    it('then they are ignored for the bundled docs', () => {
      const project = createTempDir()
      const packageDir = writeFakePackage(project, '@maz-ui/themes', { version: '5.3.0' })

      writeFakeFragment(join(packageDir, 'agent-docs'), { schemaVersion: 1 })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('bundled')
      expect(knowledge.fragmentsByPackage.get('@maz-ui/themes')?.source.installedVersion).toBe('5.3.0')
    })

    it('then a manifest that is not JSON is ignored', () => {
      const project = createTempDir()
      const packageDir = writeFakePackage(project, '@maz-ui/themes', { version: '5.3.0' })

      mkdirSync(join(packageDir, 'agent-docs'))
      writeFileSync(join(packageDir, 'agent-docs/manifest.json'), '{ nope')

      expect(kindOf(loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      }), '@maz-ui/themes')).toBe('bundled')
    })

    it('then a fragment of another package is ignored', () => {
      const project = createTempDir()

      writeFakePackage(project, '@maz-ui/themes', {
        version: '5.3.0',
        fragment: fakeFragment({ package: '@maz-ui/utils' }),
      })

      expect(kindOf(loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      }), '@maz-ui/themes')).toBe('bundled')
    })
  })

  describe('when an installed package ships a fragment unknown to the bundle', () => {
    it('then it is added', () => {
      const project = createTempDir()

      writeFakePackage(project, '@maz-ui/newcomer', { version: '5.9.0', fragment: true })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, '@maz-ui/newcomer')).toBe('project')
      expect(knowledge.fragments.map(loaded => loaded.fragment.package)).toEqual(['maz-ui', '@maz-ui/newcomer', '@maz-ui/themes'])
    })

    it('then an installed package without fragment is ignored', () => {
      const project = createTempDir()

      writeFakePackage(project, '@maz-ui/newcomer', { version: '5.9.0' })

      expect(loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      }).fragmentsByPackage.has('@maz-ui/newcomer')).toBe(false)
    })
  })

  describe('when the installed maz-ui only ships the legacy docs', () => {
    it('then maz-ui and the packages of the same version use the legacy docs', () => {
      const project = createTempDir()

      writeFakePackage(project, 'maz-ui', { version: '5.2.0', legacy: true })
      writeFakePackage(project, '@maz-ui/themes', { version: '5.2.0' })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, 'maz-ui')).toBe('legacy')
      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('legacy')
      expect(knowledge.version).toBe('5.2.0')
      expect(knowledge.versionOf('@maz-ui/themes')).toBe('5.2.0')
      expect(knowledge.readDoc('ecosystem/themes')).toContain('Fake content')
    })

    it('then a package of another version uses the bundled docs', () => {
      const project = createTempDir()

      writeFakePackage(project, 'maz-ui', { version: '5.2.0', legacy: true })
      writeFakePackage(project, '@maz-ui/themes', { version: '5.0.0' })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('bundled')
      expect(knowledge.fragmentsByPackage.get('@maz-ui/themes')?.source.installedVersion).toBe('5.0.0')
    })

    it('then a package that is not installed uses the bundled docs', () => {
      const project = createTempDir()

      writeFakePackage(project, 'maz-ui', { version: '5.2.0', legacy: true })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, '@maz-ui/themes')).toBe('bundled')
      expect(knowledge.fragmentsByPackage.get('@maz-ui/themes')?.source.installedVersion).toBeUndefined()
    })

    it('then a package without legacy docs uses the bundled docs', () => {
      const project = createTempDir()

      writeFakePackage(project, 'maz-ui', {
        version: '5.2.0',
        legacy: {
          ...fakeLegacyManifest('5.2.0'),
          docs: [
            fakeDoc(),
          ],
        },
      })
      writeFakePackage(project, '@maz-ui/themes', { version: '5.2.0' })

      expect(kindOf(loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      }), '@maz-ui/themes')).toBe('bundled')
    })
  })

  describe('when the project maz-ui does not ship docs', () => {
    it('then it falls back to the bundled docs and keeps the installed version', () => {
      const project = createTempDir()

      writeFakeMazUi(project, { version: '4.0.0', withDocs: false })

      const knowledge = loadKnowledge({
        cwd: project,
        bundledDir: bundledDir(),
      })

      expect(kindOf(knowledge, 'maz-ui')).toBe('bundled')
      expect(knowledge.fragmentsByPackage.get('maz-ui')?.source.installedVersion).toBe('4.0.0')
      expect(knowledge.version).toBe('9.9.9')
    })
  })

  describe('when the bundled docs have an invalid fragment', () => {
    it('then the other fragments are loaded', () => {
      const directory = bundledDir()

      writeFileSync(join(directory, 'themes/manifest.json'), '{}')

      const knowledge = loadKnowledge({
        cwd: createTempDir(),
        bundledDir: directory,
      })

      expect(knowledge.fragments.map(loaded => loaded.fragment.package)).toEqual(['maz-ui'])
    })
  })

  describe('when the bundled docs are missing', () => {
    it('then it throws a reinstall hint', () => {
      expect(() => loadKnowledge({
        cwd: createTempDir(),
        bundledDir: createTempDir(),
      })).toThrow('Reinstall @maz-ui/mcp')
    })

    it('then the installed maz-ui is still used', () => {
      const project = createTempDir()

      writeFakeMazUi(project, { version: '5.4.3' })

      expect(loadKnowledge({
        cwd: project,
        bundledDir: createTempDir(),
      }).version).toBe('5.4.3')
    })
  })

  describe('when no bundledDir is given', () => {
    it('then it uses the default bundled directory', () => {
      const knowledge = loadKnowledge({
        cwd: createTempDir(),
      })

      expect(knowledge.fragmentsByPackage.get('maz-ui')?.source.directory).toBe(join(defaultBundledDir(), 'maz-ui'))
      expect(knowledge.fragments.length).toBeGreaterThan(5)
    })
  })

  describe('when no cwd is given', () => {
    it('then it reads the project of the process', () => {
      vi.spyOn(process, 'cwd').mockReturnValue(createTempDir())

      expect(loadKnowledge({
        bundledDir: bundledDir(),
      }).version).toBe('9.9.9')
      vi.restoreAllMocks()
    })
  })
})

describe('given readFragment, readLegacyManifest and readBundle', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when the manifest does not match the schema', () => {
    it('then they return undefined', () => {
      const directory = writeFakeFragment(createTempDir(), {
        ...fakeFragment(),
        schemaVersion: 1,
      })

      expect(readFragment(directory)).toBeUndefined()
      expect(readLegacyManifest(directory)).toBeUndefined()
    })
  })

  describe('when there is no manifest nor index', () => {
    it('then they return undefined', () => {
      const directory = createTempDir()

      expect(readFragment(directory)).toBeUndefined()
      expect(readLegacyManifest(directory)).toBeUndefined()
      expect(readBundle(directory, 'bundled')).toBeUndefined()
    })
  })

  describe('when the index lists a missing fragment', () => {
    it('then the fragment is skipped', () => {
      const directory = writeFakeBundle(createTempDir(), [
        fakeFragment(),
      ])

      writeFileSync(join(directory, 'index.json'), JSON.stringify({
        schemaVersion: 2,
        name: 'maz-ui',
        fragments: ['maz-ui/manifest.json', 'ghost/manifest.json'],
      }))

      expect(readBundle(directory, 'custom')?.map(loaded => loaded.fragment.package)).toEqual(['maz-ui'])
    })
  })
})

describe('given splitLegacyManifest', () => {
  describe('when splitting the single bundle of an old maz-ui', () => {
    const fragments = splitLegacyManifest(fakeLegacyManifest(), { kind: 'legacy', directory: '/docs' }, '5.2.0')
    const byName = (name: string): Fragment => fragments.find(loaded => loaded.fragment.package === name)?.fragment as Fragment

    it('then one fragment is made per package owning docs', () => {
      expect(fragments.map(loaded => loaded.fragment.package)).toEqual([
        'maz-ui',
        '@maz-ui/themes',
        '@maz-ui/eslint-config',
        '@maz-ui/icons',
      ])
      expect(fragments.every(loaded => loaded.version === '5.2.0' && loaded.source.directory === '/docs')).toBe(true)
    })

    it('then maz-ui gets the components and the Tailwind tokens, icons the icon names', () => {
      expect(byName('maz-ui').tailwind).toBeDefined()
      expect(byName('@maz-ui/themes').tailwind).toBeUndefined()
      expect(byName('@maz-ui/icons').icons?.names).toEqual(['MazTrash'])
      expect(byName('maz-ui').icons).toBeUndefined()
    })

    it('then the group and the description follow the package', () => {
      expect(byName('@maz-ui/eslint-config').group).toBe('tooling')
      expect(byName('@maz-ui/themes').group).toBe('ecosystem')
      expect(byName('@maz-ui/themes').description).toBe('The themes')
      expect(byName('maz-ui').description).toBe('')
    })
  })
})

describe('given installedMazUiPackages', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when packages are installed in the root, a workspace and a parent folder', () => {
    it('then it finds maz-ui and the @maz-ui packages with their version', () => {
      const root = createTempDir()
      const app = join(root, 'apps', 'web')

      mkdirSync(join(app, 'src'), { recursive: true })
      writeFakePackage(root, '@maz-ui/utils', { version: '5.0.1' })
      writeFakePackage(app, 'maz-ui', { version: '5.0.2' })
      writeFakePackage(app, '@maz-ui/themes', { version: '5.0.3' })
      mkdirSync(join(app, 'node_modules/@maz-ui/.hidden'), { recursive: true })

      const found = installedMazUiPackages(join(app, 'src'))

      expect(found.map(item => `${item.name}@${item.version}`).sort()).toEqual(['@maz-ui/themes@5.0.3', '@maz-ui/utils@5.0.1', 'maz-ui@5.0.2'])
      expect(installedMazUiPackages(root).map(item => item.name).sort()).toEqual(['@maz-ui/themes', '@maz-ui/utils', 'maz-ui'])
    })
  })

  describe('when a known name is given', () => {
    it('then it is looked up even without a scope folder', () => {
      const root = createTempDir()

      writeFakePackage(root, 'maz-ui')

      expect(installedMazUiPackages(root, ['maz-ui', 'ghost'])).toEqual([
        {
          name: 'maz-ui',
          directory: join(root, 'node_modules/maz-ui'),
          version: '1.2.3',
        },
      ])
    })
  })

  describe('when the package.json has no version', () => {
    it('then the version is 0.0.0', () => {
      const root = createTempDir()
      const directory = writeFakePackage(root, '@maz-ui/utils')

      writeFileSync(join(directory, 'package.json'), '{}')

      expect(installedMazUiPackages(root)[0].version).toBe('0.0.0')
      expect(findProjectMazUi(root)).toBeUndefined()
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

  describe('when maz-ui has no version', () => {
    it('then the version is 0.0.0', () => {
      const project = createTempDir()
      const directory = writeFakeMazUi(project)

      writeFileSync(join(directory, 'package.json'), '{}')

      expect(findProjectMazUi(project)?.version).toBe('0.0.0')
    })
  })
})

describe('given a Knowledge instance', () => {
  afterEach(() => {
    cleanTempDirs()
  })

  describe('when a doc is read twice', () => {
    it('then the second read comes from the cache', () => {
      const directory = writeFakeFragment(createTempDir())
      const knowledge = fakeKnowledge(fakeFragment(), directory)

      expect(knowledge.readDoc('components/maz-fake')).toContain('Fake content')

      writeFileSync(join(directory, 'components/maz-fake.md'), 'changed')

      expect(knowledge.readDoc('components/maz-fake')).toContain('Fake content')
    })
  })

  describe('when an unknown doc is read', () => {
    it('then it throws', () => {
      const knowledge = fakeKnowledge(fakeFragment(), createTempDir())

      expect(() => knowledge.readDoc('components/nope')).toThrow('Unknown doc "components/nope"')
    })
  })

  describe('when the indexes are built', () => {
    it('then docs, components, icons and tokens are indexed', () => {
      const knowledge = fakeKnowledge(fakeFragment(), createTempDir())

      expect(knowledge.docs).toHaveLength(1)
      expect(knowledge.docsById.has('components/maz-fake')).toBe(true)
      expect(knowledge.iconNames.has('MazTrash')).toBe(true)
      expect(knowledge.componentsByName.size).toBe(0)
      expect(knowledge.tailwind).toBeDefined()
    })
  })

  describe('when asking the version and the owner of a doc', () => {
    it('then the version of a package and the fragment of a doc are returned', () => {
      const knowledge = fakeKnowledge(fakeFragment(), createTempDir())

      expect(knowledge.version).toBe('9.9.9')
      expect(knowledge.versionOf('maz-ui')).toBe('9.9.9')
      expect(knowledge.versionOf('@maz-ui/themes')).toBeUndefined()
      expect(knowledge.fragmentOf('components/maz-fake')?.fragment.package).toBe('maz-ui')
      expect(knowledge.fragmentOf('nope')).toBeUndefined()
    })

    it('then the version is 0.0.0 without maz-ui', () => {
      const knowledge = new Knowledge([
        {
          fragment: themesFragment(),
          version: '1.0.0',
          source: { kind: 'custom', directory: '/d' },
        },
      ])

      expect(knowledge.version).toBe('0.0.0')
      expect(knowledge.tailwind).toBeUndefined()
      expect(knowledge.iconNames.size).toBe(0)
    })
  })

  describe('when two fragments hold the same doc', () => {
    const shared = fakeDoc({
      id: 'guide/shared',
      category: 'guide',
      slug: 'shared',
      title: 'Shared',
      package: '@maz-ui/themes',
      file: 'guide/shared.md',
      symbols: [],
    })
    const foreign = fakeFragment({
      docs: [
        { ...shared, description: 'from maz-ui' },
      ],
      tailwind: undefined,
      icons: undefined,
    })
    const owner = fakeFragment({
      package: '@maz-ui/themes',
      docs: [
        { ...shared, description: 'from themes' },
      ],
      tailwind: undefined,
      icons: undefined,
    })
    const source = { kind: 'custom', directory: '/d' } as const

    it('then the fragment of the owning package wins whatever the order', () => {
      for (const fragments of [
        [foreign, owner],
        [owner, foreign],
      ]) {
        const knowledge = new Knowledge(fragments.map(fragment => ({ fragment, version: '1.0.0', source })))

        expect(knowledge.docsById.get('guide/shared')?.description).toBe('from themes')
        expect(knowledge.fragmentOf('guide/shared')?.fragment.package).toBe('@maz-ui/themes')
        expect(knowledge.docs).toHaveLength(1)
      }
    })

    it('then the first fragment wins when none owns the doc', () => {
      const other = fakeFragment({
        package: '@maz-ui/utils',
        docs: [
          { ...shared, description: 'from utils' },
        ],
        tailwind: undefined,
        icons: undefined,
      })
      const knowledge = new Knowledge([foreign, other].map(fragment => ({ fragment, version: '1.0.0', source })))

      expect(knowledge.docsById.get('guide/shared')?.description).toBe('from maz-ui')
    })
  })

  describe('when a doc relates to docs that are not loaded', () => {
    it('then the missing ids are filtered out', () => {
      const knowledge = fakeKnowledge(fakeFragment({
        docs: [
          fakeDoc({
            related: ['components/maz-other', 'ecosystem/themes'],
          }),
          fakeDoc({ id: 'components/maz-other', slug: 'maz-other', file: 'components/maz-other.md' }),
        ],
      }), createTempDir())

      expect(knowledge.docsById.get('components/maz-fake')?.related).toEqual(['components/maz-other'])
    })
  })
})
