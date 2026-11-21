import type { ReviewContext, Severity } from './types.ts'

import { hasStandaloneComposables } from '../knowledge/features.ts'
import { closest } from '../knowledge/resolve.ts'
import { checkClassStrings } from './classes.ts'
import { checkPresetColors } from './preset.ts'

interface ThirdPartyRule {
  /** Package names (exact or prefix ending with `/`) */
  packages: string[]
  /** Only these named imports are flagged (all imports when omitted) */
  names?: Record<string, string>
  replacement?: string
  severity: Severity
  rule: 'prefer-ecosystem' | 'prefer-utils'
}

const UTILS_NAMES: Record<string, string> = {
  debounce: '`debounce` from `@maz-ui/utils/helpers/debounce`',
  throttle: '`throttle` from `@maz-ui/utils/helpers/throttle`',
  isEqual: '`isEqual` from `@maz-ui/utils/helpers/isEqual`',
  capitalize: '`capitalize` from `@maz-ui/utils/helpers/capitalize`',
  upperFirst: '`upperFirst` from `@maz-ui/utils/helpers/upperFirst`',
  camelCase: '`camelCase` from `@maz-ui/utils/helpers/camelCase`',
  kebabCase: '`kebabCase` from `@maz-ui/utils/helpers/kebabCase`',
  snakeCase: '`snakeCase` from `@maz-ui/utils/helpers/snakeCase`',
  startCase: '`pascalCase` or `normalizeString` from `@maz-ui/utils`',
  delay: '`sleep` from `@maz-ui/utils/helpers/sleep`',
  deburr: '`normalizeString` from `@maz-ui/utils/helpers/normalizeString`',
  uniqueId: '`useId()` from `vue`, or `useInstanceUniqId` from `maz-ui/composables/useInstanceUniqId`',
}

const THIRD_PARTY_RULES: ThirdPartyRule[] = [
  {
    packages: [
      'lodash',
      'lodash-es',
      'lodash/',
      'lodash-es/',
      'underscore',
      'radash',
      'es-toolkit',
    ],
    names: UTILS_NAMES,
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: [
      'lodash.debounce',
      'just-debounce-it',
      'debounce',
      'p-debounce',
    ],
    replacement: UTILS_NAMES.debounce,
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['lodash.throttle', 'just-throttle', 'throttle-debounce'],
    replacement: '`debounce` / `throttle` from `@maz-ui/utils`',
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['js-cookie', 'universal-cookie', 'vue-cookies'],
    replacement: '`getCookie`, `setCookie`, `deleteCookie` from `@maz-ui/utils/helpers/cookie`',
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['@vueuse/core'],
    names: {
      useWindowSize: '`useWindowSize` from `maz-ui/composables/useWindowSize`',
      useBreakpoints: '`useBreakpoints` from `maz-ui/composables/useBreakpoints`',
      onClickOutside: 'the `vClickOutside` directive (`maz-ui/directives/vClickOutside`)',
      useIdle: '`useIdleTimeout` from `maz-ui/composables/useIdleTimeout`',
      useSwipe: '`useSwipe` from `maz-ui/composables/useSwipe`',
      useDocumentVisibility: '`useUserVisibility` from `maz-ui/composables/useUserVisibility`',
      useDropZone: 'MazDropzone or `useDropzone` (`maz-ui/composables/useDropzone`)',
      useMutationObserver: '`useMutationObserver` from `maz-ui/composables/useMutationObserver`',
      useResizeObserver: '`useResizeObserver` from `maz-ui/composables/useResizeObserver`',
      useElementSize: '`useResizeObserver` from `maz-ui/composables/useResizeObserver` (`width`, `height`)',
      useTimeAgo: '`useRelativeTime` from `maz-ui/composables/useRelativeTime`',
      useTimeoutFn: '`useTimer` from `maz-ui/composables/useTimer`',
      usePointerSwipe: '`useSwipe` (`maz-ui/composables/useSwipe`) or `useDrag` (`maz-ui/composables/useDrag`)',
      useDark: '`useTheme` from `@maz-ui/themes` (`isDark`, `toggleDarkMode`)',
      useColorMode: '`useTheme` from `@maz-ui/themes` (`colorMode`, `setColorMode`)',
      usePreferredDark: '`useTheme` from `@maz-ui/themes`',
      useDebounceFn: '`debounce` from `@maz-ui/utils/helpers/debounce`',
      useThrottleFn: '`throttle` from `@maz-ui/utils/helpers/throttle`',
      useClipboard: '`useClipboard` from `maz-ui/composables/useClipboard`',
      useIntervalFn: '`useTimer` from `maz-ui/composables/useTimer` for a countdown',
      useCountdown: '`useTimer` from `maz-ui/composables/useTimer`',
      useTimeout: '`useTimer` from `maz-ui/composables/useTimer`',
      useIntersectionObserver: '`useIntersectionObserver` from `maz-ui/composables/useIntersectionObserver` (or the `vIntersect` directive)',
      useElementVisibility: '`useIntersectionObserver` from `maz-ui/composables/useIntersectionObserver` (`isIntersecting`)',
      useScroll: '`useScroll` from `maz-ui/composables/useScroll`',
      useWindowScroll: '`useScroll` from `maz-ui/composables/useScroll`',
      useInfiniteScroll: '`useInfiniteScroll` from `maz-ui/composables/useInfiniteScroll`',
      useScrollLock: '`useScrollLock` from `maz-ui/composables/useScrollLock`',
      useMediaQuery: '`useBreakpoints` from `maz-ui/composables/useBreakpoints`',
      useNavigatorLanguage: '`getBrowserLocale` from `@maz-ui/utils/helpers/getBrowserLocale`',
      usePreferredLanguages: '`getBrowserLocale` from `@maz-ui/utils/helpers/getBrowserLocale`',
      useTextareaAutosize: 'MazTextarea (it grows with its content) or `TextareaAutogrow` from `@maz-ui/utils/helpers/TextareaAutogrow`',
      useDraggable: '`useDrag` from `maz-ui/composables/useDrag`',
      useScriptTag: '`ScriptLoader` from `@maz-ui/utils/helpers/scriptLoader`',
      useCookies: '`getCookie`, `setCookie`, `deleteCookie` from `@maz-ui/utils/helpers/cookie`',
    },
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'vue-toastification',
      'vue-sonner',
      'vue3-toastify',
      'notivue',
      '@kyvg/vue3-notification',
      'vue-toast-notification',
    ],
    replacement: '`useToast()` (maz-ui toast plugin)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      '@heroicons/vue',
      'lucide-vue-next',
      '@lucide/vue',
      '@iconify/vue',
      '@phosphor-icons/vue',
      '@tabler/icons-vue',
      'vue-feather-icons',
      '@fortawesome/',
      'unplugin-icons',
      '~icons/',
      'virtual:icons/',
      '@mdi/js',
      'oh-vue-icons',
    ],
    replacement: '@maz-ui/icons (`find_icons`)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'floating-vue',
      'v-tooltip',
      'tippy.js',
      'vue-tippy',
    ],
    replacement: 'the `vTooltip` directive or MazPopover',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['@floating-ui/vue', '@floating-ui/dom', '@popperjs/core'],
    replacement: 'MazPopover (floating panel with positioning, triggers and focus management) or `vTooltip`',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'vue-chartjs',
      'vue-chart-3',
      'apexcharts',
      'vue3-apexcharts',
      'echarts',
      'vue-echarts',
    ],
    replacement: 'MazChart (chart.js based)',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      '@vuepic/vue-datepicker',
      'vue-datepicker-next',
      'v-calendar',
      'vue-flatpickr-component',
      'flatpickr',
    ],
    replacement: 'MazDatePicker',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue-tel-input', 'vue-phone-number-input', 'vue-country-code'],
    replacement: 'MazInputPhoneNumber / MazSelectCountry',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'vue-multiselect',
      'vue-select',
      '@vueform/multiselect',
      'vue3-select-component',
    ],
    replacement: 'MazSelect (search, multiple, groups, custom options)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue-final-modal', '@kouts/vue-modal', 'vue-js-modal'],
    replacement: 'MazDialog, MazDialogConfirm or MazBottomSheet',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'vue3-dropzone',
      'vue-dropzone',
      'dropzone',
      'vue-upload-component',
      'filepond',
      'vue-filepond',
    ],
    replacement: 'MazDropzone',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue3-otp-input', 'vue-otp-input'],
    replacement: 'MazInputCode',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue3-carousel', 'vue-agile', 'swiper/vue'],
    replacement: 'MazCarousel',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue-skeletor', 'vue-content-loader', 'vue-loading-skeleton'],
    replacement: 'MazSkeleton',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'vue-loading-overlay',
      'vue-spinner',
      'vue-spinners',
      'epic-spinners',
    ],
    replacement: 'MazSpinner, MazFullscreenLoader or `useWait`',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: [
      'vue-easy-lightbox',
      'vue-image-zoomer',
      'medium-zoom',
      'viewerjs',
      'v-viewer',
    ],
    replacement: 'the `vZoomImg` / `vFullscreenImg` directives or MazGallery',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['aos'],
    replacement: 'the maz-ui AOS plugin (`useAos`)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['fuse.js', '@vueuse/integrations/useFuse', 'match-sorter'],
    replacement: '`useFuzzySearch` from `maz-ui/composables/useFuzzySearch`',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['fastest-levenshtein', 'leven', 'string-similarity'],
    replacement: '`useStringMatching` from `maz-ui/composables/useStringMatching`',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['reading-time'],
    replacement: '`useReadingTime` from `maz-ui/composables/useReadingTime`',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['date-fns', 'date-fns/'],
    names: {
      formatDistance: '`useRelativeTime` from `maz-ui/composables/useRelativeTime` (refreshes itself) or `formatRelativeTime` from `@maz-ui/utils/helpers/formatRelativeTime`',
      formatDistanceToNow: '`useRelativeTime` from `maz-ui/composables/useRelativeTime` (refreshes itself) or `formatRelativeTime` from `@maz-ui/utils/helpers/formatRelativeTime`',
      formatRelative: '`formatRelativeTime` from `@maz-ui/utils/helpers/formatRelativeTime`',
    },
    severity: 'info',
    rule: 'prefer-utils',
  },
  {
    packages: ['timeago.js', 'vue-timeago3', 'dayjs/plugin/relativeTime'],
    replacement: '`useRelativeTime` from `maz-ui/composables/useRelativeTime` (refreshes itself)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['clipboard', 'clipboard-copy', 'copy-to-clipboard', 'vue-clipboard3', 'vue3-clipboard', 'vue-clipboard2'],
    replacement: '`useClipboard` from `maz-ui/composables/useClipboard`',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['slugify', '@sindresorhus/slugify', 'remove-accents', 'diacritics', 'latinize'],
    replacement: '`normalizeString` from `@maz-ui/utils/helpers/normalizeString`',
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['change-case', 'camelcase', 'decamelize', 'lodash.camelcase', 'lodash.kebabcase', 'lodash.snakecase', 'lodash.capitalize', 'lodash.upperfirst'],
    replacement: '`camelCase`, `kebabCase`, `snakeCase`, `pascalCase`, `capitalize` or `upperFirst` from `@maz-ui/utils`',
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['fast-deep-equal', 'deep-equal', 'dequal', 'lodash.isequal'],
    replacement: UTILS_NAMES.isEqual,
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['numeral', 'accounting', 'accounting-js'],
    replacement: '`formatNumber` or `formatCurrency` from `@maz-ui/utils`',
    severity: 'warning',
    rule: 'prefer-utils',
  },
  {
    packages: ['libphonenumber-js'],
    replacement: '`formatPhoneNumber` from `@maz-ui/utils/helpers/formatPhoneNumber`, MazInputPhoneNumber for an input',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue-countdown', '@chenfengyuan/vue-countdown', 'vue3-countdown'],
    replacement: '`useTimer` from `maz-ui/composables/useTimer`',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue-lazyload', 'vue3-lazyload', 'vue3-lazy', 'lozad', 'vanilla-lazyload'],
    replacement: 'the `vLazyImg` directive or MazLazyImg',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['v-click-outside', 'click-outside-vue3', 'vue-click-outside', 'vue3-click-away'],
    replacement: 'the `vClickOutside` directive (`maz-ui/directives/vClickOutside`)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['hammerjs', 'vue3-touch-events', 'vue-touch-events', '@vueuse/gesture'],
    replacement: '`useSwipe` or `useDrag` from `maz-ui/composables`',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['pulltorefreshjs', 'vue-pull-to-refresh', 'vue3-pull-to-refresh'],
    replacement: 'MazPullToRefresh or `usePullToRefresh` (`maz-ui/composables/usePullToRefresh`)',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['autosize', 'vue-textarea-autosize', 'v-autosize'],
    replacement: 'MazTextarea (it grows with its content) or `TextareaAutogrow` from `@maz-ui/utils/helpers/TextareaAutogrow`',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['vue-currency-input', 'vue-number-format', 'v-money3'],
    replacement: 'MazInputPrice or MazInputNumber',
    severity: 'warning',
    rule: 'prefer-ecosystem',
  },
  {
    packages: ['load-script', 'vue-load-script', 'scriptjs', '@unhead/vue/scripts'],
    replacement: '`ScriptLoader` from `@maz-ui/utils/helpers/scriptLoader`',
    severity: 'info',
    rule: 'prefer-utils',
  },
  {
    packages: ['vee-validate', '@vuelidate/core', 'vuelidate'],
    replacement: '`useFormValidator` / `useFormField` with your Standard Schema library (Zod, Valibot, ArkType)',
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
]

interface ParsedImport {
  specifier: string
  names: string[]
  /** Local names of the bindings (`import { MazBtn as Action }` -> `Action`) */
  locals: string[]
  typeOnly: boolean
  offset: number
}

const IMPORT_REGEX = /import\s+(type\s+)?(?:([\w$]+)\s*(?:,\s*)?)?(?:\{([^}]*)\}|\*\s+as\s+[\w$]+)?\s*from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g

export function parseImports(code: string): ParsedImport[] {
  return [
    ...code.matchAll(IMPORT_REGEX),
  ].map((match) => {
    const [, typeKeyword, defaultName, named, specifier, sideEffect] = match
    const bindings = (named ?? '')
      .split(',')
      .map(entry => entry.trim())
      .filter(entry => entry && !entry.startsWith('type '))
      .map(entry => entry.split(/\s+as\s+/).map(name => name.trim()))
    const names = bindings.map(([name]) => name)
    const locals = bindings.map(binding => binding.at(-1) as string)

    return {
      specifier: specifier ?? sideEffect,
      names: defaultName
        ? [defaultName, ...names]
        : names,
      locals: defaultName
        ? [defaultName, ...locals]
        : locals,
      typeOnly: !!typeKeyword,
      offset: match.index ?? 0,
    }
  })
}

function matchesPackage(specifier: string, packages: string[]): boolean {
  return packages.some(name => (name.endsWith('/')
    ? specifier.startsWith(name)
    : specifier === name || specifier.startsWith(`${name}/`)))
}

/** Reports imports of internal files or runtime imports of the types-only root entry, returns `true` when reported */
function checkEntryPoint(entry: ParsedImport, offset: number, context: ReviewContext): boolean {
  if (/^(?:maz-ui|@maz-ui\/[\w-]+)\/(?:src|dist)(?:\/|$)/.test(entry.specifier)) {
    context.report({
      rule: 'internal-import',
      severity: 'error',
      message: `\`${entry.specifier}\` imports internal files of the package.`,
      suggestion: 'Use the public entries: `maz-ui/components/MazBtn`, `maz-ui/composables/useToast`, `@maz-ui/utils/helpers/debounce`...',
    }, offset)
    return true
  }

  if (entry.specifier === 'maz-ui' && !entry.typeOnly && entry.names.length > 0) {
    context.report({
      rule: 'root-import',
      severity: 'error',
      message: '`maz-ui` (root entry) only exports types: runtime imports from it are undefined.',
      suggestion: 'Import from the entries: `maz-ui/components/MazBtn`, `maz-ui/composables/useToast`, `maz-ui/directives/vTooltip`, `maz-ui/plugins/maz-ui`. Use `import type` for types.',
    }, offset)
    return true
  }

  return false
}

function checkComponentImport(entry: ParsedImport, offset: number, context: ReviewContext): void {
  const name = /^maz-ui\/components\/(Maz\w+)$/.exec(entry.specifier)?.[1]

  if (!name || context.knowledge.componentsByName.has(name))
    return

  const near = closest(name, context.knowledge.componentsByName.keys(), { max: 3, limit: 2 })

  context.report({
    rule: 'unknown-component',
    severity: 'error',
    message: `\`${name}\` is not a maz-ui component.`,
    suggestion: near.length > 0
      ? `Did you mean ${near.map(candidate => `\`${candidate}\``).join(' or ')}?`
      : 'Find the right one with `search_docs`.',
  }, offset)
}

function checkIconImport(entry: ParsedImport, offset: number, context: ReviewContext): void {
  if (entry.specifier !== '@maz-ui/icons' && !entry.specifier.startsWith('@maz-ui/icons/'))
    return

  const fromPath = /^@maz-ui\/icons\/(?:static|lazy|raw)\/(\w+)$/.exec(entry.specifier)?.[1]
  const icons = [
    ...entry.names,
    ...(fromPath
      ? [fromPath]
      : []),
  ]
    .map(name => name.replace(/^Lazy(?=Maz)/, ''))
    .filter(name => name.startsWith('Maz') && !context.knowledge.iconNames.has(name))

  for (const icon of new Set(icons)) {
    const near = closest(icon, context.knowledge.iconNames, { max: 3, limit: 3 })

    context.report({
      rule: 'unknown-icon',
      severity: 'error',
      message: `\`${icon}\` does not exist in @maz-ui/icons.`,
      suggestion: near.length > 0
        ? `Did you mean ${near.map(name => `\`${name}\``).join(' or ')}? Search with \`find_icons\`.`
        : 'Search with `find_icons({ query: "..." })`.',
    }, offset)
  }
}

function isNuxtAutoImported(entry: ParsedImport): boolean {
  if (/^maz-ui\/(?:components(?:\/Maz\w+)?|composables(?:\/use\w+)?)$/.test(entry.specifier))
    return true

  return ['@maz-ui/themes', '@maz-ui/translations'].includes(entry.specifier)
    && entry.names.some(name => ['useTheme', 'useTranslations'].includes(name))
}

/** A component used in the script (`h(MazIcon)`, `components: { MazBtn }`): Nuxt only auto-imports the components of the templates */
function isComponentUsedInScript(entry: ParsedImport, body: string): boolean {
  return entry.specifier.startsWith('maz-ui/components')
    && entry.locals.some(name => new RegExp(`(?<![\\w$.])${name.replaceAll('$', '\\$')}(?![\\w$])`).test(body))
}

function checkEcosystemImport(entry: ParsedImport, offset: number, body: string, context: ReviewContext): void {
  if (checkEntryPoint(entry, offset, context))
    return

  checkComponentImport(entry, offset, context)
  checkIconImport(entry, offset, context)

  if (context.framework === 'nuxt' && !entry.typeOnly && isNuxtAutoImported(entry) && !isComponentUsedInScript(entry, body)) {
    context.report({
      rule: 'nuxt-auto-import',
      severity: 'info',
      message: `\`${entry.specifier}\` is auto-imported by @maz-ui/nuxt.`,
      suggestion: 'Remove the import (keep `import type` imports).',
    }, offset)
  }
}

function checkThirdPartyImport(entry: ParsedImport, offset: number, context: ReviewContext): void {
  if (entry.typeOnly)
    return

  for (const rule of THIRD_PARTY_RULES) {
    if (!matchesPackage(entry.specifier, rule.packages))
      continue

    if (rule.names) {
      const lodashPath = /^lodash(?:-es)?\/(\w+)$/.exec(entry.specifier)?.[1]
      const flagged = [
        ...entry.names,
        ...(lodashPath
          ? [lodashPath]
          : []),
      ].filter(name => rule.names?.[name])

      for (const name of flagged) {
        context.report({
          rule: rule.rule,
          severity: rule.severity,
          message: `\`${name}\` from \`${entry.specifier}\` duplicates the maz-ui ecosystem.`,
          suggestion: `Use ${rule.names[name]}.`,
        }, offset)
      }
      continue
    }

    context.report({
      rule: rule.rule,
      severity: rule.severity,
      message: `\`${entry.specifier}\` duplicates a feature of the maz-ui ecosystem.`,
      suggestion: `Use ${rule.replacement} instead of adding a dependency.`,
    }, offset)
    return
  }
}

const DARK_MODE_PATTERNS: Array<{ regex: RegExp, message: string }> = [
  { regex: /classList\.(?:add|remove|toggle)\(\s*['"`]dark['"`]/g, message: 'Toggles the `dark` class by hand.' },
  { regex: /localStorage\.(?:get|set)Item\(\s*['"`](?:theme|color-?mode|dark(?:-?mode)?)['"`]/gi, message: 'Stores the color mode by hand.' },
  { regex: /matchMedia\(\s*['"`]\(prefers-color-scheme/g, message: 'Reads `prefers-color-scheme` by hand.' },
]

interface HandwrittenPattern {
  regex: RegExp
  rule: 'native-dialog' | 'prefer-utils' | 'prefer-ecosystem'
  /** `warning` when the tool covers the case, `info` when the hand-written code can be intended */
  severity: 'warning' | 'info'
  message: string
  suggestion: string
  /** Only in `.ts` / `.js` files: the top level of a module is shared by all its importers */
  modulesOnly?: boolean
  /** Only reported when the code also matches it */
  requires?: RegExp
}

/** The plugins that `useToast`, `useDialog` and `useWait` no longer need, removed in v6, with the option of `MazUi` that takes their options */
const DEPRECATED_PLUGINS: Record<string, { composable: string, option?: string }> = {
  ToastPlugin: { composable: 'useToast', option: 'toast' },
  DialogPlugin: { composable: 'useDialog', option: 'dialog' },
  WaitPlugin: { composable: 'useWait' },
}

const NUXT_CONFIG = /(?:^|[\\/])nuxt\.config\.[cm]?[jt]s$/

/** The deprecated plugins of the composables, their `$maz*` properties and the `mazUi.plugins` option of the Nuxt module, when the installed maz-ui no longer needs them */
function checkDeprecatedApis(code: string, offset: number, context: ReviewContext): void {
  if (!hasStandaloneComposables(context.knowledge.docsById))
    return

  for (const match of code.matchAll(/\.use\(\s*(ToastPlugin|DialogPlugin|WaitPlugin)\b/g)) {
    const plugin = match[1]!
    const { composable, option } = DEPRECATED_PLUGINS[plugin]!

    context.report({
      rule: 'deprecated-api',
      severity: 'warning',
      message: `\`${plugin}\` is deprecated and removed in v6: \`${composable}()\` works without it.`,
      suggestion: option
        ? `Remove \`app.use(${plugin})\` and give its options to the MazUi plugin: \`app.use(MazUi, { theme, ${option}: { ... } })\`.`
        : `Remove \`app.use(${plugin})\`.`,
    }, offset + match.index)
  }

  for (const match of code.matchAll(/\$maz(Toast|Dialog|Wait)\b/g)) {
    context.report({
      rule: 'deprecated-api',
      severity: 'warning',
      message: `\`$maz${match[1]}\` is deprecated and removed in v6.`,
      suggestion: `Use \`use${match[1]}()\` from \`maz-ui/composables/use${match[1]}\` (auto-imported with Nuxt).`,
    }, offset + match.index)
  }

  if (!NUXT_CONFIG.test(String(context.filename)))
    return

  for (const match of code.matchAll(/\bplugins\s*:\s*\{[^}]*\b(?:toast|dialog|wait|aos)\s*:/g)) {
    context.report({
      rule: 'deprecated-api',
      severity: 'warning',
      message: '`mazUi.plugins` is deprecated and removed in v6: `useToast`, `useDialog` and `useWait` are always auto-imported.',
      suggestion: 'Remove `plugins` and give the options to `mazUi.toast`, `mazUi.dialog` and `mazUi.aos`.',
    }, offset + match.index)
  }
}

const WAIT_SUGGESTION = 'Use `useWait()` from `maz-ui/composables/useWait`: `wait.start("USER")`, `wait.stop("USER")` and `wait.isLoading("USER")` in any component (`get_doc` gives its setup).'

/** Code written by hand that maz-ui already provides; `(?<![\w$.])` skips the methods of other objects (`toast.confirm()`) */
const HANDWRITTEN_PATTERNS: HandwrittenPattern[] = [
  {
    regex: /(?<![\w$.])(?:window\.)?alert\(/g,
    rule: 'native-dialog',
    severity: 'warning',
    message: '`alert()` blocks the page with a dialog of the browser.',
    suggestion: 'Use `useToast()` from `maz-ui/composables/useToast`: `toast.success("Saved")`, `toast.error(...)`.',
  },
  {
    regex: /(?<![\w$.])(?:window\.)?(?:confirm|prompt)\(/g,
    rule: 'native-dialog',
    severity: 'warning',
    message: '`confirm()` / `prompt()` block the page with a dialog of the browser.',
    suggestion: 'Use `useDialog()` from `maz-ui/composables/useDialog`: `dialog.open({ title, message, buttons })`, or a `MazDialogConfirm`.',
  },
  {
    regex: /^(?:export\s+)?(?:const|let)\s+\w*(?:loading|pending|saving|busy|submitting|fetching|processing)\w*\s*=\s*(?:ref|shallowRef)(?:<\s*boolean\s*>)?\(\s*(?:false)?\s*\)/gim,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'A loading state at the top level of a module, shared by hand between components.',
    suggestion: WAIT_SUGGESTION,
    modulesOnly: true,
  },
  {
    regex: /^(?:export\s+)?(?:const|let)\s+(?!\w*(?:loading|pending|saving|busy|submitting|fetching|processing))\w+\s*=\s*(?:ref|shallowRef)(?:<\s*boolean\s*>)?\(\s*false\s*\)/gim,
    requires: /\bfinally\s*\{[^}]*?\.value\s*=\s*false\b/,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'A boolean at the top level of a module, set during an async call and reset in a `finally`: a loading state shared by hand.',
    suggestion: WAIT_SUGGESTION,
    modulesOnly: true,
  },
  {
    regex: /\bnew\s+Intl\.NumberFormat\([^;]*?\bcurrency\b|\.toLocaleString\([^;]*?\bcurrency\b/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Formats a currency by hand.',
    suggestion: 'Use `formatCurrency(value, locale, { currency: "EUR" })` from `@maz-ui/utils/helpers/formatCurrency`.',
  },
  {
    regex: /\bnew\s+Intl\.DateTimeFormat\(|\.toLocaleDateString\(/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Formats a date by hand.',
    suggestion: 'Use `formatDate(date, locale, options)` from `@maz-ui/utils/helpers/formatDate`.',
  },
  {
    regex: /\bnew\s+Intl\.RelativeTimeFormat\(/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Formats a relative time by hand.',
    suggestion: 'Use `useRelativeTime()` from `maz-ui/composables/useRelativeTime` (updates itself), or `formatRelativeTime(date)` from `@maz-ui/utils/helpers/formatRelativeTime`.',
  },
  {
    regex: /\bnew\s+Promise\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*setTimeout\(\s*\1\b/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Waits with a hand-made promise.',
    suggestion: 'Use `await sleep(ms)` from `@maz-ui/utils/helpers/sleep`.',
  },
  {
    regex: /\bclearTimeout\([^)]*\)\s*;?\s*(?:[\w$.]+\s*=\s*)?setTimeout\(/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Debounces by hand with `clearTimeout` and `setTimeout`.',
    suggestion: 'Use `debounce(fn, ms)` from `@maz-ui/utils/helpers/debounce`: each call restarts the delay, also to reset a state after a delay (`const resetCopied = debounce(() => { copied.value = false }, 2000)`).',
  },
  {
    regex: /(?<!\bclearTimeout\([^)]*\)\s*;?\s*(?:[\w$.]+\s*=\s*)?)\bsetTimeout\(\s*\(\)\s*=>\s*\{?\s*[\w$.]+\.value\s*=\s*(?:false|null|undefined|0|''|"")\s*;?\s*\}?\s*,/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Resets a state after a delay with `setTimeout`: a second call before the end resets it too early.',
    suggestion: 'Use `debounce(() => { state.value = false }, ms)` from `@maz-ui/utils/helpers/debounce`: each call restarts the delay.',
  },
  {
    regex: /\bJSON\.stringify\([^()]*\)\s*[!=]==?\s*JSON\.stringify\(/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Compares two values through `JSON.stringify`: the order of the keys, dates and `undefined` make it wrong.',
    suggestion: 'Use `isEqual(a, b)` from `@maz-ui/utils/helpers/isEqual` (deep comparison of objects, arrays and dates).',
  },
  {
    regex: /\bdocument\.cookie\b/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Reads or writes `document.cookie` by hand.',
    suggestion: 'Use `getCookie`, `setCookie` and `deleteCookie` from `@maz-ui/utils/helpers/cookie` (SSR aware).',
  },
  {
    regex: /\.normalize\(\s*['"`]NFD['"`]\s*\)\s*\.replace\(/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Removes the accents of a string by hand.',
    suggestion: 'Use `normalizeString(value)` from `@maz-ui/utils/helpers/normalizeString` (accents, spaces, special characters, case).',
  },
  {
    regex: /\bnavigator\.clipboard\.writeText\(/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Copies to the clipboard by hand.',
    suggestion: 'For a button that copies an ID, a command or a token, use `<MazBtnClipboard value="..." />` (copied state, `variant`, `color`, `size`). Else `useClipboard()` from `maz-ui/composables/useClipboard`: `const { copy, copied } = useClipboard()`, `copied` goes back to `false` after a delay.',
  },
  {
    regex: /\bnew\s+Intl\.NumberFormat\((?![^;]*?\bcurrency\b)/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Formats a number by hand.',
    suggestion: 'Use `formatNumber(value, locale, options)` from `@maz-ui/utils/helpers/formatNumber`.',
  },
  {
    regex: /\.toLowerCase\(\)\s*\.includes\(/g,
    rule: 'prefer-ecosystem',
    severity: 'info',
    message: 'Filters by a query with `toLowerCase().includes()`: accents, typos and the order of the words are missed.',
    suggestion: 'Use `useFuzzySearch(items, query, { keys })` from `maz-ui/composables/useFuzzySearch`, or the `search` prop of MazSelect.',
  },
  {
    regex: /\btypeof\s+(?:window|document)\s*[!=]==?\s*['"`]undefined['"`]/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Detects the browser by hand.',
    suggestion: 'Use `isClient()` from `@maz-ui/utils/helpers/isClient` or `isServer()` from `@maz-ui/utils/helpers/isServer`.',
  },
  {
    regex: /\bnavigator\.languages?\b/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Reads the language of the browser by hand.',
    suggestion: 'Use `getBrowserLocale()` from `@maz-ui/utils/helpers/getBrowserLocale` (SSR safe).',
  },
  {
    regex: /\bsetInterval\(/g,
    requires: /\b(?:remaining|countdown|timeLeft|secondsLeft)\w*/i,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Builds a countdown with `setInterval`.',
    suggestion: 'Use `useTimer({ timeout, callback })` from `maz-ui/composables/useTimer`: `start`, `pause`, `resume`, `remainingTime`, stopped on unmount.',
  },
  {
    regex: /addEventListener\(\s*['"`]mousemove['"`]/g,
    requires: /^(?=[\s\S]*addEventListener\(\s*['"`]key(?:down|press)['"`])(?=[\s\S]*setTimeout\()/,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Detects the inactivity of the user by hand.',
    suggestion: 'Use `useIdleTimeout({ callback, options: { timeout } })` from `maz-ui/composables/useIdleTimeout`.',
  },
  {
    regex: /\bnew\s+IntersectionObserver\(/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Creates an `IntersectionObserver` by hand.',
    suggestion: 'Use `useIntersectionObserver(target, callback)` from `maz-ui/composables/useIntersectionObserver` (`isIntersecting`, `once`, stops on unmount) or the `v-intersect` directive (`maz-ui/directives/vIntersect`). To load the next page of a list: `useInfiniteScroll`. For images: `vLazyImg` or MazLazyImg; for animations on scroll: MazAnimatedElement or `useAos`.',
  },
  {
    regex: /\baddEventListener\(\s*['"`]scroll['"`]/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Listens to the scroll by hand.',
    suggestion: 'Use `useScroll(target?)` from `maz-ui/composables/useScroll`: `y`, `directions`, `arrivedState.bottom`, `scrollToTop()`, throttled to one update per frame and removed on unmount. To load the next page at the end of a list: `useInfiniteScroll`; a "back to top" or "scroll to bottom" button: MazBtnScroll (`to="bottom"`).',
  },
  {
    regex: /\bdocument\.(?:body|documentElement)\.style\.overflowY?\s*=(?!=)/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Locks the scroll of the page by hand.',
    suggestion: 'Use `useScrollLock()` from `maz-ui/composables/useScrollLock`: `lock()`, `unlock()` or `isLocked`, keeps the width of the scrollbar, handles several locks at once and unlocks on unmount.',
  },
  {
    regex: /\bscrollTo\(\s*\{\s*top:\s*0\b|\bscrollTo\(\s*0\s*,\s*0\s*\)/g,
    requires: /\b(?:scrollY|pageYOffset|scrollTop)\s*>=?\s*\w/,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'A "back to top" button made by hand.',
    suggestion: 'Use `<MazBtnScroll />`: it appears after `threshold` pixels (400 by default) and scrolls back smoothly; `position`, `color`, `icon` and `progress` props.',
  },
  {
    regex: /\.charAt\(0\)\.toUpperCase\(\)\s*\+|\[0\]\??\.toUpperCase\(\)\s*\+/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Capitalizes a string by hand.',
    suggestion: 'Use `upperFirst(value)` from `@maz-ui/utils/helpers/upperFirst`, or `capitalize(value)` from `@maz-ui/utils/helpers/capitalize` (also accepts a non-string).',
  },
  {
    regex: /\.replace\(\s*\/\(\[a-z[^\]/]*\]\)\(\[A-Z[^\]/]*\]\)\/g/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Converts the case of a string with a regex.',
    suggestion: 'Use `kebabCase`, `snakeCase`, `camelCase` or `pascalCase` from `@maz-ui/utils/helpers/<name>`.',
  },
  {
    regex: /\.replace\(\s*\/[^/\n]*[-_][^/\n]*\/g[^,]*,\s*(?:\([^)]*\)|[\w$]+)\s*=>[^)\n]*\.toUpperCase\(\)/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Converts a string to camelCase with a regex.',
    suggestion: 'Use `camelCase` or `pascalCase` from `@maz-ui/utils/helpers/<name>`.',
  },
  {
    regex: /\binstanceof\s+Error\s*\?\s*[\w$.]+\.message\s*:/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Reads the message of a caught error by hand.',
    suggestion: 'Use `getErrorMessage(error)` from `@maz-ui/utils/helpers/getErrorMessage` (errors, strings, objects with a `message`).',
  },
  {
    regex: /\/[^/\n]*\b(?:iPhone|iPad|iPod)\b[^/\n]*\/[a-z]*\.test\(\s*(?:window\.)?navigator\.(?:userAgent|platform)|navigator\.(?:userAgent|platform)[^;\n]*(?:iPhone|iPad|iPod)/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Detects iOS by hand.',
    suggestion: 'Use `isIos()` from `@maz-ui/utils/helpers/isIos`.',
  },
  {
    regex: /display-mode:\s*standalone|navigator\.standalone\b/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Detects an app installed as a PWA by hand.',
    suggestion: 'Use `isStandaloneMode()` from `@maz-ui/utils/helpers/isStandaloneMode`.',
  },
  {
    regex: /\b(?:127397|0x1F1E6|127462)\b/gi,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Builds a flag emoji from a country code by hand.',
    suggestion: 'Use `countryCodeToUnicodeFlag(code)` from `@maz-ui/utils/helpers/countryCodeToUnicodeFlag`.',
  },
  {
    regex: /\bflagcdn\.com\b/g,
    rule: 'prefer-utils',
    severity: 'warning',
    message: 'Builds the URL of a flag image by hand.',
    suggestion: 'Use `getCountryFlagUrl(code, size)` from `@maz-ui/utils/helpers/getCountryFlagUrl`.',
  },
  {
    regex: /\b(?:ipwho\.is|ipapi\.co|ipinfo\.io|ip-api\.com|freeipapi\.com)\b/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Fetches the country of the visitor by hand.',
    suggestion: 'Use `fetchLocaleIp()` from `@maz-ui/utils/helpers/fetchLocaleIp` when the country code is enough.',
  },
  {
    regex: /\bJSON\.stringify\([^()]*,\s*null\s*,\s*\d+\s*\)/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Pretty prints JSON by hand.',
    suggestion: 'Use `formatJson(value)` from `@maz-ui/utils/helpers/formatJson`.',
  },
  {
    regex: /\.filter\(\s*Boolean\s*\)/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: '`.filter(Boolean)` does not narrow the type: `null` and `undefined` stay in it.',
    suggestion: 'Use `.filter(truthyFilter)` with `truthyFilter` from `@maz-ui/utils/helpers/truthyFilter`.',
  },
  {
    regex: /\bDate\.now\(\)\s*-\s*[\w$.]+\s*<=?\s*[\w$.]+\s*\)\s*\{?\s*return\b/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Throttles by hand with `Date.now()`.',
    suggestion: 'Use `throttle(fn, ms)` from `@maz-ui/utils/helpers/throttle`, or `throttleId` for one throttle per id.',
  },
  {
    regex: /\bsetInterval\(/g,
    requires: /^(?=[\s\S]*\bclearInterval\()(?=[\s\S]*\b(?:attempts?|tries|retries|maxAttempts)\b)/,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Polls a value with `setInterval` until it exists.',
    suggestion: 'Use `checkAvailability(getter, callback, { maxAttempts, interval })` from `@maz-ui/utils/helpers/checkAvailability`.',
  },
  {
    regex: /\.split\([^)]*\)\.length\s*\/\s*[12]\d\d\b/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Computes a reading time by hand.',
    suggestion: 'Use `useReadingTime({ content })` from `maz-ui/composables/useReadingTime`.',
  },
  {
    regex: /\bMath\.random\(\)\.toString\(\s*36\s*\)/g,
    rule: 'prefer-ecosystem',
    severity: 'info',
    message: 'Builds an id with `Math.random()`: it differs between the server and the client.',
    suggestion: 'For an element id, use `useId()` from `vue`, or `useInstanceUniqId` from `maz-ui/composables/useInstanceUniqId` (keeps an `id` prop).',
  },
  {
    regex: /\brender\(\s*h\(|\bcreateApp\(/g,
    requires: /document\.body\.append(?:Child)?\(/,
    rule: 'prefer-ecosystem',
    severity: 'info',
    message: 'Mounts a component from the code by hand.',
    suggestion: 'Use `useMountComponent(component, { props })` from `maz-ui/composables/useMountComponent` (keeps the app context: plugins, directives).',
  },
  {
    regex: /\.requestFullscreen\(/g,
    requires: /\b(?:img|image|photo|picture)\w*\b/i,
    rule: 'prefer-ecosystem',
    severity: 'info',
    message: 'Shows an image in fullscreen by hand.',
    suggestion: 'Use the `vFullscreenImg` or `vZoomImg` directive (`maz-ui/directives/<name>`), or MazGallery.',
  },
  {
    regex: /maximum-scale\s*=\s*1\b|user-scalable\s*=\s*no\b/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Blocks the zoom of the whole page to stop the zoom of iOS on the fields.',
    suggestion: 'Use `preventIosInputZoom()` from `@maz-ui/utils/helpers/preventIosInputZoom`: only on iOS, the zoom stays possible.',
  },
  {
    regex: /\bdocument\.createElement\(\s*['"`]script['"`]\s*\)/g,
    rule: 'prefer-utils',
    severity: 'info',
    message: 'Injects a `<script>` by hand.',
    suggestion: 'Use `new ScriptLoader({ src, identifier }).load()` from `@maz-ui/utils/helpers/scriptLoader` (loaded once, awaitable).',
  },
  {
    regex: /\.style\.height\s*=\s*[^;\n]*\bscrollHeight\b/g,
    rule: 'prefer-ecosystem',
    severity: 'info',
    message: 'Resizes a textarea to its content by hand.',
    suggestion: 'Use `MazTextarea` (it grows with its content), or `TextareaAutogrow` from `@maz-ui/utils/helpers/TextareaAutogrow`.',
  },
  {
    regex: /!\s*[\w$.?]+\.contains\(\s*(?:e|ev|evt|event)\.target\b/g,
    requires: /addEventListener\(\s*['"`](?:click|mousedown|pointerdown|touchstart)['"`]/,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Detects a click outside of an element by hand.',
    suggestion: 'Use the `vClickOutside` directive from `maz-ui/directives/vClickOutside`: `<div v-click-outside="close">`.',
  },
  {
    regex: /addEventListener\(\s*['"`]resize['"`]|matchMedia\(\s*['"`]\((?:min|max)-width/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Tracks the viewport size by hand.',
    suggestion: 'Use `useBreakpoints()` from `maz-ui/composables/useBreakpoints` (`isMobile`...), or `useWindowSize()` from `maz-ui/composables/useWindowSize`; in templates, the `mob-*`, `tab-*`, `lap-*` breakpoints.',
  },
  {
    regex: /addEventListener\(\s*['"`]visibilitychange['"`]/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Tracks the visibility of the page by hand.',
    suggestion: 'Use `useUserVisibility()` from `maz-ui/composables/useUserVisibility`.',
  },
  {
    regex: /\bnew\s+MutationObserver\(/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Creates a `MutationObserver` by hand.',
    suggestion: 'Use `useMutationObserver()` from `maz-ui/composables/useMutationObserver` (follows a template ref, disconnected on unmount).',
  },
  {
    regex: /\bnew\s+ResizeObserver\(/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Creates a `ResizeObserver` by hand.',
    suggestion: 'Use `useResizeObserver(target, callback?)` from `maz-ui/composables/useResizeObserver`: `width`, `height`, follows a template ref, disconnected on unmount. For the size of the window: `useWindowSize` or `useBreakpoints`.',
  },
  {
    regex: /addEventListener\(\s*['"`](?:drop|dragover|dragenter)['"`]/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Handles the drop of files by hand.',
    suggestion: 'Use MazDropzone, or `useDropzone(target, { onDrop })` from `maz-ui/composables/useDropzone`.',
  },
  {
    regex: /addEventListener\(\s*['"`](?:touchstart|pointerdown)['"`]/g,
    rule: 'prefer-ecosystem',
    severity: 'info',
    message: 'Tracks a touch or pointer gesture by hand.',
    suggestion: 'Use `useSwipe()` from `maz-ui/composables/useSwipe` for swipes, `useDrag()` from `maz-ui/composables/useDrag` for a live drag, MazPullToRefresh (or `usePullToRefresh`) to pull to refresh.',
  },
  {
    regex: /\bnew\s+Intl\.DisplayNames\(/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Builds country or language names by hand.',
    suggestion: 'Use `useDisplayNames()` from `maz-ui/composables/useDisplayNames`.',
  },
  {
    regex: /\binject\([^)]*\)\s*;?\s*if\s*\(\s*!\s*[\w$]+\s*\)\s*\{?\s*throw\b/g,
    rule: 'prefer-ecosystem',
    severity: 'warning',
    message: 'Throws by hand when an injection is missing.',
    suggestion: 'Use `useInjectStrict(key)` from `maz-ui/composables/useInjectStrict`.',
  },
]

/** `confirm` defined or imported by the file (`function confirm()`, `const { confirm } = ...`) is not the one of the browser */
function definesName(code: string, name: string): boolean {
  return new RegExp(`(?:\\b(?:function|const|let|var|import)\\s+|[{,]\\s*)${name}\\b`).test(code)
}

/** `body` is the code without its imports, `code` keeps them for the names they define */
function checkHandwrittenCode(code: string, body: string, offset: number, context: ReviewContext): void {
  const isModule = !/\.(?:vue|html)$/i.test(context.filename ?? '')

  for (const pattern of HANDWRITTEN_PATTERNS) {
    if ((pattern.modulesOnly && !isModule) || (pattern.requires && !pattern.requires.test(body)))
      continue

    for (const match of body.matchAll(pattern.regex)) {
      const name = /(alert|confirm|prompt)\($/.exec(match[0])?.[1]

      if (name && !match[0].startsWith('window.') && definesName(code, name))
        continue

      context.report({
        rule: pattern.rule,
        severity: pattern.severity,
        message: pattern.message,
        suggestion: pattern.suggestion,
      }, offset + (match.index ?? 0))
    }
  }
}

export function reviewScript(code: string, offset: number, context: ReviewContext): void {
  const body = code.replaceAll(/^\s*import\s[^\n]*$/gm, line => ' '.repeat(line.length))

  for (const entry of parseImports(code)) {
    const position = offset + entry.offset

    if (/^(?:maz-ui|@maz-ui\/)/.test(entry.specifier))
      checkEcosystemImport(entry, position, body, context)
    else
      checkThirdPartyImport(entry, position, context)
  }

  for (const { regex, message } of DARK_MODE_PATTERNS) {
    for (const match of code.matchAll(regex)) {
      context.report({
        rule: 'manual-dark-mode',
        severity: 'warning',
        message,
        suggestion: '`useTheme()` from `@maz-ui/themes` handles it: `toggleDarkMode()`, `setColorMode("dark" | "light" | "auto")`, `isDark`. The color mode is persisted and applied without flash.',
      }, offset + (match.index ?? 0))
    }
  }

  checkPresetColors(code, offset, context)
  checkDeprecatedApis(body, offset, context)
  checkHandwrittenCode(code, body, offset, context)
  checkClassStrings(body, offset, context)
}

/** Real name of an imported binding when it comes from maz-ui (`maz-ui/components/MazBtn`, `@maz-ui/icons/static/MazTrash`) */
function mazUiName(imported: string | undefined, source: string): string | undefined {
  if (!/^(?:maz-ui|@maz-ui\/icons)(?:\/|$)/.test(source))
    return undefined

  return imported ?? source.split('/').at(-1)
}

/** PascalCase bindings imported by the scripts of an SFC, with the maz-ui name they stand for */
export function localComponents(scripts: string): Map<string, string | undefined> {
  const components = new Map<string, string | undefined>()

  for (const [, clause, source] of scripts.matchAll(/import\s+(?!type\s)([^'";]*?)\s+from\s+["']([^"']+)["']/g)) {
    const named = /\{([^}]*)\}/.exec(clause)?.[1] ?? ''
    const defaultName = /^\s*([A-Z]\w*)/.exec(clause.replace(/\{[^}]*\}/, ''))?.[1]

    if (defaultName)
      components.set(defaultName, mazUiName(undefined, source))

    for (const specifier of named.split(',')) {
      const [imported, local = imported] = specifier.replace(/^\s*type\s+/, '').split(/\s+as\s+/).map(part => part.trim())

      if (/^[A-Z]/.test(local ?? ''))
        components.set(local, mazUiName(imported, source))
    }
  }

  return components
}

/** Local names of the icons imported as SVG strings (`@maz-ui/icons/raw/MazTrash`): they are for `icon` props, not for tags */
export function rawIcons(scripts: string): Set<string> {
  const names = new Set<string>()

  for (const [, clause, source] of scripts.matchAll(/import\s+(?!type\s)([^'";]*?)\s+from\s+["']([^"']+)["']/g)) {
    if (!/^@maz-ui\/icons\/raw(?:\/|$)/.test(source))
      continue

    const defaultName = /^\s*([A-Z]\w*)/.exec(clause.replace(/\{[^}]*\}/, ''))?.[1]

    if (defaultName)
      names.add(defaultName)

    for (const specifier of /\{([^}]*)\}/.exec(clause)?.[1].split(',') ?? []) {
      const [imported, local = imported] = specifier.replace(/^\s*type\s+/, '').split(/\s+as\s+/).map(part => part.trim())

      if (/^[A-Z]/.test(local ?? ''))
        names.add(local)
    }
  }

  return names
}
