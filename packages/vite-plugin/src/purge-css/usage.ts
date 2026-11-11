import type { PurgeManifest } from './manifest'
import { readFile } from 'node:fs/promises'
import { glob } from 'tinyglobby'
import { containsName, containsToken } from './manifest'

export const DEFAULT_CONTENT = ['**/*.{vue,js,jsx,mjs,cjs,ts,tsx,mts,cts,html,md,mdx,astro,svelte}']

export const DEFAULT_IGNORE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.output/**',
  '**/.nuxt/**',
  '**/.vercel/**',
  '**/.netlify/**',
  '**/.git/**',
  '**/.vite/**',
  '**/.vitepress/cache/**',
  '**/.vitepress/dist/**',
  '**/coverage/**',
  '**/*.d.ts',
]

/** A namespace import of a barrel registers all its entries (`import * as components from 'maz-ui/components'`) */
const NAMESPACE_IMPORT = /import\s*\*\s*as\s+[\w$]+\s+from\s*["']maz-ui\/(components|composables|directives|plugins)["']/g

export interface UsageOptions {
  /** Globs of the files to scan, relative to the root of the project */
  content: string[]
  /** Entries always kept: `MazBtn`, `components/MazBtn`, `plugins/toast`, `vTooltip`... */
  entries: string[]
  /** Classes always kept, `maz:` classes or public utilities */
  safelist: (string | RegExp)[]
}

export interface Usage {
  /** The entries of `maz-ui` found in the project, keyed like the manifest */
  entries: Set<string>
  /** The `maz:` classes and the public utilities to keep */
  classes: Set<string>
}

export async function readContent(root: string, content: string[], ignore: string[] = DEFAULT_IGNORE): Promise<string> {
  if (content.length === 0)
    return ''

  const files = await glob(content, {
    cwd: root,
    absolute: true,
    ignore,
    dot: false,
  })

  const sources = await Promise.all(files.map(file => readFile(file, 'utf8').catch(() => '')))

  return sources.join('\n')
}

function matchesEntry(key: string, aliases: string[], wanted: string): boolean {
  return key === wanted || key.endsWith(`/${wanted}`) || aliases.includes(wanted)
}

/** The entries and the classes the scanned code uses */
export function resolveUsage(manifest: PurgeManifest, source: string, options: Pick<UsageOptions, 'entries' | 'safelist'>): Usage {
  const entries = new Set<string>()
  const namespaces = new Set([
    ...source.matchAll(NAMESPACE_IMPORT),
  ].map(match => match[1]))

  for (const [key, { aliases }] of Object.entries(manifest.entries)) {
    const directory = key.split('/')[0]!

    if (
      namespaces.has(directory)
      || options.entries.some(wanted => matchesEntry(key, aliases, wanted))
      || aliases.some(alias => containsName(source, alias))
    ) {
      entries.add(key)
    }
  }

  const classes = new Set<string>()

  for (const key of entries) {
    for (const index of manifest.entries[key]!.classes)
      classes.add(manifest.classes[index]!)
  }

  for (const utility of manifest.utilities) {
    if (containsToken(source, utility))
      classes.add(utility)
  }

  const patterns = options.safelist.filter((item): item is RegExp => item instanceof RegExp)
  const names = new Set(options.safelist.filter((item): item is string => typeof item === 'string'))

  for (const className of [
    ...manifest.classes,
    ...manifest.utilities,
  ]) {
    if (names.has(className) || patterns.some((pattern) => {
      pattern.lastIndex = 0

      return pattern.test(className)
    })) {
      classes.add(className)
    }
  }

  return { entries, classes }
}
