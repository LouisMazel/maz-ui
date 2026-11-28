import type { SourcePaths } from '../paths.ts'
import type { SourcePage } from './pages.ts'

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ECOSYSTEM_SYMBOLS } from '../aliases.ts'
import { extractCodeBlocks } from '../markdown/clean.ts'
import { kebabToCamel, kebabToPascal, unique } from '../utils/strings.ts'

export interface ImportStatement {
  specifier: string
  names: string[]
  defaultName?: string
  typeOnly: boolean
}

export interface PageSymbols {
  symbols: string[]
  imports: string[]
}

const IMPORT_REGEX = /import\s+(type\s+)?([\w$]+)?\s*(?:,\s*)?(?:\{([^}]*)\})?\s*from\s*['"]([^'"]+)['"]/g
const ECOSYSTEM_SPECIFIER = /^(?:maz-ui|@maz-ui\/[\w-]+)(?:\/|$)/

export function extractImports(code: string): ImportStatement[] {
  return [
    ...code.matchAll(IMPORT_REGEX),
  ].map((match) => {
    const [, typeKeyword, defaultName, named, specifier] = match
    const names = (named ?? '')
      .split(',')
      .map(name => name.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim())
      .filter(Boolean)

    return {
      specifier,
      names,
      ...(defaultName
        ? { defaultName }
        : {}),
      typeOnly: !!typeKeyword,
    }
  })
}

export function formatImport(statement: ImportStatement): string {
  const parts: string[] = []

  if (statement.defaultName)
    parts.push(statement.defaultName)
  if (statement.names.length > 0)
    parts.push(`{ ${statement.names.join(', ')} }`)

  return `import ${statement.typeOnly ? 'type ' : ''}${parts.join(', ')} from '${statement.specifier}'`
}

export function parseExportedNames(source: string, { runtimeOnly = false } = {}): string[] {
  const declarationRegex = runtimeOnly
    ? /export\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|const|let|class)\s+([\w$]+)/g
    : /export\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|const|let|class|type|interface|enum)\s+([\w$]+)/g
  const names = [
    ...source.matchAll(declarationRegex),
  ].map(match => match[1])

  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const entry of match[1].split(',')) {
      const name = entry.trim().replace(/^type\s+/, '').split(/\s+as\s+/).at(-1)?.trim()

      if (name && (!runtimeOnly || !entry.trim().startsWith('type ')))
        names.push(name)
    }
  }

  return unique(names)
}

/** The JSDoc right above the declaration of `name` has a `@deprecated` tag */
export function isDeprecatedExport(source: string, name: string): boolean {
  const declaration = new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*)\\*/\\s*(?://[^\\n]*\\n\\s*)*export (?:const|function|class) ${name}\\b`).exec(source)

  return !!declaration && /@deprecated\b/.test(declaration[1])
}

function readExports(file: string, runtimeOnly = true): string[] {
  return existsSync(file)
    ? parseExportedNames(readFileSync(file, 'utf8'), { runtimeOnly })
    : []
}

function pageImports(page: SourcePage): ImportStatement[] {
  return extractCodeBlocks(page.body).flatMap(extractImports)
}

/** Case-sensitive, unlike `existsSync` on macOS: `IdleTimeout` is not the module `idleTimeout` */
function isHelper(name: string, paths: SourcePaths): boolean {
  return existsSync(paths.utilsHelpers) && readdirSync(paths.utilsHelpers).includes(`${name}.ts`)
}

function resolveUtilHelper(page: SourcePage, paths: SourcePaths): string | undefined {
  const imports = pageImports(page)
  const counts = new Map<string, number>()

  for (const statement of imports) {
    const match = /^@maz-ui\/utils\/helpers\/(\w+)$/.exec(statement.specifier)

    if (match)
      counts.set(match[1], (counts.get(match[1]) ?? 0) + 1)
  }

  const fromSpecifier = [
    ...counts.entries(),
  ].sort((a, b) => b[1] - a[1])[0]?.[0]

  if (fromSpecifier && isHelper(fromSpecifier, paths))
    return fromSpecifier

  const rootNames = imports
    .filter(statement => statement.specifier === '@maz-ui/utils' || statement.specifier === '@maz-ui/utils/helpers')
    .flatMap(statement => statement.names)

  for (const name of rootNames) {
    if (isHelper(name, paths))
      return name
  }

  return [
    kebabToCamel(page.slug),
    kebabToPascal(page.slug),
  ].find(candidate => isHelper(candidate, paths))
}

function genericImports(page: SourcePage): PageSymbols {
  const statements = pageImports(page).filter(statement =>
    ECOSYSTEM_SPECIFIER.test(statement.specifier) && (statement.specifier === page.package || statement.specifier.startsWith(`${page.package}/`)),
  )
  const imports = unique(statements.map(formatImport)).slice(0, 4)
  const symbols = unique(statements.flatMap(statement => [statement.defaultName, ...statement.names]).filter((name): name is string => !!name)).slice(0, 8)

  return { symbols, imports }
}

function pluginSymbols(page: SourcePage, paths: SourcePaths): PageSymbols {
  const file = join(paths.libPlugins, `${page.slug}.ts`)
  const plugin = readExports(file).find(name => name.endsWith('Plugin'))
  const composable = `use${kebabToPascal(page.slug)}`

  // A deprecated plugin is replaced by its composable, that works without it
  if (plugin && isDeprecatedExport(readFileSync(file, 'utf8'), plugin) && existsSync(join(paths.libComposables, `${composable}.ts`))) {
    return {
      symbols: [composable],
      imports: [`import { ${composable} } from 'maz-ui/composables/${composable}'`],
    }
  }

  return plugin
    ? {
        symbols: [plugin],
        imports: [`import { ${plugin} } from 'maz-ui/plugins/${page.slug}'`],
      }
    : genericImports(page)
}

export function resolvePageSymbols(page: SourcePage, paths: SourcePaths): PageSymbols {
  const curated = ECOSYSTEM_SYMBOLS[page.id]

  if (curated)
    return curated

  switch (page.category) {
    case 'composable': {
      const name = kebabToCamel(page.slug)

      return existsSync(join(paths.libComposables, `${name}.ts`))
        ? {
            symbols: [name],
            imports: [`import { ${name} } from 'maz-ui/composables/${name}'`],
          }
        : genericImports(page)
    }
    case 'directive': {
      const name = `v${kebabToPascal(page.slug)}`
      const exists = existsSync(join(paths.libDirectives, `${name}.ts`)) || existsSync(join(paths.libDirectives, name))

      return exists
        ? {
            symbols: [name],
            imports: [`import { ${name} } from 'maz-ui/directives/${name}'`],
          }
        : genericImports(page)
    }
    case 'plugin':
      return pluginSymbols(page, paths)
    case 'util': {
      if (page.id.startsWith('ecosystem/utils/types/')) {
        const name = kebabToPascal(page.slug)

        return existsSync(join(paths.utilsTsHelpers, `${name}.ts`))
          ? {
              symbols: [name],
              imports: [`import type { ${name} } from '@maz-ui/utils/ts-helpers/${name}'`],
            }
          : genericImports(page)
      }

      const helper = resolveUtilHelper(page, paths)

      if (!helper)
        return genericImports(page)

      const symbols = readExports(join(paths.utilsHelpers, `${helper}.ts`))

      return {
        symbols,
        imports: [`import { ${symbols.join(', ')} } from '@maz-ui/utils/helpers/${helper}'`],
      }
    }
    case 'node': {
      const name = kebabToCamel(page.slug)
      const symbols = readExports(join(paths.root, 'packages/node/src', `${name}.ts`))

      const main = symbols.includes(name)
        ? [name]
        : symbols

      return symbols.length > 0
        ? {
            symbols,
            imports: [`import { ${main.join(', ')} } from '@maz-ui/node'`],
          }
        : genericImports(page)
    }
    case 'guide':
      return { symbols: [], imports: [] }
    default:
      return genericImports(page)
  }
}
