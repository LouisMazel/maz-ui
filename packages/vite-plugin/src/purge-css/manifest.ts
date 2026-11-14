import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname, join, resolve } from 'node:path'
import postcss from 'postcss'
import { getRequiredClasses, splitSelectorList } from './selectors'

export const PURGE_MANIFEST_FILE = 'purge-manifest.json'

export interface PurgeManifestEntry {
  /** Names that reveal the entry in the source code: `MazBtn`, `maz-btn`, `useToast`, `v-tooltip`... */
  aliases: string[]
  /** Indexes in `classes` of the classes the entry renders, with the entries it imports */
  classes: number[]
}

export interface PurgeManifest {
  version: string
  /** Every `maz:` class of `maz-ui/style.css` */
  classes: string[]
  /** The public utilities of `maz-ui/utilities.css` (`text-title-1`, `padded-container`...) */
  utilities: string[]
  /** Keyed by the path of the entry in `maz-ui` (`components/MazBtn`, `plugins/toast`) */
  entries: Record<string, PurgeManifestEntry>
}

const ENTRY_DIRECTORIES = [
  'components',
  'composables',
  'directives',
  'plugins',
] as const
const IMPORT_PATTERN = /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["'](\.{1,2}\/[^"']+)["']/g
const EXPORT_PATTERN = /export\s*\{([^}]*)\}/g
const NAME_CHAR = /[\w$]/
const CLASS_CHAR = /[\w-]/

function toKebabCase(value: string): string {
  return value.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Collect the classes of the selectors of a CSS file, with a filter on their name */
export function collectClasses(css: string, filter: (className: string) => boolean): string[] {
  const classes = new Set<string>()

  postcss.parse(css).walkRules((rule) => {
    for (const selector of splitSelectorList(rule.selector)) {
      for (const className of getRequiredClasses(selector)) {
        if (filter(className))
          classes.add(className)
      }
    }
  })

  return [...classes].sort()
}

/**
 * `true` when `token` is in `content` as a whole word: the characters around it can not continue a class name nor
 * an identifier (`maz:p-2` is not found in `maz:p-2.5`, `MazBtn` is not found in `MazBtnGroup`)
 */
export function containsToken(content: string, token: string, isTokenChar: (char: string) => boolean = char => CLASS_CHAR.test(char)): boolean {
  let index = content.indexOf(token)

  while (index !== -1) {
    const before = index === 0
      ? ''
      : content[index - 1]!
    const after = content[index + token.length] ?? ''
    const isDecimal = after === '.' && /\d/.test(content[index + token.length + 1] ?? '')

    if (!isTokenChar(before) && !isTokenChar(after) && after !== '!' && after !== '/' && !isDecimal)
      return true

    index = content.indexOf(token, index + 1)
  }

  return false
}

/** `true` when a name (`MazBtn`, `useToast`, `v-tooltip`) is in `content` as a whole identifier */
export function containsName(content: string, name: string): boolean {
  return containsToken(content, name, char => NAME_CHAR.test(char) || char === '-')
}

function readModules(distDir: string, file: string, seen: Set<string>): string {
  if (seen.has(file) || !existsSync(file))
    return ''

  seen.add(file)
  const code = readFileSync(file, 'utf8')
  let content = code

  for (const match of code.matchAll(IMPORT_PATTERN))
    content += `\n${readModules(distDir, resolve(dirname(file), match[1]!), seen)}`

  return content
}

function getAliases(directory: string, name: string, code: string): string[] {
  const aliases = new Set<string>()

  if (directory === 'components') {
    aliases.add(name)
    aliases.add(toKebabCase(name))
    aliases.add(`Lazy${name}`)
  }

  for (const match of code.matchAll(EXPORT_PATTERN)) {
    for (const specifier of match[1]!.split(',')) {
      const exported = specifier.trim().split(/\s+/).pop()
      if (exported && exported !== 'default')
        aliases.add(exported)
    }
  }

  if (directory === 'directives') {
    for (const alias of [...aliases]) {
      if (/^v[A-Z]/.test(alias) && !alias.endsWith('Install'))
        aliases.add(toKebabCase(alias))
    }
  }

  return [...aliases].sort()
}

/**
 * Write `dist/css/purge-manifest.json` in the build of `maz-ui`: the `maz:` classes of `style.css`, the public
 * utilities of `utilities.css`, and for every entry the classes it renders with the modules it imports.
 */
export function generatePurgeManifest(distDir: string, version: string): PurgeManifest {
  const classes = collectClasses(readFileSync(join(distDir, 'css/main.css'), 'utf8'), className => className.startsWith('maz:'))
  const utilitiesFile = join(distDir, 'css/utilities.css')
  const utilities = existsSync(utilitiesFile)
    ? collectClasses(readFileSync(utilitiesFile, 'utf8'), () => true)
    : []

  const entries: Record<string, PurgeManifestEntry> = {}

  for (const directory of ENTRY_DIRECTORIES) {
    const folder = join(distDir, directory)
    if (!existsSync(folder))
      continue

    for (const file of readdirSync(folder)) {
      if (!file.endsWith('.js') || file === 'index.js')
        continue

      const path = join(folder, file)
      const name = basename(file, '.js')
      const content = readModules(distDir, path, new Set())

      entries[`${directory}/${name}`] = {
        aliases: getAliases(directory, name, readFileSync(path, 'utf8')),
        classes: classes.flatMap((className, index) => containsToken(content, className)
          ? [index]
          : []),
      }
    }
  }

  const manifest: PurgeManifest = { version, classes, utilities, entries }

  writeFileSync(join(distDir, 'css', PURGE_MANIFEST_FILE), JSON.stringify(manifest))

  return manifest
}

/** Read the manifest of the `maz-ui` installed in the project */
export function loadPurgeManifest(root: string): PurgeManifest | undefined {
  try {
    const require = createRequire(join(root, 'package.json'))
    const file = require.resolve(`maz-ui/${PURGE_MANIFEST_FILE}`)

    return JSON.parse(readFileSync(file, 'utf8')) as PurgeManifest
  }
  catch {
    return undefined
  }
}
