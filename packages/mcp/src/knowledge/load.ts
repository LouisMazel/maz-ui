import type { ComponentApi, DocEntry, Fragment, LegacyManifest, PackageGroup, TailwindTokens } from './schema'

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findProjectPackage, findWorkspaceDirs, readPackageVersion } from '@maz-ui/node'
import { bundleIndexSchema, fragmentSchema, legacyManifestSchema, SUPPORTED_SCHEMA_VERSION } from './schema'

/** Folder of the agent docs of a package (`node_modules/maz-ui/agent-docs`) and of the bundle of @maz-ui/mcp */
export const FRAGMENT_DIR = 'agent-docs'
/** Folder of the single bundle shipped by maz-ui before the docs were split per package */
export const LEGACY_DIR = 'docs'

const MAZ_UI = 'maz-ui'
const TOOLING_PACKAGES = new Set([
  '@maz-ui/node',
  '@maz-ui/eslint-config',
  '@maz-ui/stylelint-config',
  '@maz-ui/upgrade',
])

/**
 * - `custom`: `--docs` or `MAZ_UI_DOCS_DIR`
 * - `project`: `agent-docs` of a package installed in the project
 * - `legacy`: `docs` of an installed maz-ui from before the split, shared by the packages released with it
 * - `bundled`: shipped with @maz-ui/mcp (the package is not installed, or without docs)
 */
export type KnowledgeSourceKind = 'custom' | 'project' | 'legacy' | 'bundled'

export interface FragmentSource {
  kind: KnowledgeSourceKind
  /** Folder holding the files of the fragment */
  directory: string
  /** Version of the package installed in the project, when found (set on `bundled` sources) */
  installedVersion?: string
}

export interface LoadedFragment {
  fragment: Fragment
  source: FragmentSource
  /** Version of the documented package, read from its package.json when possible: the docs are generated before the release bumps the version */
  version: string
}

export interface LoadKnowledgeOptions {
  /** Explicit bundle (`index.json`), fragment (`manifest.json`) or legacy docs folder (takes precedence over everything) */
  docsDir?: string
  /** Project root used to find the installed packages (defaults to `process.cwd()`) */
  cwd?: string
  /** Bundle shipped with @maz-ui/mcp */
  bundledDir?: string
}

export interface InstalledPackage {
  name: string
  directory: string
  version: string
}

export class Knowledge {
  readonly fragmentsByPackage: Map<string, LoadedFragment>
  readonly docs: DocEntry[]
  readonly docsById: Map<string, DocEntry>
  readonly components: ComponentApi[]
  readonly componentsByName: Map<string, ComponentApi>
  readonly iconNames: Set<string>
  readonly tailwind: TailwindTokens | undefined
  private readonly owners = new Map<string, LoadedFragment>()
  private readonly cache = new Map<string, string>()

  constructor(readonly fragments: LoadedFragment[]) {
    this.fragmentsByPackage = new Map(fragments.map(loaded => [loaded.fragment.package, loaded]))

    const owned = new Map<string, { doc: DocEntry, loaded: LoadedFragment, owner: boolean }>()

    for (const loaded of fragments) {
      for (const doc of loaded.fragment.docs) {
        const owner = doc.package === loaded.fragment.package
        const current = owned.get(doc.id)

        if (!current || (owner && !current.owner))
          owned.set(doc.id, { doc, loaded, owner })
      }
    }

    this.docs = [
      ...owned.values(),
    ].map(({ doc }) => ({
      ...doc,
      related: doc.related.filter(id => owned.has(id)),
    }))
    this.docsById = new Map(this.docs.map(doc => [doc.id, doc]))

    for (const [id, { loaded }] of owned)
      this.owners.set(id, loaded)

    this.components = fragments.flatMap(loaded => loaded.fragment.components)
    this.componentsByName = new Map(this.components.map(component => [component.name, component]))
    this.iconNames = new Set(fragments.flatMap(loaded => loaded.fragment.icons?.names ?? []))
    this.tailwind = fragments.find(loaded => loaded.fragment.tailwind)?.fragment.tailwind
  }

  /** Version of maz-ui */
  get version(): string {
    return this.versionOf(MAZ_UI) ?? '0.0.0'
  }

  versionOf(packageName: string): string | undefined {
    return this.fragmentsByPackage.get(packageName)?.version
  }

  fragmentOf(docId: string): LoadedFragment | undefined {
    return this.owners.get(docId)
  }

  readDoc(id: string): string {
    const cached = this.cache.get(id)

    if (cached !== undefined)
      return cached

    const doc = this.docsById.get(id)

    if (!doc)
      throw new Error(`Unknown doc "${id}"`)

    const content = readFileSync(join((this.owners.get(id) as LoadedFragment).source.directory, doc.file), 'utf8')
    this.cache.set(id, content)

    return content
  }
}

export function defaultBundledDir(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(here, `../${FRAGMENT_DIR}`),
    resolve(here, `../../${FRAGMENT_DIR}`),
  ]

  return candidates.find(candidate => existsSync(join(candidate, 'index.json'))) ?? candidates[0]
}

function readJson(file: string): unknown {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  }
  catch {
    return undefined
  }
}

/** Reads and validates the `manifest.json` of a fragment folder */
export function readFragment(directory: string): Fragment | undefined {
  const parsed = fragmentSchema.safeParse(readJson(join(directory, 'manifest.json')))

  return parsed.success
    ? parsed.data
    : undefined
}

export function readLegacyManifest(directory: string): LegacyManifest | undefined {
  const parsed = legacyManifestSchema.safeParse(readJson(join(directory, 'manifest.json')))

  return parsed.success
    ? parsed.data
    : undefined
}

/** Reads the fragments listed by the `index.json` of a bundle folder, invalid ones are ignored */
export function readBundle(directory: string, kind: KnowledgeSourceKind): LoadedFragment[] | undefined {
  const index = bundleIndexSchema.safeParse(readJson(join(directory, 'index.json')))

  if (!index.success)
    return undefined

  return index.data.fragments.flatMap((manifest) => {
    const fragmentDir = join(directory, dirname(manifest))
    const fragment = readFragment(fragmentDir)

    return fragment
      ? [
          {
            fragment,
            source: { kind, directory: fragmentDir },
            version: fragment.version,
          },
        ]
      : []
  })
}

/** Splits the single bundle of the old maz-ui versions per package */
export function splitLegacyManifest(manifest: LegacyManifest, source: FragmentSource, version: string): LoadedFragment[] {
  const descriptions = new Map(manifest.packages.map(entry => [entry.name, entry.description]))

  return [
    ...new Set(manifest.docs.map(doc => doc.package)),
  ].map((name) => {
    const group: PackageGroup = TOOLING_PACKAGES.has(name)
      ? 'tooling'
      : 'ecosystem'

    return {
      fragment: {
        schemaVersion: SUPPORTED_SCHEMA_VERSION,
        package: name,
        version,
        description: descriptions.get(name) ?? '',
        homepage: manifest.homepage,
        group,
        docs: manifest.docs.filter(doc => doc.package === name),
        components: name === MAZ_UI
          ? manifest.components
          : [],
        ...(name === MAZ_UI
          ? { tailwind: manifest.tailwind }
          : {}),
        ...(name === manifest.icons.package
          ? {
              icons: { names: manifest.icons.names },
            }
          : {}),
      },
      source,
      version,
    }
  })
}

function ancestors(directory: string): string[] {
  const parent = dirname(directory)

  return parent === directory
    ? []
    : [
        parent,
        ...ancestors(parent),
      ]
}

/**
 * maz-ui and the `@maz-ui/*` packages installed in the project: in the project root, its workspaces and its parent
 * folders. `known` names are looked up even when no folder lists them, the others are discovered in the `@maz-ui`
 * scope of the `node_modules` folders.
 */
export function installedMazUiPackages(cwd: string, known: string[] = []): InstalledPackage[] {
  const discovered = [
    cwd,
    ...findWorkspaceDirs(cwd),
    ...ancestors(cwd),
  ].flatMap((base) => {
    const scope = join(base, 'node_modules', '@maz-ui')

    return existsSync(scope)
      ? readdirSync(scope).filter(entry => !entry.startsWith('.')).map(entry => `@maz-ui/${entry}`)
      : []
  })

  return [
    ...new Set([
      MAZ_UI,
      ...known,
      ...discovered,
    ]),
  ].flatMap((name) => {
    const directory = findProjectPackage(cwd, name)

    return directory
      ? [
          { name, directory, version: readPackageVersion(directory) ?? '0.0.0' },
        ]
      : []
  })
}

/** Finds the maz-ui package installed in the project, monorepo workspace folders included */
export function findProjectMazUi(cwd: string): { directory: string, version: string } | undefined {
  const directory = findProjectPackage(cwd, MAZ_UI)

  return directory
    ? { directory, version: readPackageVersion(directory) ?? '0.0.0' }
    : undefined
}

function readInstalledFragment(installed: InstalledPackage): LoadedFragment | undefined {
  const directory = join(installed.directory, FRAGMENT_DIR)
  const fragment = readFragment(directory)

  return fragment?.package === installed.name
    ? {
        fragment,
        source: { kind: 'project', directory },
        version: installed.version,
      }
    : undefined
}

/** Fragments of an installed maz-ui from before the split, by package */
function readInstalledLegacy(mazUi: InstalledPackage | undefined): Map<string, LoadedFragment> {
  if (!mazUi)
    return new Map()

  const directory = join(mazUi.directory, LEGACY_DIR)
  const manifest = readLegacyManifest(directory)

  return new Map((manifest
    ? splitLegacyManifest(manifest, { kind: 'legacy', directory }, mazUi.version)
    : []).map(loaded => [loaded.fragment.package, loaded]))
}

/** Explicit `--docs`: a bundle replaces the bundled one, a fragment or a legacy folder pins its package */
function readExplicit(directory: string): { replacesBundle: boolean, fragments: LoadedFragment[] } {
  const bundle = readBundle(directory, 'custom')

  if (bundle)
    return { replacesBundle: true, fragments: bundle }

  const source: FragmentSource = { kind: 'custom', directory }
  const version = readPackageVersion(dirname(directory))
  const fragment = readFragment(directory)

  if (fragment) {
    return {
      replacesBundle: false,
      fragments: [
        { fragment, source, version: version ?? fragment.version },
      ],
    }
  }

  const legacy = readLegacyManifest(directory)

  if (legacy) {
    return {
      replacesBundle: false,
      fragments: splitLegacyManifest(legacy, source, version ?? legacy.version).filter(loaded => loaded.fragment.package === MAZ_UI),
    }
  }

  throw new Error(`No valid maz-ui docs (index.json or manifest.json) in ${directory}`)
}

/** maz-ui first, then the other packages by name */
function createKnowledge(fragments: LoadedFragment[], directory: string): Knowledge {
  if (!fragments.some(loaded => loaded.fragment.package === MAZ_UI))
    throw new Error(`The docs of maz-ui are missing or invalid (${directory}). Reinstall @maz-ui/mcp.`)

  return new Knowledge(fragments.sort((a, b) => Number(b.fragment.package === MAZ_UI) - Number(a.fragment.package === MAZ_UI) || a.fragment.package.localeCompare(b.fragment.package)))
}

/**
 * Loads the docs of every package, each from the best source: an explicit `--docs`, the `agent-docs` of the package
 * installed in the project, the legacy `docs` of an installed maz-ui released together with the package, else the
 * docs bundled with @maz-ui/mcp.
 */
export function loadKnowledge(options: LoadKnowledgeOptions = {}): Knowledge {
  const explicit = options.docsDir ?? process.env.MAZ_UI_DOCS_DIR
  const pinned = explicit
    ? readExplicit(explicit)
    : undefined

  if (pinned?.replacesBundle)
    return createKnowledge(pinned.fragments, explicit as string)

  const bundledDir = options.bundledDir ?? defaultBundledDir()
  const bundled = readBundle(bundledDir, 'bundled') ?? []
  const installed = installedMazUiPackages(options.cwd ?? process.cwd(), bundled.map(loaded => loaded.fragment.package))
  const installedByName = new Map(installed.map(item => [item.name, item]))
  const mazUi = installedByName.get(MAZ_UI)
  const legacy = readInstalledLegacy(mazUi)
  const selected = new Map<string, LoadedFragment>()
  const select = (loaded: LoadedFragment | undefined): void => {
    if (loaded && !selected.has(loaded.fragment.package))
      selected.set(loaded.fragment.package, loaded)
  }

  for (const loaded of pinned?.fragments ?? [])
    select(loaded)

  for (const item of installed)
    select(readInstalledFragment(item))

  for (const item of installed) {
    if (item.name === MAZ_UI || item.version === mazUi?.version)
      select(legacy.get(item.name))
  }

  for (const loaded of bundled) {
    select({
      ...loaded,
      source: { ...loaded.source, installedVersion: installedByName.get(loaded.fragment.package)?.version },
    })
  }

  return createKnowledge([
    ...selected.values(),
  ], bundledDir)
}
