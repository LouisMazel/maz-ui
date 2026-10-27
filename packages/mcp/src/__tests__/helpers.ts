import type { ServerContext } from '../context'
import type { Knowledge } from '../knowledge/load'
import type { DocEntry, Manifest } from '../knowledge/schema'

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContext } from '../context'
import { loadKnowledge } from '../knowledge/load'

export const BUNDLE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs')

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
  knowledge ??= loadKnowledge({ bundledDir: BUNDLE_DIR, cwd: getEmptyCwd() })

  return knowledge
}

let context: ServerContext | undefined

export function getContext(): ServerContext {
  context ??= createContext({ knowledge: getKnowledge(), cwd: getEmptyCwd() })

  return context
}

export function createContextFor(cwd: string): ServerContext {
  return createContext({ knowledge: getKnowledge(), cwd })
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

export function fakeManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    schemaVersion: 1,
    name: 'maz-ui',
    version: '9.9.9',
    homepage: 'https://maz-ui.com',
    packages: [],
    docs: [fakeDoc()],
    components: [],
    icons: { package: '@maz-ui/icons', names: ['MazTrash'] },
    tailwind: {
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
    },
    ...overrides,
  }
}

export function writeFakeBundle(directory: string, manifest: unknown = fakeManifest(), files: Record<string, string> = { 'components/maz-fake.md': '# MazFake\n\nFake content\n' }): string {
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'manifest.json'), JSON.stringify(manifest))

  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(directory, file)), { recursive: true })
    writeFileSync(join(directory, file), content)
  }

  return directory
}

export function writeFakeMazUi(projectDir: string, { version = '1.2.3', withDocs = true } = {}): string {
  const packageDir = join(projectDir, 'node_modules', 'maz-ui')

  mkdirSync(packageDir, { recursive: true })
  writeFileSync(join(packageDir, 'package.json'), JSON.stringify({ name: 'maz-ui', version }))

  if (withDocs)
    writeFakeBundle(join(packageDir, 'docs'), fakeManifest({ version }))

  return packageDir
}

export function writeFile(directory: string, file: string, content: string): string {
  const path = join(directory, file)

  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)

  return path
}
