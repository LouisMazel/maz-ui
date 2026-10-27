/**
 * Format of the maz-ui agent knowledge bundle.
 *
 * The bundle is a folder of agent-ready markdown files plus a `manifest.json`
 * describing them. It is shipped in `maz-ui` (`node_modules/maz-ui/docs`, so
 * agents always read the docs of the installed version) and in `@maz-ui/mcp`
 * (fallback when maz-ui is not installed). Bump `AGENT_DOCS_SCHEMA_VERSION`
 * on any breaking change of this contract: the MCP server validates it.
 */
export const AGENT_DOCS_SCHEMA_VERSION = 1

export type DocCategory
  = | 'component'
    | 'composable'
    | 'directive'
    | 'plugin'
    | 'util'
    | 'node'
    | 'guide'
    | 'ecosystem'
    | 'reference'

export interface DocEntry {
  /** Unique id, also the file path without extension: `components/maz-btn` */
  id: string
  category: DocCategory
  slug: string
  title: string
  description: string
  /** npm package providing the documented feature */
  package: string
  /** Path of the markdown file, relative to the bundle root */
  file: string
  /** Public page on maz-ui.com */
  url?: string
  /** Exported identifiers documented by the page (`MazBtn`, `useToast`, `debounce`...) */
  symbols: string[]
  /** Canonical import statements */
  imports: string[]
  /** Intent keywords used by search (`profile picture` for MazAvatar...) */
  aliases: string[]
  /** h2 and h3 titles of the page */
  headings: string[]
  /** Related doc ids */
  related: string[]
  /** Number of characters of the markdown file */
  chars: number
}

export interface PropApi {
  /** camelCase name, as declared in `defineProps` */
  name: string
  type: string
  description?: string
  required: boolean
  default?: string
  /** Accepted literal values, when documented */
  values?: string[]
  /** `true` when `values` is exhaustive (the prop does not accept any other value) */
  strictValues: boolean
  /** v-model argument (`modelValue` for `v-model`, `open` for `v-model:open`) */
  model?: string
}

export interface EventApi {
  name: string
  description?: string
  payload?: string
}

export interface SlotBindingApi {
  name: string
  type?: string
  description?: string
}

export interface SlotApi {
  name: string
  description?: string
  bindings: SlotBindingApi[]
}

export interface ExposeApi {
  name: string
  description?: string
}

export interface ComponentApi {
  name: string
  /** Doc page documenting the component */
  docId: string
  description?: string
  import: string
  /** Parent component when this one is a building block (`MazSidebarGroup` -> `MazSidebar`) */
  parent?: string
  props: PropApi[]
  events: EventApi[]
  slots: SlotApi[]
  expose: ExposeApi[]
}

export interface ThemeColorToken {
  /** Tailwind color name: `primary`, `surface`... */
  name: string
  /** Runtime variable emitted by @maz-ui/themes: `--maz-primary` */
  variable: string
  /** `true` when a `{name}-foreground` color exists */
  foreground: boolean
  /** Scale steps (`50`...`950`) available as `{name}-{step}` */
  scale: string[]
  /** Purpose of the color */
  usage: string
}

export interface NamedToken {
  name: string
  value: string
}

export interface TailwindUtility {
  name: string
  css: string
}

export interface TailwindManifest {
  /** CSS entry points a consumer can import */
  entries: Array<{ path: string, description: string }>
  colors: ThemeColorToken[]
  radius: NamedToken[]
  shadows: NamedToken[]
  breakpoints: NamedToken[]
  zIndex: NamedToken[]
  fonts: NamedToken[]
  durations: NamedToken[]
  easings: NamedToken[]
  spacing: NamedToken[]
  /** Custom utilities from `maz-ui/tailwindcss/utilities.css` */
  utilities: TailwindUtility[]
  /** Custom variants declared by maz-ui (`dark`) */
  variants: NamedToken[]
  /** Layout variables (`--maz-container-max-width`...) that can be overridden */
  containerVariables: NamedToken[]
  /** `<Transition name="...">` names shipped in `maz-ui/style.css` */
  transitions: string[]
}

export interface EcosystemPackage {
  name: string
  description: string
  docId: string
}

export interface AgentDocsManifest {
  schemaVersion: typeof AGENT_DOCS_SCHEMA_VERSION
  name: 'maz-ui'
  version: string
  homepage: string
  packages: EcosystemPackage[]
  docs: DocEntry[]
  components: ComponentApi[]
  icons: {
    package: '@maz-ui/icons'
    names: string[]
  }
  tailwind: TailwindManifest
}

/** A file produced by the generator, relative to the output directory */
export interface OutputFile {
  path: string
  content: string
}
