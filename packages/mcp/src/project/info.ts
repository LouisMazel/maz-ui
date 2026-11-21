import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { findProjectPackage, findWorkspaceDirs, readPackageVersion } from '@maz-ui/node'
import { glob } from 'tinyglobby'
import { dependsOnPackages, detectFramework } from '../review/files.ts'
import { readProjectTheme } from './theme.ts'

const ECOSYSTEM_PACKAGES = [
  'maz-ui',
  '@maz-ui/nuxt',
  '@maz-ui/themes',
  '@maz-ui/icons',
  '@maz-ui/utils',
  '@maz-ui/translations',
  '@maz-ui/vite-plugin',
  '@maz-ui/mcp',
]
/** The plugins of maz-ui, by the name of their Nuxt option */
const PLUGINS = { toast: 'ToastPlugin', dialog: 'DialogPlugin', wait: 'WaitPlugin', aos: 'AosPlugin' }
/** `useToast`, `useDialog` and `useWait` work without these plugins, deprecated and removed in v6 */
const DEPRECATED_PLUGINS = ['ToastPlugin', 'DialogPlugin', 'WaitPlugin']
const SOURCES = '**/*.{vue,ts,js,tsx,jsx,mts,mjs}'
const IGNORED = ['**/node_modules/**', '**/dist/**', '**/.nuxt/**', '**/.output/**', '**/coverage/**', '**/*.d.ts']
const MAX_SCANNED_FILES = 3000
const TOP = 15

export interface AppInfo {
  /** Folder of the app, relative to the project root (`.` for the root) */
  path: string
  framework: 'vue' | 'nuxt'
  /** Installed versions of the packages of the ecosystem */
  versions: Record<string, string>
  /** Plugins installed by the app: `app.use(ToastPlugin)` or `mazUi.plugins` */
  plugins: string[]
  /** Animations on scroll: `AosPlugin`, the `aos` option of `MazUi` or of the Nuxt module */
  aos: boolean
  /** Vue: `app.use(MazUi)` initializes the theme and the translations (Nuxt: the module) */
  mazUiPlugin: boolean
  /** `MazUi()` of `@maz-ui/vite-plugin` or `@maz-ui/nuxt`: the icons are used by name */
  iconsByName: boolean
  /** Components of the templates resolved without imports (Nuxt module or `MazComponentsResolver`) */
  componentsAutoImported: boolean
  /** Theme presets of the app (`definePreset`) */
  presets: string[]
  /** maz-ui components and tools already used in the code, most used first */
  usage: { components: Array<[string, number]>, tools: Array<[string, number]>, scannedFiles: number }
}

function read(file: string): string {
  return existsSync(file)
    ? readFileSync(file, 'utf8')
    : ''
}

function configSources(directory: string, names: string[]): string {
  return names.flatMap(name => ['ts', 'js', 'mjs', 'mts'].map(extension => read(join(directory, `${name}.${extension}`)))).join('\n')
}

function versionsOf(directory: string): Record<string, string> {
  return Object.fromEntries(ECOSYSTEM_PACKAGES.flatMap((name) => {
    const packageDir = findProjectPackage(directory, name)
    const version = packageDir && readPackageVersion(packageDir)

    return version
      ? [[name, version]]
      : []
  }))
}

/** Plugins of a Nuxt app: the `plugins` of the `mazUi` options set to `true` or to their options */
function nuxtPlugins(config: string): string[] {
  const options = /\bplugins\s*:\s*\{([^}]*)\}/.exec(config)?.[1] ?? ''

  return Object.entries(PLUGINS).filter(([option]) => new RegExp(`\\b${option}\\s*:\\s*(?:true\\b|\\{)`).test(options)).map(([, plugin]) => plugin)
}

/** The `aos` option of `MazUi` or of the Nuxt module is enabled */
function hasAosOption(code: string): boolean {
  return /\baos\s*:\s*(?:true\b|\{)/.test(code)
}

function count(values: string[]): Array<[string, number]> {
  const counts = new Map<string, number>()

  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)

  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, TOP)
}

/** Components of the templates (`<MazBtn`, `<maz-btn`) and imports of the ecosystem, in each file of the app */
async function scanUsage(directory: string, componentNames: Set<string>): Promise<{ sources: string[], usage: AppInfo['usage'] }> {
  const files = (await glob(SOURCES, { cwd: directory, absolute: true, ignore: IGNORED })).slice(0, MAX_SCANNED_FILES)
  const sources = files.map(file => read(file))
  const components = sources.flatMap(source => [...source.matchAll(/<(Maz[A-Z]\w*|maz-[a-z][\w-]*)/g)].map(([, tag]) => tag.startsWith('maz-')
    ? tag.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')
    : tag)).filter(name => componentNames.has(name))
  const tools = sources.flatMap(source => [...source.matchAll(/from\s+['"](?:maz-ui\/(?:composables|directives)|@maz-ui\/utils\/helpers)\/(\w+)['"]/g)].map(([, name]) => name))

  return { sources, usage: { components: count(components), tools: count(tools), scannedFiles: files.length } }
}

async function appInfo(rootDir: string, directory: string, componentNames: Set<string>): Promise<AppInfo> {
  const framework = detectFramework(directory)
  const viteConfig = configSources(directory, ['vite.config'])
  const nuxtConfig = configSources(directory, ['nuxt.config'])
  const { sources, usage } = await scanUsage(directory, componentNames)
  const code = sources.join('\n')
  const plugins = framework === 'nuxt'
    ? nuxtPlugins(nuxtConfig)
    : Object.values(PLUGINS).filter(plugin => new RegExp(`\\.use\\(\\s*${plugin}\\b`).test(code))

  return {
    path: relative(rootDir, directory) || '.',
    framework,
    versions: versionsOf(directory),
    plugins,
    aos: plugins.includes(PLUGINS.aos) || hasAosOption(framework === 'nuxt'
      ? nuxtConfig
      : code),
    mazUiPlugin: framework === 'nuxt' || /\.use\(\s*MazUi\b/.test(code),
    iconsByName: framework === 'nuxt' || /\bMazUi\s*\(/.test(viteConfig),
    componentsAutoImported: framework === 'nuxt' || /\bMazComponentsResolver\b/.test(viteConfig),
    presets: readProjectTheme(directory).presets.map(preset => preset.exportName ?? preset.base ?? preset.file),
    usage,
  }
}

/** The apps that use maz-ui: the project, or the workspaces of a monorepo that depend on it. `componentNames`: the maz-ui components, to tell them from the TypeScript generics */
export function readProjectInfo(rootDir: string, componentNames: Iterable<string>): Promise<AppInfo[]> {
  const names = new Set(componentNames)
  const apps = [rootDir, ...findWorkspaceDirs(rootDir)].filter(directory => dependsOnPackages(directory, ['maz-ui', '@maz-ui/nuxt']) && existsSync(join(directory, 'package.json')))

  return Promise.all(apps.map(directory => appInfo(rootDir, directory, names)))
}

function renderList(entries: Array<[string, number]>): string {
  return entries.map(([name, uses]) => `\`${name}\` (${uses})`).join(', ')
}

// Removed in v6 (plans/ROADMAP.md): a maz-ui older than the standalone composables
function renderLegacyPlugins(app: AppInfo): string {
  const missing = Object.values(PLUGINS).filter(plugin => !app.plugins.includes(plugin))
  const installed = app.plugins.length > 0
    ? app.plugins.map(plugin => `\`${plugin}\``).join(', ')
    : 'none'
  const howTo = app.framework === 'nuxt'
    ? '`mazUi: { plugins: { toast: true } }` in `nuxt.config`'
    : '`app.use(ToastPlugin)` from `maz-ui/plugins/toast` in `main.ts`'

  return `- Plugins: ${installed}.${missing.length > 0
    ? ` Before using \`useToast\`, \`useDialog\`, \`useWait\` or \`useAos\`, install the missing plugin once: ${howTo}.`
    : ''}`
}

function renderPlugins(app: AppInfo): string {
  const nuxt = app.framework === 'nuxt'
  const deprecated = app.plugins.filter(plugin => DEPRECATED_PLUGINS.includes(plugin))
  const options = nuxt
    ? '`mazUi.toast` and `mazUi.dialog` in `nuxt.config`'
    : '`app.use(MazUi, { toast, dialog })`'
  const lines = [
    `- Toast, dialog and wait: \`useToast\`, \`useDialog\` and \`useWait\` need no plugin, their global options go in ${options}.`,
    `- Animations on scroll: ${app.aos
      ? 'enabled (`useAos`).'
      : `disabled, enable them with ${nuxt
        ? '`mazUi: { aos: true }`'
        : '`app.use(MazUi, { aos: true })` and `import \'maz-ui/aos.css\'`'} before using \`useAos\`.`}`,
  ]

  if (deprecated.length > 0) {
    lines.push(`- Deprecated: ${nuxt
      ? '`mazUi.plugins`'
      : deprecated.map(plugin => `\`app.use(${plugin})\``).join(', ')} still works, removed in v6: remove it and move its options to ${options}.`)
  }

  return lines.join('\n')
}

export interface RenderProjectInfoOptions {
  /** `useToast`, `useDialog` and `useWait` work without their plugin in the installed maz-ui */
  standaloneComposables?: boolean
}

export function renderProjectInfo(apps: AppInfo[], { standaloneComposables = true }: RenderProjectInfoOptions = {}): string {
  if (apps.length === 0)
    return 'No app of this project depends on maz-ui. `get_setup_guide` gives the installation for Vue or Nuxt.'

  return apps.map((app) => {
    const versions = Object.entries(app.versions).map(([name, version]) => `${name} ${version}`).join(', ')
    const lines = [
      `## ${app.path === '.' ? 'Project' : `App \`${app.path}\``}: ${app.framework === 'nuxt' ? 'Nuxt (`@maz-ui/nuxt`)' : 'Vue'}`,
      `- Installed: ${versions || 'no package of the ecosystem in node_modules: install the dependencies'}`,
      ...(app.mazUiPlugin
        ? []
        : ['- `app.use(MazUi)` (`maz-ui/plugins/maz-ui`) not found: it initializes the theme and the translations of the components, add it to `main.ts` with a preset (`get_setup_guide`).']),
      standaloneComposables
        ? renderPlugins(app)
        : renderLegacyPlugins(app),
      `- Components: ${app.componentsAutoImported
        ? 'auto-imported in the templates'
        : 'import each one (`import MazBtn from \'maz-ui/components/MazBtn\'`)'}. Composables: ${app.framework === 'nuxt'
        ? 'auto-imported'
        : 'deep imports (`maz-ui/composables/useToast`)'}.`,
      `- Icons: ${app.iconsByName
        ? 'by name in the icon props (`start-icon="trash"`)'
        : 'imported (`@maz-ui/icons/raw/MazTrash` for the icon props, `/static/` in the templates): add `MazUi()` of `@maz-ui/vite-plugin` to use them by name'}.`,
      `- Theme presets: ${app.presets.length > 0
        ? app.presets.map(preset => `\`${preset}\``).join(', ')
        : 'the default one'} (colors and tokens: \`get_theme_tokens\`).`,
    ]

    if (app.usage.components.length > 0)
      lines.push(`- Components already used: ${renderList(app.usage.components)}`)

    if (app.usage.tools.length > 0)
      lines.push(`- Composables, directives and helpers already used: ${renderList(app.usage.tools)}`)

    return lines.join('\n')
  }).join('\n\n')
}
