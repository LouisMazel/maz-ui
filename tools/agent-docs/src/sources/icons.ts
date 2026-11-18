import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

/** Reads the static icon names (`MazTrash`...) from the generated `@maz-ui/icons` list */
export function collectIconNames(iconListPath: string): string[] {
  const source = readFileSync(iconListPath, 'utf8')
  const names = [
    ...source.matchAll(/'(Maz\w+)'/g),
  ].map(match => match[1])

  if (names.length === 0) {
    throw new Error(`No icon found in ${iconListPath}`)
  }

  return [
    ...new Set(names),
  ].sort((a, b) => a.localeCompare(b))
}

export interface IconGroup {
  title: string
  description: string
  names: string[]
}

export function groupIcons(names: string[]): IconGroup[] {
  const squareFlags = names.filter(name => name.startsWith('MazFlagSquare'))
  const flags = names.filter(name => /^MazFlag[A-Z]{2}/.test(name) && !name.startsWith('MazFlagSquare'))
  const logos = names.filter(name => name.startsWith('MazLogo'))
  const special = new Set([
    ...squareFlags,
    ...flags,
    ...logos,
  ])

  return [
    {
      title: 'Interface icons',
      description: 'Heroicons-based outline icons (`MazTrash`, `MazXMark`, `MazMagnifyingGlass`...)',
      names: names.filter(name => !special.has(name)),
    },
    {
      title: 'Logos',
      description: 'Brand and file-type logos',
      names: logos,
    },
    {
      title: 'Country flags (3x2)',
      description: '`MazFlag` + ISO 3166-1 alpha-2 code in uppercase (`MazFlagFR`, `MazFlagUS`)',
      names: flags,
    },
    {
      title: 'Country flags (1x1)',
      description: '`MazFlagSquare` + ISO code (`MazFlagSquareFR`)',
      names: squareFlags,
    },
  ]
}

/**
 * The name of `<MazIcon icon="trash" />` of each static icon (`MazTrash`: `trash`), joined by their SVG file:
 * `icon-names.json` gives the file of each name, the static component imports it
 */
export function collectIconIds(iconNamesPath: string, staticDir: string): Record<string, string> {
  const fileToName = new Map(Object.entries(JSON.parse(readFileSync(iconNamesPath, 'utf8')) as Record<string, string>)
    .map(([name, file]) => [file, name]))
  const ids: Record<string, string> = {}

  for (const file of readdirSync(staticDir).filter(file => file.endsWith('.ts')).sort()) {
    const svg = /'\.\.\/\.\.\/([^'?]+\.svg)\?component'/.exec(readFileSync(join(staticDir, file), 'utf8'))?.[1]
    const name = svg && fileToName.get(svg)

    if (name)
      ids[basename(file, '.ts')] = name
  }

  return ids
}
