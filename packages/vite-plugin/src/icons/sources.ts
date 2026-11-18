import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'tinyglobby'
import { ICON_NAME_PATTERN } from './scan'

export interface IconSource {
  /** Absolute path of the SVG file */
  file: string
  /** Root of the ids of the SVG (`prefixIds` of svgo): the package of the icons, or the project */
  root: string
  /** Its component in `@maz-ui/icons` (`MazXMark`): the name imports its `raw` module, shared with the imports */
  component?: string
}

export interface ProjectIconsOptions {
  root: string
  dir: string
  prefix?: string
}

export interface ProjectIcons {
  icons: Map<string, IconSource>
  /** Files whose name is not a valid icon name, relative to the root */
  invalid: string[]
}

export interface IconSources extends ProjectIcons {
  /** Project icons that replace an icon of maz-ui: `[name, file]` */
  overrides: [string, string][]
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

/** The icons of `@maz-ui/icons`, by name (`x-mark`, `flag-fr`, `logo-vue`) */
export function loadPackageIcons(packageDir: string): Map<string, IconSource> {
  const names = JSON.parse(readFileSync(join(packageDir, 'icon-names.json'), 'utf8')) as Record<string, { component: string, file: string }>

  return new Map(Object.entries(names).map(([name, { component, file }]) => [
    name,
    {
      file: join(packageDir, file),
      root: packageDir,
      component,
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

/** The SVG files of the project folder, by name: `prefix:name` with a prefix */
export function loadProjectIcons({ root, dir, prefix }: ProjectIconsOptions): ProjectIcons {
  const icons = new Map<string, IconSource>()
  const invalid: string[] = []
  const directory = resolve(root, dir)

  if (!existsSync(directory))
    return { icons, invalid }

  for (const path of globSync('**/*.svg', { cwd: directory }).sort()) {
    const name = prefix
      ? `${prefix}:${toIconName(path)}`
      : toIconName(path)

    if (!ICON_NAME_PATTERN.test(name)) {
      invalid.push(relative(root, join(directory, path)))
      continue
    }

    icons.set(name, {
      file: join(directory, path),
      root,
    })
  }

  return { icons, invalid }
}

/** The icons of maz-ui and of the project: a project icon with the name of an icon of maz-ui replaces it */
export function mergeIconSources(packageIcons: Map<string, IconSource>, projectIcons: ProjectIcons, root: string): IconSources {
  const icons = new Map(packageIcons)
  const overrides: [string, string][] = []

  for (const [name, source] of projectIcons.icons) {
    if (icons.has(name)) {
      overrides.push([
        name,
        relative(root, source.file),
      ])
    }
    icons.set(name, source)
  }

  return { icons, overrides, invalid: projectIcons.invalid }
}

/** Every icon name, of maz-ui and of the project: for the types of a tool that does not run Vite (`nuxi prepare`) */
export function loadIconNames({ root, dir = 'src/icons', prefix }: Omit<ProjectIconsOptions, 'dir'> & { dir?: string }): string[] {
  const packageDir = resolveIconsPackage(root)
  const packageIcons = packageDir
    ? loadPackageIcons(packageDir)
    : new Map<string, IconSource>()

  return [
    ...mergeIconSources(packageIcons, loadProjectIcons({ root, dir, prefix }), root).icons.keys(),
  ]
}
