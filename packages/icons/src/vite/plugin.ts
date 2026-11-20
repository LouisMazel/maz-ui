import type { optimizeSvg, SvgoConfigOption } from '@maz-ui/vite-svg-loader/optimize'
import type { Logger, Plugin, ViteDevServer } from 'vite'
import type { DefaultIcons, IconDir, IconImport, IconSource, IconSources } from './sources.ts'
import type { IconTypesModule } from './types.ts'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import MagicString from 'magic-string'
import { ICONS_PACKAGE, loadIconIds, rewriteIconImports } from './imports.ts'
import { scanIconNames } from './scan.ts'
import { loadDirsIcons, loadPackageIcons, locateIconsPackage, mergeIconSources, normalizeIconDirs, resolveIconTypesModule, toIconSets } from './sources.ts'
import { generateIconTypes, writeIfChanged } from './types.ts'

/** Read by `maz-ui-icons types`: the file of the types, written once the config is resolved */
export interface MazUiIconsApi {
  readonly dts: string | undefined
}

export interface MazUiIconsOptions {
  /**
   * Name of the plugin, in the logs and in the file of the types: a library that wraps it sets its own (`acme:icons`),
   * and passes it to `runCli()`
   * @default 'maz-ui:icons'
   */
  name?: string
  /**
   * Folders of SVG, relative to the root: `src/icons/hero.svg` is `<MazIcon icon="hero" />`. A path, or an array of paths
   * and of folders with their options (`{ path: 'node_modules/@acme/icons/svg', prefix: 'acme', svgo: false }`). An
   * icon of a folder replaces the one of maz-ui, or of a previous folder, with the same name
   * @default 'src/icons'
   */
  dir?: IconDir | IconDir[]
  /** Prefix of the names of the SVG of the folders given by their path: with `'app'`, `src/icons/hero.svg` is `app:hero` */
  prefix?: string
  /**
   * The icons of `@maz-ui/icons` by name: every set, some of them (`['icons', 'logos']`), or none (`false`, only the
   * icons of the folders). The components of maz-ui do not use names
   * @default true
   */
  defaultIcons?: DefaultIcons
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
   * Name of the file of the types when `dts` is `true` or not set, in `src` when the project has one: a library that
   * wraps the plugin sets its own (`acme-icons.d.ts`)
   * @default 'maz-icons.d.ts'
   */
  dtsName?: string
  /**
   * The module the types augment: a library that re-exports the types of `@maz-ui/icons` sets its own, the one its
   * consumers install (with pnpm, they do not resolve `@maz-ui/icons`)
   * @default '@maz-ui/icons' when the project resolves it, else 'maz-ui'
   */
  typesModule?: IconTypesModule
  /**
   * `icon` only accepts the known names, URLs and raw SVG: a typo is an error
   * @default false
   */
  strict?: boolean
  /**
   * The build of a library: its dist imports the icons of `@maz-ui/icons` (and of the folders with `import`) when they
   * are external, shared with the app, instead of copying their SVG
   * @default true when `build.lib` is set
   */
  lib?: boolean
  /**
   * Packages of the modules the icons import (`import` of a folder), kept out of the pre-bundle of Vite in dev, like
   * `@maz-ui/icons`: else every new icon found while browsing reloads the page. A package the app already lists in
   * `optimizeDeps.include` or `optimizeDeps.exclude` is left as it is
   * @default []
   */
  optimizeDepsExclude?: string[]
  /**
   * svgo config of the SVG of the folders given by their path, as in `@maz-ui/vite-svg-loader` (an object replaces the
   * default config)
   */
  svgoConfig?: SvgoConfigOption
  /** What the plugin reads to find the names a file uses */
  scan?: MazUiIconsScanOptions
}

export interface MazUiIconsScanOptions {
  /**
   * Props and keys whose values are icon names, besides `fallback` and the ones whose name contains `icon` (`icon`, `startIcon`):
   * `['name']` for `<AppIcon name="logo" />`. Exact names, in camelCase or kebab-case (`startSvg` also reads
   * `start-svg`). A string of a known name in one of them is registered: a generic key (`name`) can add an icon that
   * the page does not render (a route named `home`)
   * @default []
   */
  keys?: string[]
}

type Optimize = typeof optimizeSvg

const RUNTIME_ID = 'virtual:maz-icon-runtime'
const ICON_ID_PREFIX = 'virtual:maz-icon/'
/** The table of the loaders of the `lazy` folders (`virtual:maz-icon-lazy/amenity`, `virtual:maz-icon-lazy/` without a prefix), and the loader of a name written `~x-mark` (`virtual:maz-icon-lazy/~x-mark`) */
const LAZY_ID_PREFIX = 'virtual:maz-icon-lazy/'
const VIRTUAL_PATTERN = /^virtual:maz-icon(?:-runtime$|-lazy\/|\/)/
const RESOLVED_PATTERN = /^\0virtual:maz-icon(?:-runtime$|-lazy\/|\/)/
const SCRIPT_PATTERN = /\.(?:vue|md|[mc]?[jt]sx?)(?:$|\?)/
const EXCLUDED_PATTERN = /node_modules|^\0|[?&]type=style/
/** The string of a built `raw` module: `var MazStar = /* @__PURE__ *\/ String("<svg ...")` */
const RAW_ICON_PATTERN = /=\s*(?:\/\*.*?\*\/\s*)?(?:String\()?("(?:[^"\\]|\\.)*")\)?;?\s*$/m

/** Same key and shape as `@maz-ui/icons/registry`, that `MazIcon` reads */
const RUNTIME_CODE = `const registry = (globalThis[Symbol.for('maz-ui.icons.v1')] ??= new Map())
export function r(icons) {
  for (const name in icons) registry.set(name, icons[name])
}`

/** Same key and shape as the loaders of `@maz-ui/icons/registry`, that `MazIconPrimitive` reads */
const LOADERS_CODE = `const loaders = (globalThis[Symbol.for('maz-ui.icons.loaders.v1')] ??= new Map())`

/** The prefix of a name, `''` without: the key of the table of its `lazy` folder */
function getNamePrefix(name: string): string {
  const index = name.indexOf(':')
  return index === -1
    ? ''
    : name.slice(0, index)
}

/**
 * The table of the loaders of the names of `lazy` folders: one dynamic import per SVG, a chunk downloaded when the icon
 * is displayed. Imported by the files that can build these names: in their chunk, not in the entry.
 */
export function generateLazyTable(names: readonly string[]): string {
  const entries = names.map(name => `  ${JSON.stringify(name)}: () => import(${JSON.stringify(ICON_ID_PREFIX + name)}),`)

  return [
    LOADERS_CODE,
    'for (const [name, loader] of Object.entries({',
    ...entries,
    '})) loaders.set(name, loader)',
    '',
  ].join('\n')
}

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

/** The SVG of the built `raw` module of an icon of `@maz-ui/icons`: the package does not publish its flags and logos as files */
export function readRawIcon(packageDir: string, component: string): string | undefined {
  const file = join(packageDir, 'dist/raw', `${component}.js`)
  if (!existsSync(file))
    return undefined

  const literal = RAW_ICON_PATTERN.exec(readFileSync(file, 'utf8'))?.[1]
  return literal
    ? JSON.parse(literal) as string
    : undefined
}

/** The name re-exports the module of its SVG */
function reExportIcon({ name }: IconImport, from: string): string {
  const specifier = name && name !== 'default'
    ? `${name} as default`
    : 'default'
  return `export { ${specifier} } from ${JSON.stringify(from)}\n`
}

function getDefaultDts(root: string, dtsName: string): string {
  return existsSync(join(root, 'src'))
    ? `src/${dtsName}`
    : dtsName
}

/**
 * Registers the icons each file of the app uses by name (`<MazIcon icon="x-mark" />`, `start-icon="moon"`), the ones
 * of `@maz-ui/icons` and the SVG of the project, and writes the types of the names. Without it, a name renders the
 * fallback of `MazIcon`.
 */
export function MazUiIcons(options: MazUiIconsOptions = {}): Plugin<MazUiIconsApi> {
  const { name: pluginName = 'maz-ui:icons', prefix, safelist = [], strict = false, defaultIcons = true, svgoConfig } = options
  const dirs = normalizeIconDirs(options.dir, { prefix, svgoConfig })

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
  let typesModule: IconTypesModule = 'maz-ui'
  let isServe = false
  /** The build of a library (`build.lib`): its dist keeps the imports of the external `@maz-ui/icons`, shared with the app */
  let isLib = false
  const warnings = new Set<string>()
  const svgCache = new Map<string, string>()
  let optimizer: Promise<Optimize | undefined> | undefined
  /** The SVG files of the loaded icons, watched in dev */
  const iconFiles = new Set<string>()
  /** Dev: the candidate names of each module, to transform them again when a project SVG is added */
  const candidatesByModule = new Map<string, Set<string>>()
  const prefixes = [
    ...new Set(dirs.flatMap(({ prefix }) => prefix ?? [])),
  ]
  const scanKeys = [
    // `fallback` of `MazIcon` takes a name too
    'fallback',
    ...(options.scan?.keys ?? []),
  ]
  /** The prefixes of the `lazy` folders, `''` for a folder without a prefix */
  const lazyPrefixes = [
    ...new Set(dirs.filter(({ lazy }) => lazy).map(({ prefix }) => prefix ?? '')),
  ]

  /** The tables of loaders a file needs: it has the prefix of a `lazy` folder (`` `amenity:${code}` ``), or an icon context without a prefix */
  function getLazyTables(code: string, hasIconContext: boolean): string[] {
    return lazyPrefixes.filter(lazyPrefix => (lazyPrefix
      ? code.includes(`${lazyPrefix}:`)
      : hasIconContext))
  }

  /** Once per message: the sources are loaded again each time a project SVG is added */
  function warn(message: string) {
    if (warnings.has(message))
      return

    warnings.add(message)
    logger.warn(`[${pluginName}] ${message}`, { timestamp: true })
  }

  function loadSources() {
    sources = mergeIconSources(packageIcons, loadDirsIcons(root, dirs), root)

    for (const [name, file, replaced] of sources.overrides)
      warn(`${file} replaces the icon "${name}" of ${replaced}: rename it or set the \`prefix\` option`)

    for (const file of sources.invalid)
      warn(`${file} is not a valid icon name (letters, digits and dashes)`)
  }

  function writeTypes() {
    if (dtsFile) {
      writeIfChanged(dtsFile, generateIconTypes(sources.icons.keys(), {
        strict,
        module: typesModule,
        generator: options.name,
      }))
    }
  }

  /** svgo, by `@maz-ui/vite-svg-loader`: an optional peer, not to install svgo with every `@maz-ui/icons` */
  function loadOptimizer(): Promise<Optimize | undefined> {
    optimizer ??= import('@maz-ui/vite-svg-loader/optimize').then(
      module => module.optimizeSvg,
      () => undefined,
    )
    return optimizer
  }

  function readIcon(source: IconSource, optimize: Optimize | undefined): string {
    const cached = svgCache.get(source.file)
    if (cached !== undefined)
      return cached

    const packageSvg = source.component && readRawIcon(source.root, source.component)
    if (packageSvg) {
      svgCache.set(source.file, packageSvg)
      return packageSvg
    }

    const content = readFileSync(source.file, 'utf8')
    if (source.svgo === false) {
      svgCache.set(source.file, content)
      return content
    }

    if (!optimize)
      warn('@maz-ui/vite-svg-loader not found: the SVG are not optimized, install it to run svgo on them')

    const svg = optimize
      ? optimize(content, {
          path: source.file,
          root: source.root,
          config: source.svgo,
        })
      : content
    svgCache.set(source.file, svg)
    return svg
  }

  function isProjectFile(file: string): boolean {
    return file.endsWith('.svg') && dirs.some(({ path }) => file.startsWith(resolve(root, path) + sep))
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

    const lazyTables = lazyPrefixes.map(lazyPrefix => `\0${LAZY_ID_PREFIX}${lazyPrefix}`)
    for (const environment of Object.values(server.environments)) {
      for (const id of lazyTables) {
        const module = environment.moduleGraph.getModuleById(id)
        if (module)
          environment.moduleGraph.invalidateModule(module)
      }
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
    name: pluginName,
    // After `vue()`: the scan reads the compiled code, where an attribute of a template is a key
    enforce: 'post',

    api: {
      get dts() {
        return dtsFile
      },
    },

    config(userConfig) {
      const { include = [], exclude = [] } = userConfig.optimizeDeps ?? {}
      const packages = [ICONS_PACKAGE, ...(options.optimizeDepsExclude ?? [])]
        .filter(id => !include.includes(id) && !exclude.includes(id))
      if (packages.length === 0)
        return

      // Icons are one ESM module each: pre-bundled, every new one found while browsing reloads the page
      return {
        optimizeDeps: {
          exclude: packages,
        },
      }
    },

    configResolved(config) {
      root = config.root
      logger = config.logger
      isLib = config.command === 'build' && (options.lib ?? Boolean(config.build?.lib))

      rewritesImports = config.command === 'build' || (config.optimizeDeps?.exclude ?? []).includes(ICONS_PACKAGE)

      const iconsPackage = locateIconsPackage(root)
      if (iconsPackage) {
        const sets = toIconSets(defaultIcons)
        if (sets.length > 0)
          packageIcons = loadPackageIcons(iconsPackage.packageDir, sets)
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
            : getDefaultDts(root, options.dtsName ?? 'maz-icons.d.ts'))

      typesModule = options.typesModule ?? resolveIconTypesModule(root)
      loadSources()
      writeTypes()

      const unknown = safelist.filter(name => !sources.icons.has(name))
      if (unknown.length > 0)
        warn(`unknown icons in the safelist: ${unknown.join(', ')}`)
    },

    configureServer(server) {
      isServe = true
      server.watcher.add(dirs.map(({ path }) => resolve(root, path)))
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

        if (id.startsWith(`\0${LAZY_ID_PREFIX}~`))
          return generateLazyTable([id.slice(`\0${LAZY_ID_PREFIX}~`.length)])

        if (id.startsWith(`\0${LAZY_ID_PREFIX}`)) {
          const lazyPrefix = id.slice(`\0${LAZY_ID_PREFIX}`.length)
          return generateLazyTable([
            ...sources.icons,
          ].filter(([name, source]) => source.lazy && getNamePrefix(name) === lazyPrefix).map(([name]) => name).sort())
        }

        const source = sources.icons.get(id.slice(`\0${ICON_ID_PREFIX}`.length))
        // A project SVG removed while a module still imports it: the name renders the fallback
        if (!source)
          return 'export default ""\n'

        // The module of the SVG (the `raw` module of maz-ui): bundled once, for the name and for the imports of the module
        const iconModule = source.import
          ? await this.resolve(source.import.from, source.component ? iconsImporter : join(root, 'package.json'))
          : null
        if (source.import && iconModule && !iconModule.external)
          return reExportIcon(source.import, iconModule.id)
        if (source.import && iconModule && isLib)
          return reExportIcon(source.import, source.import.from)

        if (!source.import) {
          this.addWatchFile(source.file)
          iconFiles.add(source.file)
        }
        return `export default ${JSON.stringify(readIcon(source, await loadOptimizer()))}\n`
      },
    },

    transform: {
      filter: {
        id: { include: SCRIPT_PATTERN, exclude: EXCLUDED_PATTERN },
      },
      handler(code, id) {
        if (!SCRIPT_PATTERN.test(id) || EXCLUDED_PATTERN.test(id))
          return undefined

        const { names: candidates, lazyNames: lazyCandidates, hasIconContext } = scanIconNames(code, prefixes, scanKeys)
        if (isServe)
          candidatesByModule.set(id, new Set([...candidates, ...lazyCandidates]))

        const output = new MagicString(code)
        const hasRewrittenImports = rewritesImports && rewriteIconImports(output, code, iconIds)
        const names = [...candidates].filter(name => sources.icons.has(name)).sort()
        const registers = names.length > 0 || (safelist.length > 0 && hasIconContext)
        const lazyTables = getLazyTables(code, hasIconContext)
        // `~x-mark`: its loader only, unless the file also uses `x-mark`
        const lazyNames = [...lazyCandidates].filter(name => sources.icons.has(name) && !candidates.has(name)).sort()
        if (!registers && !hasRewrittenImports && lazyTables.length === 0 && lazyNames.length === 0)
          return undefined

        if (registers)
          output.prepend(generateRegistration(names))
        for (const lazyPrefix of lazyTables)
          output.prepend(`import ${JSON.stringify(LAZY_ID_PREFIX + lazyPrefix)};\n`)
        for (const name of lazyNames) {
          const loaderId = `${LAZY_ID_PREFIX}~${name}`
          output.prepend(`import ${JSON.stringify(loaderId)};\n`)
        }

        return {
          code: output.toString(),
          map: output.generateMap({ hires: 'boundary', source: id }),
        }
      },
    },
  }
}
