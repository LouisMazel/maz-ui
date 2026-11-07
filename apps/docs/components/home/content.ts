import type { HomeSnippetName } from '../../.vitepress/data/home.data'

export type HomeModuleKind = 'Component' | 'Plugin' | 'Composable' | 'Directive'

export interface HomeModule {
  name: string
  kind: HomeModuleKind
  description: string
  link: string
}

export const INSTALL_COMMANDS = [
  { label: 'pnpm', value: 'pnpm', command: 'pnpm add maz-ui' },
  { label: 'npm', value: 'npm', command: 'npm install maz-ui' },
  { label: 'yarn', value: 'yarn', command: 'yarn add maz-ui' },
  { label: 'bun', value: 'bun', command: 'bun add maz-ui' },
] as const

export const V5_CHANGES: { title: string, description: string }[] = [
  {
    title: 'OKLCH color system',
    description: 'Each color role is one OKLCH value. Its 50 to 950 scale is derived in CSS with relative color syntax, so ramps stay even across hues and one value rebrands every component.',
  },
  {
    title: 'RTL-correct components',
    description: 'Props, slots and styles use logical edges (start-icon, end-icon). Set dir="rtl" and the components mirror.',
  },
  {
    title: 'A lighter chart',
    description: 'MazChart talks to chart.js directly, lazy-loads it on mount and only registers the modules of the chart type.',
  },
  {
    title: 'A simpler icon API',
    description: 'One icon prop takes a Vue component, a URL or a raw SVG string, with a fallback and an RTL flip.',
  },
]

export const FOUNDATIONS: { title: string, description: string, snippet: HomeSnippetName, filename: string, link: string }[] = [
  {
    title: 'Standalone',
    description: 'Import a single component, composable or directive: nothing else ships with it.',
    snippet: 'standalone',
    filename: 'main.ts',
    link: '/guide/vue',
  },
  {
    title: 'SSR and Nuxt',
    description: 'Components render on the server. The Nuxt module auto-imports them and applies the theme without a flash.',
    snippet: 'nuxt',
    filename: 'nuxt.config.ts',
    link: '/ecosystem/nuxt',
  },
  {
    title: 'TypeScript',
    description: 'Written in TypeScript: props, events, slots and options are typed in your editor.',
    snippet: 'typescript',
    filename: 'types.ts',
    link: '/guide/getting-started',
  },
  {
    title: 'Theming and tokens',
    description: 'Colors, radius, fonts and motion live in a theme preset. Override one token and every component follows.',
    snippet: 'tokens',
    filename: 'theme.ts',
    link: '/ecosystem/themes',
  },
  {
    title: 'Dark and light',
    description: 'Each preset ships both color modes. useTheme switches them and follows the system preference by default.',
    snippet: 'darkMode',
    filename: 'theme-toggle.ts',
    link: '/ecosystem/themes',
  },
  {
    title: 'Toolbox',
    description: 'Plugins, composables, directives and the helpers of @maz-ui/utils (formatters, debounce, cookies...).',
    snippet: 'toolbox',
    filename: 'save.ts',
    link: '/plugins/toast',
  },
]

export const PACKAGES: { name: string, description: string, link: string, snippet?: HomeSnippetName }[] = [
  {
    name: '@maz-ui/nuxt',
    description: 'Nuxt module: auto-imports, SSR theming, translations and the setup of AI agents.',
    link: '/ecosystem/nuxt',
  },
  {
    name: '@maz-ui/themes',
    description: 'Theme presets, definePreset and useTheme: the OKLCH theme engine that styles this page.',
    link: '/ecosystem/themes',
  },
  {
    name: '@maz-ui/icons',
    description: 'SVG icons (interface icons, brand logos, country flags) as tree-shakable components, lazy components or raw strings.',
    link: '/ecosystem/icons/',
  },
  {
    name: '@maz-ui/translations',
    description: 'Built-in locales, custom messages and lazy loading for the texts of the components.',
    link: '/ecosystem/translations',
  },
  {
    name: '@maz-ui/mcp',
    description: 'MCP server and CLI that give AI coding agents the knowledge of the maz-ui version you installed.',
    link: '/ecosystem/mcp',
    snippet: 'mcp',
  },
  {
    name: '@maz-ui/upgrade',
    description: 'Codemods that run the mechanical part of a major upgrade, with a dry run first.',
    link: '/guide/migration-v5',
    snippet: 'upgrade',
  },
]

export const FLAGSHIP_MODULES: HomeModule[] = [
  {
    name: 'MazInputPhoneNumber',
    kind: 'Component',
    description: 'Phone numbers of every country, formatted and validated as you type.',
    link: '/components/maz-input-phone-number',
  },
  {
    name: 'MazPopover',
    kind: 'Component',
    description: 'Overlays that escape the overflow of their parents, with smart positioning.',
    link: '/components/maz-popover',
  },
  {
    name: 'MazInput',
    kind: 'Component',
    description: 'Text field with labels, icons, validation states and debounce.',
    link: '/components/maz-input',
  },
  {
    name: 'Toast',
    kind: 'Plugin',
    description: 'Notifications with positions, actions and timeouts, from any component.',
    link: '/plugins/toast',
  },
  {
    name: 'MazTable',
    kind: 'Component',
    description: 'Sorting, search, pagination, selection and virtualized rows.',
    link: '/components/maz-table',
  },
  {
    name: 'MazChecklist',
    kind: 'Component',
    description: 'Multiple selection with an integrated search.',
    link: '/components/maz-checklist',
  },
  {
    name: 'Dialog',
    kind: 'Plugin',
    description: 'Zero-template dialogs: call a function, await the answer.',
    link: '/plugins/dialog',
  },
  {
    name: 'useFormValidator',
    kind: 'Composable',
    description: 'Typed form validation with any Standard Schema library: Valibot, Zod, ArkType.',
    link: '/composables/use-form-validator',
  },
  {
    name: 'v-fullscreen-img',
    kind: 'Directive',
    description: 'Opens an image in fullscreen with zoom and navigation.',
    link: '/directives/fullscreen-img',
  },
  {
    name: 'useDisplayNames',
    kind: 'Composable',
    description: 'Localized country and language names from ISO codes, with Intl.DisplayNames.',
    link: '/composables/use-display-names',
  },
]

export const NEW_MODULES: HomeModule[] = [
  {
    name: 'MazAnimatedText',
    kind: 'Component',
    description: 'Words that slide in with a blur, and a highlighted last word.',
    link: '/components/maz-animated-text',
  },
  {
    name: 'MazAnimatedElement',
    kind: 'Component',
    description: 'Entrance animation for any content when it enters the viewport.',
    link: '/components/maz-animated-element',
  },
  {
    name: 'MazCardSpotlight',
    kind: 'Component',
    description: 'A card with a glow that follows the cursor.',
    link: '/components/maz-card-spotlight',
  },
  {
    name: 'MazMarkdownEditor',
    kind: 'Component',
    description: 'GitHub-style editor with write, preview and split tabs.',
    link: '/components/maz-markdown-editor',
  },
  {
    name: 'MazTimeline',
    kind: 'Component',
    description: 'Step and progress timeline, horizontal, vertical or responsive.',
    link: '/components/maz-timeline',
  },
  {
    name: 'MazSidebar',
    kind: 'Component',
    description: 'Composable sidebar for dashboards, collapsible and accessible.',
    link: '/components/maz-sidebar',
  },
  {
    name: 'MazTicker',
    kind: 'Component',
    description: 'Content that scrolls in a seamless loop.',
    link: '/components/maz-ticker',
  },
  {
    name: 'MazWindowMockup',
    kind: 'Component',
    description: 'Browser, terminal and editor frames to showcase content.',
    link: '/components/maz-window-mockup',
  },
  {
    name: 'MazCodeHighlight',
    kind: 'Component',
    description: 'Syntax highlighting with shiki and a copy button.',
    link: '/components/maz-code-highlight',
  },
  {
    name: 'useDrag',
    kind: 'Composable',
    description: 'Tracks a pointer drag gesture in real time.',
    link: '/composables/use-drag',
  },
  {
    name: 'usePullToRefresh',
    kind: 'Composable',
    description: 'Headless pull to refresh gesture on any scroll container.',
    link: '/composables/use-pull-to-refresh',
  },
]

export const KIND_COLORS: Record<HomeModuleKind, 'primary' | 'secondary' | 'accent' | 'contrast'> = {
  Component: 'primary',
  Plugin: 'secondary',
  Composable: 'accent',
  Directive: 'contrast',
}
