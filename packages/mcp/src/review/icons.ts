import type { Knowledge } from '../knowledge/load.ts'
import type { Framework, IconNames } from './types.ts'

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { globSync } from 'tinyglobby'

/** The types of the names written by `MazUi()` of @maz-ui/vite-plugin (its default `dts`) and by @maz-ui/nuxt */
const ICON_TYPES_FILES = [
  'src/maz-icons.d.ts',
  'maz-icons.d.ts',
  '.nuxt/types/maz-icons.d.ts',
]
/** The default icons folder: `src/icons` with Vite, `<srcDir>/icons` with Nuxt */
const ICON_DIRS: Record<Framework, string[]> = {
  vue: ['src/icons'],
  nuxt: ['app/icons', 'icons'],
}
const CONFIG_FILES: Record<Framework, { files: string[], pattern: RegExp }> = {
  vue: {
    files: [
      'vite.config.ts',
      'vite.config.mts',
      'vite.config.js',
      'vite.config.mjs',
    ],
    pattern: /\bMazUi(?:Icons)?\s*\(/,
  },
  nuxt: {
    files: ['nuxt.config.ts', 'nuxt.config.js', 'nuxt.config.mjs'],
    pattern: /["']@maz-ui\/nuxt["']/,
  },
}

/** `brand/LogoDark.svg` is `brand-logo-dark`, as `MazUi()` names the SVG of the project */
function toIconName(path: string): string {
  return path
    .replace(/\.svg$/i, '')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .split(/[^a-z\d]+/)
    .filter(Boolean)
    .join('-')
}

function readFile(root: string, files: string[]): string | undefined {
  const file = files.find(path => existsSync(join(root, path)))

  return file
    ? readFileSync(join(root, file), 'utf8')
    : undefined
}

/** The names of maz-ui (`x-mark`, `flag-fr`): `<MazIcon icon>` accepts them since maz-ui 5.7 */
export function mazIconNames(knowledge: Knowledge): Set<string> {
  return new Set(knowledge.iconIds.values())
}

/**
 * The names an `icon` prop accepts in a project: the ones of the generated types, else the icons of maz-ui and
 * the SVG of the default folder (without the `prefix` of the options, a prefixed name is not checked).
 */
export function loadIconNames(root: string, framework: Framework, knowledge: Knowledge): IconNames {
  const names = mazIconNames(knowledge)
  const types = readFile(root, ICON_TYPES_FILES)

  if (types) {
    for (const match of types.matchAll(/^\s+'([^']+)': true$/gm))
      names.add(match[1])

    return { names, registered: true }
  }

  for (const dir of ICON_DIRS[framework].filter(path => existsSync(join(root, path)))) {
    const cwd = join(root, dir)

    for (const path of globSync('**/*.svg', { cwd })) names.add(toIconName(path))
  }

  const config = CONFIG_FILES[framework]

  return {
    names,
    registered: config.pattern.test(readFile(root, config.files) ?? ''),
  }
}
