import type { SvgoConfigOption } from '@maz-ui/vite-svg-loader/optimize'
import type { IconTypesModule } from './types.ts'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'tinyglobby'
import { ICON_NAME_PATTERN } from './scan.ts'

export interface IconSource {
  /** Absolute path of the SVG file */
  file: string
  /** Root of the ids of the SVG (`prefixIds` of svgo): the package of the icons, or the project */
  root: string
  /** Its component in `@maz-ui/icons` (`MazXMark`): the name imports its `raw` module, shared with the imports */
  component?: string
  /** svgo config of a SVG of a folder, `false` to keep it as it is. By default, the one of `@maz-ui/vite-svg-loader` */
  svgo?: SvgoConfigOption | false
  /** Its SVG is a chunk, downloaded when the icon is displayed: the icon of a `lazy` folder */
  lazy?: boolean
  /** The module of its SVG, imported instead of the file: bundled once with the imports of the module, kept external in a library */
  import?: IconImport
}

/** A module exporting the SVG string of an icon: its specifier, and its export (`default` when omitted) */
export interface IconImport {
  from: string
  name?: string
}

/** A folder of SVG, relative to the root of the project: `node_modules/@acme/icons/svg` for the SVG of a package */
export interface IconDirOptions {
  path: string
  /** Prefix of its names: with `'app'`, `hero.svg` is `app:hero` */
  prefix?: string
  /** svgo config of its SVG (an object replaces the default config), `false` to keep them as they are */
  svgo?: SvgoConfigOption | false
  /**
   * Its names built at runtime (`` `amenity:${code}` ``) are loaded when the icon is displayed, one chunk per SVG: the
   * bundle only has a table of loaders (about 50 bytes per name). The names written in the code are bundled as usual
   */
  lazy?: boolean
  /**
   * The module of each SVG, for the folder of a package that publishes them as modules (`name` is the name without
   * the prefix): the name imports it, so its SVG is bundled once with the imports of the module, and the dist of a
   * library keeps the import (shared with the app) instead of copying the SVG.
   * (`` name => `@acme/icons/raw/${name}` `` for a default export, or `{ from, name }` for a named one)
   */
  import?: (name: string) => string | IconImport
}

/** A folder of SVG: its path (with the global `prefix` and `svgoConfig`), or its options */
export type IconDir = string | IconDirOptions

export interface ProjectIconsOptions {
  root: string
  dir: string
  prefix?: string
  svgo?: SvgoConfigOption | false
  lazy?: boolean
  import?: IconDirOptions['import']
}

export interface ProjectIcons {
  icons: Map<string, IconSource>
  /** Files whose name is not a valid icon name, relative to the root */
  invalid: string[]
}

export interface IconSources extends ProjectIcons {
  /** Icons of a folder that replace another one: `[name, file, replaced]`, `replaced` is `maz-ui` or a file */
  overrides: [string, string, string][]
}

export const DEFAULT_ICON_DIR = 'src/icons'

/** The folders of the `dir` option, with their options: a path takes the global `prefix` and `svgoConfig` */
export function normalizeIconDirs(dir: IconDir | readonly IconDir[] = DEFAULT_ICON_DIR, { prefix, svgoConfig }: { prefix?: string, svgoConfig?: SvgoConfigOption } = {}): IconDirOptions[] {
  return (Array.isArray(dir)
    ? dir as readonly IconDir[]
    : [dir as IconDir]).map(entry => typeof entry === 'string'
    ? { path: entry, prefix, svgo: svgoConfig }
    : entry)
}

/**
 * The folder of `@maz-ui/icons`: the one of `maz-ui` first (an app that only depends on `maz-ui` does not resolve
 * it), then the one of the project, then the one of this plugin.
 */
export function resolveIconsPackage(root: string): string | undefined {
  return locateIconsPackage(root)?.packageDir
}

/** The folder of `@maz-ui/icons`, and the file it is resolved from: its modules are resolved from it too */
export function locateIconsPackage(root: string): { packageDir: string, importer: string } | undefined {
  const candidates = [
    () => createRequire(join(root, 'package.json')).resolve('maz-ui/package.json'),
    () => join(root, 'package.json'),
    () => import.meta.url,
  ]

  for (const getImporter of candidates) {
    try {
      const importer = getImporter()
      return {
        packageDir: dirname(createRequire(importer).resolve('@maz-ui/icons/package.json')),
        importer: importer.startsWith('file:')
          ? fileURLToPath(importer)
          : importer,
      }
    }
    catch {}
  }

  return undefined
}

/** A package in a `node_modules` of the folder or of a parent, as TypeScript finds it (`NODE_PATH` is ignored) */
function hasPackage(root: string, id: string): boolean {
  let directory = root
  while (!existsSync(join(directory, 'node_modules', id, 'package.json'))) {
    const parent = dirname(directory)
    if (parent === directory)
      return false
    directory = parent
  }
  return true
}

/**
 * The module whose names the types augment: `@maz-ui/icons` when the project resolves it (the names of `maz-ui`
 * include its names), else `maz-ui`
 */
export function resolveIconTypesModule(root: string): IconTypesModule {
  return hasPackage(root, '@maz-ui/icons')
    ? '@maz-ui/icons'
    : 'maz-ui'
}

/** The icons of `@maz-ui/icons`, by name (`x-mark`, `flag-fr`, `logo-vue`) */
/** A set of the icons of `@maz-ui/icons`: `icons` (`x-mark`), `flags` (`flag-fr`), `flags-square` (`flag-square-fr`), `logos` (`logo-vue`) */
export type IconSet = 'icons' | 'flags' | 'flags-square' | 'logos'

/** The icons of `@maz-ui/icons` by name: every set, none, or some of them */
export type DefaultIcons = boolean | readonly IconSet[]

const SET_FOLDERS: Record<IconSet, string> = {
  'icons': 'svg/',
  'flags': 'flags/3x2/',
  'flags-square': 'flags/1x1/',
  'logos': 'logos/',
}

export const ICON_SETS = Object.keys(SET_FOLDERS) as IconSet[]

export function toIconSets(defaultIcons: DefaultIcons): readonly IconSet[] {
  if (defaultIcons === true)
    return ICON_SETS
  return defaultIcons || []
}

/** The icons of `@maz-ui/icons`, of the given sets */
export function loadPackageIcons(packageDir: string, sets: readonly IconSet[] = ICON_SETS): Map<string, IconSource> {
  const names = JSON.parse(readFileSync(join(packageDir, 'icon-names.json'), 'utf8')) as Record<string, { component: string, file: string }>
  const folders = sets.map(set => SET_FOLDERS[set])

  return new Map(Object.entries(names).filter(([, { file }]) => folders.some(folder => file.startsWith(folder))).map(([name, { component, file }]) => [
    name,
    {
      file: join(packageDir, file),
      root: packageDir,
      component,
      import: { from: `@maz-ui/icons/raw/${component}`, name: component },
    },
  ]))
}

/** `brand/LogoDark.svg` is `brand-logo-dark` */
export function toIconName(path: string): string {
  return path
    .replace(/\.svg$/i, '')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .split(/[^a-z\d]+/)
    .filter(Boolean)
    .join('-')
}

function toIconImport(target: string | IconImport): IconImport {
  return typeof target === 'string'
    ? { from: target }
    : target
}

/** The SVG files of the project folder, by name: `prefix:name` with a prefix */
export function loadProjectIcons({ root, dir, prefix, svgo, lazy, import: getImport }: ProjectIconsOptions): ProjectIcons {
  const icons = new Map<string, IconSource>()
  const invalid: string[] = []
  const directory = resolve(root, dir)

  if (!existsSync(directory))
    return { icons, invalid }

  for (const path of globSync('**/*.svg', { cwd: directory }).sort()) {
    const baseName = toIconName(path)
    const name = prefix
      ? `${prefix}:${baseName}`
      : baseName

    if (!ICON_NAME_PATTERN.test(name)) {
      invalid.push(relative(root, join(directory, path)))
      continue
    }

    icons.set(name, {
      file: join(directory, path),
      root,
      ...(svgo === undefined
        ? {}
        : { svgo }),
      ...(lazy
        ? { lazy }
        : {}),
      ...(getImport
        ? { import: toIconImport(getImport(baseName)) }
        : {}),
    })
  }

  return { icons, invalid }
}

/** The SVG of every folder, by name */
export function loadDirsIcons(root: string, dirs: readonly IconDirOptions[]): ProjectIcons[] {
  return dirs.map(({ path, ...options }) => loadProjectIcons({ root, dir: path, ...options }))
}

/**
 * The icons of maz-ui and of the folders: an icon of a folder with the name of an icon of maz-ui, or of a previous
 * folder, replaces it
 */
export function mergeIconSources(packageIcons: Map<string, IconSource>, projectIcons: ProjectIcons | readonly ProjectIcons[], root: string): IconSources {
  const icons = new Map(packageIcons)
  const overrides: [string, string, string][] = []
  const projects = Array.isArray(projectIcons)
    ? projectIcons as readonly ProjectIcons[]
    : [projectIcons as ProjectIcons]

  for (const project of projects) {
    for (const [name, source] of project.icons) {
      const replaced = icons.get(name)
      if (replaced) {
        overrides.push([
          name,
          relative(root, source.file),
          replaced.component
            ? 'maz-ui'
            : relative(root, replaced.file),
        ])
      }
      icons.set(name, source)
    }
  }

  return {
    icons,
    overrides,
    invalid: projects.flatMap(project => project.invalid),
  }
}

export interface IconNamesOptions {
  root: string
  /** @default 'src/icons' */
  dir?: IconDir | readonly IconDir[]
  prefix?: string
  /** @default true */
  defaultIcons?: DefaultIcons
}

/** Every icon name, of maz-ui and of the folders: for the types of a tool that does not run Vite (`nuxi prepare`) */
export function loadIconNames({ root, dir, prefix, defaultIcons = true }: IconNamesOptions): string[] {
  const sets = toIconSets(defaultIcons)
  const packageDir = sets.length > 0
    ? resolveIconsPackage(root)
    : undefined
  const packageIcons = packageDir
    ? loadPackageIcons(packageDir, sets)
    : new Map<string, IconSource>()

  return [
    ...mergeIconSources(packageIcons, loadDirsIcons(root, normalizeIconDirs(dir, { prefix })), root).icons.keys(),
  ]
}
