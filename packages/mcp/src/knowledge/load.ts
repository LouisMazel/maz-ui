import type { ComponentApi, DocEntry, Manifest } from './schema'

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findInstalledPackage } from '@maz-ui/node'
import { manifestSchema } from './schema'

export type KnowledgeSourceKind = 'custom' | 'project' | 'bundled'

export interface KnowledgeSource {
  kind: KnowledgeSourceKind
  /** Directory of the bundle (`.../docs`) */
  directory: string
  /** maz-ui version installed in the project, when found */
  projectVersion?: string
}

export interface LoadKnowledgeOptions {
  /** Explicit bundle directory (takes precedence over everything) */
  docsDir?: string
  /** Project root used to find the installed maz-ui (defaults to `process.cwd()`) */
  cwd?: string
  /** Bundle shipped with @maz-ui/mcp */
  bundledDir?: string
}

export class Knowledge {
  readonly docsById: Map<string, DocEntry>
  readonly componentsByName: Map<string, ComponentApi>
  readonly iconNames: Set<string>
  private readonly cache = new Map<string, string>()

  constructor(readonly manifest: Manifest, readonly source: KnowledgeSource) {
    this.docsById = new Map(manifest.docs.map(doc => [doc.id, doc]))
    this.componentsByName = new Map(manifest.components.map(component => [component.name, component]))
    this.iconNames = new Set(manifest.icons.names)
  }

  get version(): string {
    return this.manifest.version
  }

  get docs(): DocEntry[] {
    return this.manifest.docs
  }

  readDoc(id: string): string {
    const cached = this.cache.get(id)

    if (cached !== undefined)
      return cached

    const doc = this.docsById.get(id)

    if (!doc)
      throw new Error(`Unknown doc "${id}"`)

    const content = readFileSync(join(this.source.directory, doc.file), 'utf8')
    this.cache.set(id, content)

    return content
  }

  readFile(relativePath: string): string | undefined {
    const file = join(this.source.directory, relativePath)

    return existsSync(file) ? readFileSync(file, 'utf8') : undefined
  }
}

export function defaultBundledDir(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [resolve(here, '../docs'), resolve(here, '../../docs')]

  return candidates.find(candidate => existsSync(join(candidate, 'manifest.json'))) ?? candidates[0]
}

export function readManifest(directory: string): Manifest | undefined {
  const file = join(directory, 'manifest.json')

  if (!existsSync(file))
    return undefined

  const parsed = manifestSchema.safeParse(JSON.parse(readFileSync(file, 'utf8')))

  return parsed.success ? parsed.data : undefined
}

/**
 * Finds the maz-ui package installed in the project: in the `node_modules`
 * of the project root and of its direct workspace folders (`apps/*`,
 * `packages/*`, for monorepos without hoisting), then in the parent folders.
 */
export function findProjectMazUi(cwd: string): { directory: string, version: string } | undefined {
  const bases = [cwd]

  for (const folder of ['apps', 'packages']) {
    const root = join(cwd, folder)

    if (existsSync(root)) {
      for (const entry of readdirSync(root, { withFileTypes: true })) {
        if (entry.isDirectory())
          bases.push(join(root, entry.name))
      }
    }
  }

  const directory = bases
    .map(base => join(base, 'node_modules', 'maz-ui'))
    .find(candidate => existsSync(join(candidate, 'package.json')))
    ?? findInstalledPackage(cwd, 'maz-ui')

  if (!directory)
    return undefined

  const { version } = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')) as { version: string }

  return { directory, version }
}

export function loadKnowledge(options: LoadKnowledgeOptions = {}): Knowledge {
  const explicit = options.docsDir ?? process.env.MAZ_UI_DOCS_DIR

  if (explicit) {
    const manifest = readManifest(explicit)

    if (!manifest)
      throw new Error(`No valid maz-ui docs bundle (manifest.json) in ${explicit}`)

    return new Knowledge(manifest, { kind: 'custom', directory: explicit })
  }

  const project = findProjectMazUi(options.cwd ?? process.cwd())

  if (project) {
    const directory = join(project.directory, 'docs')
    const manifest = readManifest(directory)

    if (manifest)
      return new Knowledge(manifest, { kind: 'project', directory, projectVersion: project.version })
  }

  const bundledDir = options.bundledDir ?? defaultBundledDir()
  const manifest = readManifest(bundledDir)

  if (!manifest)
    throw new Error(`The docs bundle of @maz-ui/mcp is missing or invalid (${bundledDir}). Reinstall the package.`)

  return new Knowledge(manifest, { kind: 'bundled', directory: bundledDir, projectVersion: project?.version })
}
