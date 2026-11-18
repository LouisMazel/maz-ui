import type { SvgoConfigOption } from '@maz-ui/vite-svg-loader/optimize'
import type { Logger, Plugin, ViteDevServer } from 'vite'
import type { IconSource, IconSources } from './sources'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import { optimizeSvg } from '@maz-ui/vite-svg-loader/optimize'
import MagicString from 'magic-string'
import { ICONS_PACKAGE, loadIconIds, rewriteIconImports } from './imports'
import { scanIconNames } from './scan'
import { loadPackageIcons, loadProjectIcons, locateIconsPackage, mergeIconSources } from './sources'
import { generateIconTypes, writeIfChanged } from './types'

export interface MazUiIconsOptions {
  /**
   * Folder of the SVG of the project, relative to the root: `src/icons/hero.svg` is `<MazIcon icon="hero" />`
   * @default 'src/icons'
   */
  dir?: string
  /** Prefix of the names of the project SVG: with `'app'`, `src/icons/hero.svg` is `app:hero` */
  prefix?: string
  /**
   * Names the scan can not find (built at runtime, coming from an API): registered wherever icons are used
   */
  safelist?: string[]
  /**
   * File of the types of the names, relative to the root, `false` to not write it
   * @default 'src/maz-icons.d.ts' ('maz-icons.d.ts' without a `src` folder)
   */
  dts?: string | boolean
  /**
   * `icon` only accepts the known names, URLs and raw SVG: a typo is an error
   * @default false
   */
  strict?: boolean
  /** svgo config of the project SVG, as in `@maz-ui/vite-svg-loader` (an object replaces the default config) */
  svgoConfig?: SvgoConfigOption
}

const RUNTIME_ID = 'virtual:maz-icon-runtime'
const ICON_ID_PREFIX = 'virtual:maz-icon/'
const VIRTUAL_PATTERN = /^virtual:maz-icon(?:-runtime$|\/)/
const RESOLVED_PATTERN = /^\0virtual:maz-icon(?:-runtime$|\/)/
const SCRIPT_PATTERN = /\.(?:vue|md|[mc]?[jt]sx?)(?:$|\?)/
const EXCLUDED_PATTERN = /node_modules|^\0|[?&]type=style/

/** Same key and shape as `@maz-ui/icons/registry`, that `MazIcon` reads */
const RUNTIME_CODE = `const registry = (globalThis[Symbol.for('maz-ui.icons.v1')] ??= new Map())
export function r(icons) {
  for (const name in icons) registry.set(name, icons[name])
}`

function generateImports(names: readonly string[]): { imports: string[], icons: string } {
  const entries = names.map((name, index) => `${JSON.stringify(name)}: __mazIcon${index}`)

  return {
    imports: names.map((name, index) => `import __mazIcon${index} from ${JSON.stringify(ICON_ID_PREFIX + name)};`),
    icons: `{ ${entries.join(', ')} }`,
  }
}

/**
 * The code added to a file: the icons it uses, imported and registered by the file itself. Each icon is in the
 * chunk of the file that uses it, and the registration is not a bare side effect, that Nitro removes in production.
 */
export function generateRegistration(names: readonly string[]): string {
  const { imports, icons } = generateImports(names)

  return [
    `import { r as __mazIconRegister } from ${JSON.stringify(RUNTIME_ID)};`,
    ...imports,
    `__mazIconRegister(${icons});`,
    '',
  ].join('\n')
}

/** The registry, with the icons of the safelist: loaded with the first file that uses icons */
export function generateRuntime(safelist: readonly string[]): string {
  const { imports, icons } = generateImports(safelist)

  return [
    ...imports,
    RUNTIME_CODE,
    ...(safelist.length > 0
      ? [`r(${icons});`]
      : []),
    '',
  ].join('\n')
}

function getDefaultDts(root: string): string {
  return existsSync(join(root, 'src'))
    ? 'src/maz-icons.d.ts'
    : 'maz-icons.d.ts'
}

/**
 * Registers the icons each file of the app uses by name (`<MazIcon icon="x-mark" />`, `start-icon="moon"`), the ones
 * of `@maz-ui/icons` and the SVG of the project, and writes the types of the names. Without it, a name renders the
 * fallback of `MazIcon`.
 */
export function MazUiIcons(options: MazUiIconsOptions = {}): Plugin {
  const { dir = 'src/icons', prefix, safelist = [], strict = false, svgoConfig } = options

  let root = process.cwd()
  let logger!: Logger
  let packageIcons = new Map<string, IconSource>()
  /** The file `@maz-ui/icons` is resolved from: the one of `maz-ui` first, whose components import the same modules */
  let iconsImporter: string | undefined
  let iconIds = new Set<string>()
  /** Not when the app pre-bundles `@maz-ui/icons`: the scan of the pre-bundling only sees the original imports */
  let rewritesImports = false
  let sources: IconSources = {
    icons: new Map(),
    overrides: [],
    invalid: [],
  }
  let dtsFile: string | undefined
  let isServe = false
  const warnings = new Set<string>()
  const svgCache = new Map<string, string>()
  /** The SVG files of the loaded icons, watched in dev */
  const iconFiles = new Set<string>()
  /** Dev: the candidate names of each module, to transform them again when a project SVG is added */
  const candidatesByModule = new Map<string, Set<string>>()
  const prefixes = prefix
    ? [prefix]
    : []

  /** Once per message: the sources are loaded again each time a project SVG is added */
  function warn(message: string) {
    if (warnings.has(message))
      return

    warnings.add(message)
    logger.warn(`[maz-ui:icons] ${message}`, { timestamp: true })
  }

  function loadSources() {
    sources = mergeIconSources(packageIcons, loadProjectIcons({ root, dir, prefix }), root)

    for (const [name, file] of sources.overrides)
      warn(`${file} replaces the icon "${name}" of maz-ui: rename it or set the \`prefix\` option`)

    for (const file of sources.invalid)
      warn(`${file} is not a valid icon name (letters, digits and dashes)`)
  }

  function writeTypes() {
    if (dtsFile)
      writeIfChanged(dtsFile, generateIconTypes(sources.icons.keys(), { strict }))
  }

  function readIcon(source: IconSource): string {
    const cached = svgCache.get(source.file)
    if (cached !== undefined)
      return cached

    const isProjectIcon = source.root === root
    const svg = optimizeSvg(readFileSync(source.file, 'utf8'), {
      path: source.file,
      root: source.root,
      config: isProjectIcon
        ? svgoConfig
        : undefined,
    })
    svgCache.set(source.file, svg)
    return svg
  }

  function isProjectFile(file: string): boolean {
    const directory = resolve(root, dir) + sep
    return file.startsWith(directory) && file.endsWith('.svg')
  }

  /** A project SVG added or removed: new names, so new types and new imports in the files that use them */
  function onProjectIconsChange(server: ViteDevServer, file: string) {
    if (!isProjectFile(file))
      return

    const before = new Set(sources.icons.keys())
    loadSources()
    writeTypes()

    const changed = new Set([
      ...sources.icons.keys(),
    ].filter(name => !before.has(name)))
    for (const name of before) {
      if (!sources.icons.has(name))
        changed.add(name)
    }

    for (const [id, candidates] of candidatesByModule) {
      if (![...candidates].some(name => changed.has(name)))
        continue

      for (const environment of Object.values(server.environments)) {
        const module = environment.moduleGraph.getModuleById(id)
        if (module)
          environment.moduleGraph.invalidateModule(module)
      }
    }

    server.ws.send({ type: 'full-reload' })
  }

  return {
    name: 'maz-ui:icons',
    // After `vue()`: the scan reads the compiled code, where an attribute of a template is a key
    enforce: 'post',

    config(userConfig) {
      const { include = [], exclude = [] } = userConfig.optimizeDeps ?? {}
      if (include.includes(ICONS_PACKAGE) || exclude.includes(ICONS_PACKAGE))
        return

      // Icons are one ESM module each: pre-bundled, every new one found while browsing reloads the page
      return {
        optimizeDeps: {
          exclude: [ICONS_PACKAGE],
        },
      }
    },

    configResolved(config) {
      root = config.root
      logger = config.logger

      rewritesImports = config.command === 'build' || (config.optimizeDeps?.exclude ?? []).includes(ICONS_PACKAGE)

      const iconsPackage = locateIconsPackage(root)
      if (iconsPackage) {
        packageIcons = loadPackageIcons(iconsPackage.packageDir)
        iconIds = loadIconIds(iconsPackage.packageDir)
        iconsImporter = iconsPackage.importer
      }
      else {
        warn(`${ICONS_PACKAGE} not found: only the SVG of the project can be used by name`)
      }

      dtsFile = options.dts === false
        ? undefined
        : resolve(root, typeof options.dts === 'string'
            ? options.dts
            : getDefaultDts(root))

      loadSources()
      writeTypes()

      const unknown = safelist.filter(name => !sources.icons.has(name))
      if (unknown.length > 0)
        warn(`unknown icons in the safelist: ${unknown.join(', ')}`)
    },

    configureServer(server) {
      isServe = true
      server.watcher.add(resolve(root, dir))
      server.watcher.on('add', file => onProjectIconsChange(server, file))
      server.watcher.on('unlink', file => onProjectIconsChange(server, file))
    },

    hotUpdate({ file, modules }) {
      if (!iconFiles.has(file))
        return undefined

      // The registry is not reactive: the rendered icons only change with a reload
      svgCache.delete(file)
      for (const module of modules)
        this.environment.moduleGraph.invalidateModule(module)
      if (this.environment.name === 'client')
        this.environment.hot.send({ type: 'full-reload' })
      return []
    },

    resolveId: {
      filter: { id: VIRTUAL_PATTERN },
      handler(id) {
        return VIRTUAL_PATTERN.test(id)
          ? `\0${id}`
          : undefined
      },
    },

    load: {
      filter: { id: RESOLVED_PATTERN },
      async handler(id) {
        if (!RESOLVED_PATTERN.test(id))
          return undefined

        if (id === `\0${RUNTIME_ID}`)
          return generateRuntime(safelist.filter(name => sources.icons.has(name)))

        const source = sources.icons.get(id.slice(`\0${ICON_ID_PREFIX}`.length))
        // A project SVG removed while a module still imports it: the name renders the fallback
        if (!source)
          return 'export default ""\n'

        // The `raw` module of maz-ui: the SVG is bundled once, for the name and for the imports of the components
        const raw = source.component && iconsImporter
          ? await this.resolve(`${ICONS_PACKAGE}/raw/${source.component}`, iconsImporter)
          : null
        if (raw && !raw.external)
          return `export { ${source.component} as default } from ${JSON.stringify(raw.id)}\n`

        this.addWatchFile(source.file)
        iconFiles.add(source.file)
        return `export default ${JSON.stringify(readIcon(source))}\n`
      },
    },

    transform: {
      filter: {
        id: { include: SCRIPT_PATTERN, exclude: EXCLUDED_PATTERN },
      },
      handler(code, id) {
        if (!SCRIPT_PATTERN.test(id) || EXCLUDED_PATTERN.test(id))
          return undefined

        const { names: candidates, hasIconContext } = scanIconNames(code, prefixes)
        if (isServe)
          candidatesByModule.set(id, candidates)

        const output = new MagicString(code)
        const hasRewrittenImports = rewritesImports && rewriteIconImports(output, code, iconIds)
        const names = [...candidates].filter(name => sources.icons.has(name)).sort()
        const registers = names.length > 0 || (safelist.length > 0 && hasIconContext)
        if (!registers && !hasRewrittenImports)
          return undefined

        if (registers)
          output.prepend(generateRegistration(names))

        return {
          code: output.toString(),
          map: output.generateMap({ hires: 'boundary', source: id }),
        }
      },
    },
  }
}
