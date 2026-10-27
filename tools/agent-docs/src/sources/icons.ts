import { readFileSync } from 'node:fs'

/** Reads the static icon names (`MazTrash`...) from the generated `@maz-ui/icons` list */
export function collectIconNames(iconListPath: string): string[] {
  const source = readFileSync(iconListPath, 'utf8')
  const names = [...source.matchAll(/'(Maz\w+)'/g)].map(match => match[1])

  if (names.length === 0) {
    throw new Error(`No icon found in ${iconListPath}`)
  }

  return [...new Set(names)].sort((a, b) => a.localeCompare(b))
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
  const special = new Set([...squareFlags, ...flags, ...logos])

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
