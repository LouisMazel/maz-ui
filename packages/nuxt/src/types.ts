import type { AgentTarget } from '@maz-ui/node'
import type { MazUiThemeOptions, ThemePreset, ThemePresetName } from '@maz-ui/themes'
import type { MazUiTranslationsOptions, MazUiTranslationsSchema } from '@maz-ui/translations'
import type { MazUiIconsOptions, MazUiPurgeCssOptions } from '@maz-ui/vite-plugin'
import type { MazUiDefaultsOptions } from 'maz-ui/composables/useGlobalConfig'
import type { VFullscreenImgOptions, VLazyImgOptions, VTooltipOptions } from 'maz-ui/directives'
import type { AosOptions, DialogOptions, ToastOptions } from 'maz-ui/plugins'
import type { MazUiOptions } from 'maz-ui/plugins/maz-ui'

/**
 * Messages of each locale: the path of a file that exports them by default (loaded when the locale
 * is used, resolved like the other paths of the Nuxt config: `~/locales/fr.ts`), or the messages.
 */
export type MazUiNuxtTranslationsMessages = Record<string, string | MazUiTranslationsSchema>

export interface MazUiNuxtOptions {
  /**
   * General configuration
   */
  general?: {
    /**
     * Prefix for auto-imported composables and directives
     * @description This prefix will be added after the `use` keyword and `v` keyword
     * @example `autoImportPrefix: 'Maz'` will generate `useMazToast` instead of `useToast` and `vMazZoomImg` instead of `vZoomImg`
     * @default ''
     */
    autoImportPrefix?: string

    /**
     * Default path to public SVG icons folder for `<MazIcon />` component
     * @description Relative path from the public directory
     * @example '/icons' to access icons in `public/icons/`
     * @default ''
     */
    defaultMazIconPath?: string

    /**
     * Enable Nuxt DevTools integration
     * @description Adds a Maz-UI tab in Nuxt development tools
     * @default true
     */
    devtools?: boolean

    /**
     * Stop iOS from zooming the page when a form field gets the focus
     * @description iOS zooms on fields with a font size below 16px. Adds `maximum-scale=1` to the viewport
     * on iOS only: iOS still lets the user pinch to zoom, Android (which does not zoom on focus) is left untouched.
     * The design of the fields is not changed.
     * @default false
     */
    preventIosInputZoom?: boolean
  }

  /**
   * Theme system configuration
   * @description If false, the theme system will be completely disabled
   * @default {
   *   preset: 'maz-ui',
   *   strategy: 'runtime',
   *   darkModeStrategy: 'class',
   *   prefix: 'maz',
   *   colorMode: 'auto',
   * }
   */
  theme?: Omit<MazUiThemeOptions, 'preset'> & {
    /**
     * @default 'maz-ui'
     */
    preset?: ThemePreset | ThemePresetName
    /**
     * Named presets the app loads by name (`updateTheme('ocean')`, `definePreset({ base: 'ocean' })`): only these
     * presets are in the build, with the one of `preset` when it is a name. `[]` keeps none, for an app that only
     * uses preset objects. Loading another preset by name throws an error.
     * @default undefined (every preset)
     */
    presets?: ThemePresetName[]
  }

  /**
   * Translations configuration
   * @description If false, the translations system will be completely disabled
   * @default {
   *   locale: 'en',
   * }
   */
  translations?: Omit<MazUiTranslationsOptions, 'messages'> & {
    /**
     * Modify existing or add new languages
     * @example { fr: '~/locales/maz-ui/fr.ts', de: { pagination: { navAriaLabel: 'Seiten' } } }
     */
    messages?: MazUiNuxtTranslationsMessages
  }

  /**
   * Global default prop values for components
   * @description Set default prop values once for every component, with the priority:
   * instance prop > `defaults[Component]` > `defaults.global` > library default.
   * A global default never wins over a prop set on the component instance.
   * @default {}
   * @example {
   *   global: { roundedSize: 'lg' },
   *   MazBtn: { roundedSize: 'full' },
   *   MazCard: { bordered: false, elevation: true },
   * }
   */
  defaults?: MazUiDefaultsOptions

  /**
   * Source of the country flags of `MazSelectCountry` and `MazInputPhoneNumber`
   * @description
   * - `'cdn'`: images of the flagcdn CDN
   * - `'local'`: square flags of `@maz-ui/icons`, one chunk per flag, loaded only when visible, without any request to a third party (works offline)
   * - a URL template of your own files, with `{code}` (lowercase) or `{CODE}` (uppercase): `'/flags/{code}.svg'`
   *
   * Sets the default of the `flag-src` prop (`defaults.global.flagSrc`): a `flag-src` set on a component wins.
   * Nothing is added to the build of the app unless this option is `'local'`.
   * @default 'cdn'
   */
  flags?: 'cdn' | 'local' | (string & {})

  /**
   * Path of a file whose default export opens a link outside of the app, for a Tauri or Electron WebView
   * @description `(href: string, event: MouseEvent) => void`. Called instead of the navigation (prevented) by every
   * component with an `href` (`MazLink`, `MazBtn`, `MazCard`, `MazAvatar`, `MazListItem`, `MazSidebarMenuButton`, `MazMarkdown`),
   * for the absolute `http(s)` URLs of another origin and the `target="_blank"` links. The external icon of `MazLink` follows the same rule.
   * A path is needed because a function cannot go through the module options. Nothing is added to the build when it is not set.
   * @example '~/utils/open-external'
   */
  openExternal?: string

  /**
   * Icons by name: `<MazIcon icon="x-mark" />`, `<MazBtn start-icon="moon">`, with the SVG of the project
   * (`app/icons/hero.svg` is `hero`, or `app:hero` with `prefix: 'app'`). Only the icons a page uses are in its chunk.
   * The types of the names are generated. `false` disables it.
   * @default true
   */
  icons?: boolean | Omit<MazUiIconsOptions, 'dts'>

  /**
   * CSS and styles configuration
   */
  css?: {
    /**
     * Auto-import Maz-UI main CSS file
     * @description Automatically injects Maz-UI base styles
     * @default true
     */
    injectCss?: boolean
    /**
     * Inject `maz-ui/utilities.css`: the maz-ui utilities (`text-title-1`, `type-label`, `rich-text`, `padded-container`,
     * `flex-center`, `glass`...) without Tailwind CSS. Keep it disabled when your project uses Tailwind CSS and
     * imports `maz-ui/tailwindcss/utilities.css`.
     * @default false
     */
    injectUtilities?: boolean
    /**
     * Remove from the CSS of maz-ui the rules of the components, plugins, directives and utilities the app does not use,
     * at build time (@maz-ui/vite-plugin). `false` disables it, an object sets its options (`content`, `entries`,
     * `safelist`, `report`).
     * @default true
     */
    purge?: boolean | MazUiPurgeCssOptions
  }

  /**
   * Components configuration
   */
  components?: {
    /**
     * Auto-import all Maz-UI components
     * @description Makes all Maz-UI components available globally without explicit imports
     * @default true
     */
    autoImport?: boolean
  }

  /**
   * Global options of the toasts of `useToast()`
   * @default {}
   * @example { position: 'top-right', timeout: 5000 }
   */
  toast?: ToastOptions

  /**
   * Global options of the dialogs of `useDialog()`
   * @default {}
   * @example { acceptText: 'Yes', rejectText: 'No' }
   */
  dialog?: DialogOptions

  /**
   * Motion of the components: `'auto'` follows `prefers-reduced-motion`, `'reduced'` and `'full'` force it.
   * `{ scope: 'page' }` also stops the animations of the whole page under reduced motion.
   * @default 'auto'
   * @example 'reduced'
   */
  motion?: MazUiOptions['motion']

  /**
   * Density of the controls: `'default'` keeps the heights of maz-ui 5, `'compact'` makes them about 14% shorter
   * (a `md` control goes from 42px to 36px) with tighter paddings. Rendered as a class of `<html>` by the server.
   * @default 'default'
   * @example 'compact'
   */
  // Removed in v6 (plans/ROADMAP.md): `compact` becomes the default density
  density?: MazUiOptions['density']

  /**
   * Animations on scroll: installs the AOS plugin and auto-imports `useAos`
   * @deprecated Use the `vReveal` directive (`directives: { vReveal: true }`), `MazReveal` or `useReveal` instead
   * @default false
   */
  // Removed in v6 (plans/ROADMAP.md): the AOS is replaced by vReveal
  aos?:
    | boolean
    | (Omit<AosOptions, 'router'> & {
      /**
       * Auto inject AOS CSS file
       * @default true
       */
      injectCss?: boolean
      /**
       * Re-run animations on page change (for SPA navigation)
       * @default false
       */
      router?: boolean
    })

  /**
   * Plugins configuration
   * @deprecated `useToast`, `useDialog` and `useWait` are always auto-imported: use the `toast`, `dialog` and `aos` options. Removed in v6.
   */
  // Removed in v6 (plans/ROADMAP.md): deprecated plugins option
  plugins?: {
    /**
     * @deprecated use the `aos` option
     */
    aos?: MazUiNuxtOptions['aos']

    /**
     * @deprecated `useDialog` is always auto-imported, its options go in the `dialog` option
     */
    dialog?: boolean | DialogOptions

    /**
     * @deprecated `useToast` is always auto-imported, its options go in the `toast` option
     */
    toast?: boolean | ToastOptions

    /**
     * @deprecated `useWait` is always auto-imported
     */
    wait?: boolean
  }

  /**
   * Composables configuration
   */
  composables?: {
    /**
     * Enable auto-import of useToast composable
     * @description Toast notifications, with the options of `toast`
     * @default true
     */
    useToast?: boolean

    /**
     * Enable auto-import of useDialog composable
     * @description Dialogs and confirmations, with the options of `dialog`
     * @default true
     */
    useDialog?: boolean

    /**
     * Enable auto-import of useWait composable
     * @description Loading states shared by the whole app
     * @default true
     */
    useWait?: boolean

    /**
     * Enable auto-import of useTranslations composable
     * @description Provides translations functionality from `@maz-ui/translations` package
     * @default true
     */
    useTranslations?: boolean

    /**
     * Enable auto-import of useTheme composable
     * @description Provides theme management functionality (toggle dark mode, change themes, etc.) from `@maz-ui/themes` package
     * @default false
     */
    useTheme?: boolean

    /**
     * Enable auto-import of useIdleTimeout composable
     * @description Detect user idle state and execute callbacks
     * @default true
     */
    useIdleTimeout?: boolean

    /**
     * Enable auto-import of useReadingTime composable
     * @description Calculate estimated reading time for text content
     * @default true
     */
    useReadingTime?: boolean

    /**
     * Enable auto-import of useRelativeTime composable
     * @description Reactive localized relative time (`3 minutes ago`) refreshed at the right moment
     * @default true
     */
    useRelativeTime?: boolean

    /**
     * Enable auto-import of useEventListener composable
     * @description Event listener on a window, a document or an element, removed on unmount
     * @default true
     */
    useEventListener?: boolean

    /**
     * Enable auto-import of useWindow composable
     * @description The window and its listeners, SSR safe
     * @default true
     */
    useWindow?: boolean

    /**
     * Enable auto-import of useWindowFocus composable
     * @description Reactive focus of the window
     * @default true
     */
    useWindowFocus?: boolean

    /**
     * Enable auto-import of useMediaQuery composable
     * @description Reactive CSS media query
     * @default true
     */
    useMediaQuery?: boolean

    /**
     * Enable auto-import of useReducedMotion composable
     * @description Reactive `prefers-reduced-motion` preference
     * @default true
     */
    useReducedMotion?: boolean

    /**
     * Enable auto-import of useShortcut composable
     * @description Platform aware keyboard shortcut (Cmd on macOS, Ctrl elsewhere) and its label
     * @default true
     */
    useShortcut?: boolean

    /**
     * Enable auto-import of useWindowSize composable
     * @description Reactive window dimensions tracking
     * @default true
     */
    useWindowSize?: boolean

    /**
     * Enable auto-import of useBreakpoints composable
     * @description Responsive breakpoints detection and utilities
     * @default true
     */
    useBreakpoints?: boolean

    /**
     * Enable auto-import of useUserVisibility composable
     * @description Detect when user is viewing the page (Page Visibility API)
     * @default true
     */
    useUserVisibility?: boolean

    /**
     * Enable auto-import of useStringMatching composable
     * @description String matching and filtering utilities
     * @default true
     */
    useStringMatching?: boolean

    /**
     * Enable auto-import of useFuzzySearch composable
     * @description Fuzzy search in a list (prefixes, words in any order, typos, accents)
     * @default true
     */
    useFuzzySearch?: boolean

    /**
     * Enable auto-import of useClipboard composable
     * @description Copy a text to the clipboard with a `copied` state
     * @default true
     */
    useClipboard?: boolean

    /**
     * Enable auto-import of useTimer composable
     * @description Timer and countdown functionality
     * @default true
     */
    useTimer?: boolean

    /**
     * Enable auto-import of useFormField composable
     * @description Form field management (should be used with useFormValidator)
     * @default true
     */
    useFormField?: boolean

    /**
     * Enable auto-import of useFormValidator and useFormField composables
     * @description Form validation utilities and field management
     * @default true
     */
    useFormValidator?: boolean

    /**
     * Enable auto-import of useDisplayNames composable
     * @description Get localized language display names
     * @default true
     */
    useDisplayNames?: boolean

    /**
     * Enable auto-import of useFreezeValue composable
     * @description Freeze values to prevent mutation
     * @default true
     */
    useFreezeValue?: boolean

    /**
     * Enable auto-import of useInjectStrict composable
     * @description Inject strict types for components
     * @default true
     */
    useInjectStrict?: boolean

    /**
     * Enable auto-import of useInstanceUniqId composable
     * @description Generate unique IDs for components
     * @default true
     */
    useInstanceUniqId?: boolean

    /**
     * Enable auto-import of useMountComponent composable
     * @description Mount components on the DOM
     * @default true
     */
    useMountComponent?: boolean

    /**
     * Enable auto-import of useSwipe composable
     * @description Swipe gesture detection and handling
     * @default true
     */
    useSwipe?: boolean

    /**
     * Enable auto-import of usePullToRefresh composable
     * @description Headless pull to refresh gesture on a scroll container
     * @default true
     */
    usePullToRefresh?: boolean

    /**
     * Enable auto-import of useIntersectionObserver composable
     * @description Know when elements enter or leave the viewport
     * @default true
     */
    useIntersectionObserver?: boolean

    /**
     * Enable auto-import of useScroll composable
     * @description Scroll position, direction and edges of the page or of an element
     * @default true
     */
    useScroll?: boolean

    /**
     * Enable auto-import of useInfiniteScroll composable
     * @description Load the next page of a list when its end gets close
     * @default true
     */
    useInfiniteScroll?: boolean

    /**
     * Enable auto-import of useScrollLock composable
     * @description Lock the scroll of the page or of an element (menu, overlay)
     * @default true
     */
    useScrollLock?: boolean

    /**
     * Enable auto-import of useResizeObserver composable
     * @description Know when the size of elements changes
     * @default true
     */
    useResizeObserver?: boolean
  }

  /**
   * Vue directives configuration
   */
  directives?: {
    /**
     * Install v-zoom-img directive globally
     * @description Enables image zoom functionality on click
     * @default false
     */
    vZoomImg?: boolean

    /**
     * Install v-lazy-img directive globally
     * @description Lazy loading for images with intersection observer
     * @default false
     */
    vLazyImg?: boolean | VLazyImgOptions

    /**
     * Install v-click-outside directive globally
     * @description Detect clicks outside of an element
     * @default false
     */
    vClickOutside?: boolean

    /**
     * Install v-fullscreen-img directive globally
     * @description Fullscreen image viewer functionality
     * @default false
     */
    vFullscreenImg?: boolean | VFullscreenImgOptions

    /**
     * Install v-intersect directive globally
     * @description Call a function when an element enters or leaves the viewport
     * @default false
     */
    vIntersect?: boolean

    /**
     * Install v-tooltip directive globally
     * @description Tooltip functionality for any element
     * @default false
     */
    vTooltip?: boolean | VTooltipOptions

    /**
     * Install v-reveal directive globally
     * @description Reveals the elements when they enter the viewport (fade, slide, curtain, lines...), the replacement of the AOS
     * @default false
     */
    vReveal?: boolean

    /**
     * Install v-press directive globally
     * @description Gives a tactile press feedback (a small scale down) to any clickable element
     * @default false
     */
    vPress?: boolean

    /**
     * Install v-ripple directive globally
     * @description Draws a ripple from the pointer on click, or a glow that follows it
     * @default false
     */
    vRipple?: boolean

    /**
     * Install v-magnetic directive globally
     * @description Pulls the element toward the pointer when it comes close
     * @default false
     */
    vMagnetic?: boolean

    /**
     * Install v-tilt directive globally
     * @description Tilts the element in 3D with the pointer, with an optional glare and a floating mode
     * @default false
     */
    vTilt?: boolean

    /**
     * Install v-draw directive globally
     * @description Draws the strokes of an SVG (or a border) when it enters the viewport or on hover
     * @default false
     */
    vDraw?: boolean
  }

  /**
   * AI coding agents integration
   * @description Connects the AI coding agents detected in the project (Claude Code, Cursor, GitHub Copilot...) to maz-ui, in development only (never in CI or tests), version-matched with the installed maz-ui, without overwriting files you own.
   * - `mcp`: registers the maz-ui MCP server in the agent configs (`.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`). Its instructions already give the maz-ui rules to the agents.
   * - `rules`: also writes the maz-ui rules in `.claude/rules/maz-ui.md` and in a delimited section of `AGENTS.md` (for agents without MCP).
   * - `targets`: agents to configure (`'claude'`, `'agents-md'`, `'cursor'`, `'vscode'`), default: the detected ones. Nothing is written when no agent is detected.
   * - `dir`: folder where the agent files are written, relative to the Nuxt root. Default: the workspace root (`workspaceDir`), so that in a monorepo the files land where the agents start
   * - `paths`: globs (relative to `dir`) the Claude Code rule is scoped to, so that it is only loaded when Claude reads or edits a matching file. Default `'auto'`: the workspaces that depend on maz-ui. `'all'`: always loaded
   * - `true`: `{ mcp: true, rules: true }`, `false`: disabled
   * @example `agents: { rules: true }` or `agents: false`
   * @default { rules: false, mcp: false }
   */
  agents?: boolean | {
    targets?: AgentTarget[]
    rules?: boolean
    mcp?: boolean
    dir?: string
    paths?: 'auto' | 'all' | string[]
  }
}
