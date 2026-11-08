import type { PackageGroup } from './types'

export interface PackageDefinition {
  /** npm package name */
  name: string
  /** Folder of the package in `packages/` */
  dir: string
  /** Name without scope: folder of the fragment in the bundle of the MCP */
  short: string
  description: string
  group: PackageGroup
  /** Main doc of the package, its homepage */
  mainDocId: string
}

/** The published packages, grouped like `monorepo.groups` of `relizy.config.ts` */
export const PACKAGE_DEFINITIONS: PackageDefinition[] = [
  {
    name: 'maz-ui',
    dir: 'maz-ui',
    short: 'maz-ui',
    description: 'Vue 3 and Nuxt UI library: components, composables, directives and plugins, styled with Tailwind CSS v4 theme tokens.',
    group: 'ecosystem',
    mainDocId: 'guide/getting-started',
  },
  {
    name: '@maz-ui/icons',
    dir: 'icons',
    short: 'icons',
    description: 'Icon set of 860+ SVG icons (interface icons, logos, country flags) as Vue components, raw SVG strings and files.',
    group: 'ecosystem',
    mainDocId: 'ecosystem/icons',
  },
  {
    name: '@maz-ui/mcp',
    dir: 'mcp',
    short: 'mcp',
    description: 'MCP server and CLI giving AI agents the version-matched docs of maz-ui: search, component APIs, icons, theme tokens and code review.',
    group: 'ecosystem',
    mainDocId: 'ecosystem/mcp',
  },
  {
    name: '@maz-ui/node',
    dir: 'node',
    short: 'node',
    description: 'Node.js utilities: logger, command execution, banner and setup of AI agents (setupAgents).',
    group: 'tooling',
    mainDocId: 'ecosystem/node',
  },
  {
    name: '@maz-ui/nuxt',
    dir: 'nuxt',
    short: 'nuxt',
    description: 'Nuxt module of maz-ui: auto-imported components and composables, plugins, theme and translations setup.',
    group: 'ecosystem',
    mainDocId: 'ecosystem/nuxt',
  },
  {
    name: '@maz-ui/themes',
    dir: 'themes',
    short: 'themes',
    description: 'Theme system: presets, color modes, CSS variables and the useTheme composable.',
    group: 'ecosystem',
    mainDocId: 'ecosystem/themes',
  },
  {
    name: '@maz-ui/translations',
    dir: 'translations',
    short: 'translations',
    description: 'Translations of the maz-ui components and the i18n plugin, with locales to import on demand.',
    group: 'ecosystem',
    mainDocId: 'ecosystem/translations',
  },
  {
    name: '@maz-ui/utils',
    dir: 'utils',
    short: 'utils',
    description: 'Framework-agnostic JavaScript and TypeScript helpers: debounce, formatters, dates, cookies, validation and TypeScript types.',
    group: 'ecosystem',
    mainDocId: 'ecosystem/utils',
  },
  {
    name: '@maz-ui/eslint-config',
    dir: 'eslint-config',
    short: 'eslint-config',
    description: 'ESLint flat config for Vue, Nuxt, JavaScript and TypeScript projects, with SonarJS, Tailwind and accessibility rules.',
    group: 'tooling',
    mainDocId: 'ecosystem/eslint-config',
  },
  {
    name: '@maz-ui/stylelint-config',
    dir: 'stylelint-config',
    short: 'stylelint-config',
    description: 'Stylelint config for CSS, SCSS, Vue and Tailwind CSS projects.',
    group: 'tooling',
    mainDocId: 'ecosystem/stylelint-config',
  },
  {
    name: '@maz-ui/upgrade',
    dir: 'upgrade',
    short: 'upgrade',
    description: 'CLI that rewrites a project from Maz-UI v4 to v5 (imports, props, CSS, config, dependencies).',
    group: 'tooling',
    mainDocId: 'ecosystem/upgrade',
  },
]

export function findPackageDefinition(name: string): PackageDefinition | undefined {
  return PACKAGE_DEFINITIONS.find(definition => definition.name === name)
}
