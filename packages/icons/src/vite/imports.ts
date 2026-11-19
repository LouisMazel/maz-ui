import type MagicString from 'magic-string'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export const ICONS_PACKAGE = '@maz-ui/icons'
const IMPORT_PATTERN = /import\s*\{([^}]*)\}\s*from\s*(["'])@maz-ui\/icons(?:\/(raw|static|lazy))?\2;?/g
const ICON_FILE_PATTERN = /^(Maz\w+)\.(?:js|ts)$/

/** The ids of the icons of `@maz-ui/icons` (`MazStar`), from the files of its `raw` variant */
export function loadIconIds(packageDir: string): Set<string> {
  const directory = [
    join(packageDir, 'dist/raw'),
    join(packageDir, 'src/raw'),
  ].find(path => existsSync(path))

  return new Set(directory
    ? readdirSync(directory).flatMap(file => ICON_FILE_PATTERN.exec(file)?.[1] ?? [])
    : [])
}

/** `LazyMazHome as Home` of the root is `MazHome as Home` of `@maz-ui/icons/lazy/MazHome` */
function getIconImport(specifier: string, variant: string | undefined, ids: ReadonlySet<string>) {
  const [imported, local = imported] = specifier.split(/\s/).filter(Boolean).join(' ').split(' as ')
  const isLazy = !variant && imported.startsWith('LazyMaz')
  const id = isLazy
    ? imported.slice('Lazy'.length)
    : imported

  if (!ids.has(id))
    return undefined

  return {
    binding: id === local
      ? id
      : `${id} as ${local}`,
    source: `${ICONS_PACKAGE}/${variant ?? (isLazy ? 'lazy' : 'static')}/${id}`,
  }
}

/**
 * Imports each icon from its own module: `import { MazStar, LazyMazHome } from '@maz-ui/icons'` loads one file per
 * icon of the package in dev, `@maz-ui/icons/static/MazStar` and `@maz-ui/icons/lazy/MazHome` only load these two.
 * The other imports of the statement are kept.
 */
export function rewriteIconImports(output: MagicString, code: string, ids: ReadonlySet<string>): boolean {
  let changed = false

  for (const match of code.matchAll(IMPORT_PATTERN)) {
    const [statement, specifiers, quote, variant] = match
    const kept: string[] = []
    const imports: string[] = []

    for (const specifier of specifiers.split(',').map(item => item.trim()).filter(Boolean)) {
      const icon = getIconImport(specifier, variant, ids)
      if (icon)
        imports.push(`import { ${icon.binding} } from ${quote}${icon.source}${quote};`)
      else
        kept.push(specifier)
    }

    if (imports.length === 0)
      continue

    const source = variant
      ? `${ICONS_PACKAGE}/${variant}`
      : ICONS_PACKAGE
    if (kept.length > 0)
      imports.unshift(`import { ${kept.join(', ')} } from ${quote}${source}${quote};`)

    output.overwrite(match.index, match.index + statement.length, imports.join(' '))
    changed = true
  }

  return changed
}
