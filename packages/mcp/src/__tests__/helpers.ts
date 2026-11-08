import type { ServerContext } from '../context'
import type { FragmentSource } from '../knowledge/load'
import type { DocEntry, Fragment, LegacyManifest } from '../knowledge/schema'

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContext } from '../context'
import { Knowledge, loadKnowledge } from '../knowledge/load'

export const BUNDLE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../agent-docs')

const tempDirs: string[] = []

export function createTempDir(prefix = 'maz-ui-mcp-'): string {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  tempDirs.push(directory)

  return directory
}

export function cleanTempDirs(): void {
  for (const directory of tempDirs.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
}

let knowledge: Knowledge | undefined
let emptyCwd: string | undefined

export function getEmptyCwd(): string {
  emptyCwd ??= mkdtempSync(join(tmpdir(), 'maz-ui-mcp-empty-'))

  return emptyCwd
}

export function getKnowledge(): Knowledge {
  knowledge ??= loadKnowledge({
    bundledDir: BUNDLE_DIR,
    cwd: getEmptyCwd(),
  })

  return knowledge
}

let context: ServerContext | undefined

export function getContext(): ServerContext {
  context ??= createContext({
    knowledge: getKnowledge(),
    cwd: getEmptyCwd(),
  })

  return context
}

export function createContextFor(cwd: string): ServerContext {
  return createContext({
    knowledge: getKnowledge(),
    cwd,
  })
}

export function fakeDoc(overrides: Partial<DocEntry> = {}): DocEntry {
  return {
    id: 'components/maz-fake',
    category: 'component',
    slug: 'maz-fake',
    title: 'MazFake',
    description: 'A fake component',
    package: 'maz-ui',
    file: 'components/maz-fake.md',
    symbols: ['MazFake'],
    imports: ['import MazFake from \'maz-ui/components/MazFake\''],
    aliases: [],
    headings: [],
    related: [],
    chars: 10,
    ...overrides,
  }
}

export const fakeTailwind: Fragment['tailwind'] = {
  entries: [],
  colors: [],
  radius: [],
  shadows: [],
  breakpoints: [],
  zIndex: [],
  fonts: [],
  durations: [],
  easings: [],
  spacing: [],
  utilities: [],
  variants: [],
  containerVariables: [],
  transitions: [],
}

export function fakeFragment(overrides: Partial<Fragment> = {}): Fragment {
  return {
    schemaVersion: 2,
    package: 'maz-ui',
    version: '9.9.9',
    description: 'A fake package',
    homepage: 'https://maz-ui.com',
    group: 'ecosystem',
    docs: [
      fakeDoc(),
    ],
    components: [],
    icons: {
      names: ['MazTrash'],
    },
    tailwind: fakeTailwind,
    ...overrides,
  }
}

export function fakeKnowledge(fragment: Fragment, directory: string, source: Partial<FragmentSource> = {}): Knowledge {
  return new Knowledge([
    {
      fragment,
      version: fragment.version,
      source: { kind: 'custom', directory, ...source },
    },
  ])
}

export function fakeLegacyManifest(version = '1.2.3'): LegacyManifest {
  return {
    schemaVersion: 1,
    name: 'maz-ui',
    version,
    homepage: 'https://maz-ui.com',
    packages: [
      { name: '@maz-ui/themes', description: 'The themes', docId: 'ecosystem/themes' },
    ],
    docs: [
      fakeDoc(),
      fakeDoc({
        id: 'ecosystem/themes',
        category: 'ecosystem',
        slug: 'themes',
        title: 'Themes',
        package: '@maz-ui/themes',
        file: 'ecosystem/themes.md',
        symbols: [],
      }),
      fakeDoc({
        id: 'ecosystem/eslint-config',
        category: 'ecosystem',
        slug: 'eslint-config',
        title: 'ESLint config',
        package: '@maz-ui/eslint-config',
        file: 'ecosystem/eslint-config.md',
        symbols: [],
      }),
      fakeDoc({
        id: 'reference/icons',
        category: 'reference',
        slug: 'icons',
        title: 'Icons',
        package: '@maz-ui/icons',
        file: 'reference/icons.md',
        symbols: [],
      }),
    ],
    components: [],
    icons: {
      package: '@maz-ui/icons',
      names: ['MazTrash'],
    },
    tailwind: fakeTailwind as NonNullable<Fragment['tailwind']>,
  }
}

const DEFAULT_FILES = { 'components/maz-fake.md': '# MazFake\n\nFake content\n' }

export function writeFakeFragment(directory: string, fragment: unknown = fakeFragment(), files: Record<string, string> = DEFAULT_FILES): string {
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'manifest.json'), JSON.stringify(fragment))

  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(directory, file)), { recursive: true })
    writeFileSync(join(directory, file), content)
  }

  return directory
}

export function shortName(name: string): string {
  return name.replace('@maz-ui/', '')
}

export function writeFakeBundle(directory: string, fragments: Fragment[] = [
  fakeFragment(),
]): string {
  mkdirSync(directory, { recursive: true })

  for (const fragment of fragments) {
    writeFakeFragment(join(directory, shortName(fragment.package)), fragment, Object.fromEntries(fragment.docs.map(doc => [doc.file, `# ${doc.title}\n\nFake content\n`])))
  }

  writeFileSync(join(directory, 'index.json'), JSON.stringify({
    schemaVersion: 2,
    name: 'maz-ui',
    fragments: fragments.map(fragment => `${shortName(fragment.package)}/manifest.json`),
  }))

  return directory
}

export interface FakePackageOptions {
  version?: string
  fragment?: boolean | Fragment
  legacy?: boolean | LegacyManifest
}

export function writeFakePackage(projectDir: string, name: string, { version = '1.2.3', fragment = false, legacy = false }: FakePackageOptions = {}): string {
  const packageDir = join(projectDir, 'node_modules', name)

  mkdirSync(packageDir, { recursive: true })
  writeFileSync(join(packageDir, 'package.json'), JSON.stringify({ name, version }))

  if (fragment) {
    const value = fragment === true
      ? fakeFragment({
          package: name,
          version,
          docs: [
            fakeDoc({ id: `${shortName(name)}/page`, file: `${shortName(name)}/page.md`, package: name }),
          ],
        })
      : fragment

    writeFakeFragment(join(packageDir, 'agent-docs'), value, Object.fromEntries(value.docs.map(doc => [doc.file, `# ${doc.title}\n\nFake content\n`])))
  }

  if (legacy) {
    const manifest = legacy === true
      ? fakeLegacyManifest(version)
      : legacy

    writeFakeFragment(join(packageDir, 'docs'), manifest, Object.fromEntries(manifest.docs.map(doc => [doc.file, `# ${doc.title}\n\nFake content\n`])))
  }

  return packageDir
}

export function writeFakeMazUi(projectDir: string, { version = '1.2.3', withDocs = true } = {}): string {
  return writeFakePackage(projectDir, 'maz-ui', {
    version,
    fragment: withDocs
      ? fakeFragment({ version })
      : false,
  })
}

export function writeFile(directory: string, file: string, content: string): string {
  const path = join(directory, file)

  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)

  return path
}
