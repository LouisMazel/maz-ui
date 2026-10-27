import type { ReviewContext, Severity } from './types'

import { closest } from '../knowledge/resolve'
import { checkClassStrings } from './classes'

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
}

const THIRD_PARTY_RULES: ThirdPartyRule[] = [
  { packages: ['lodash', 'lodash-es', 'lodash/', 'lodash-es/', 'underscore', 'radash', 'es-toolkit'], names: UTILS_NAMES, severity: 'warning', rule: 'prefer-utils' },
  { packages: ['lodash.debounce', 'just-debounce-it', 'debounce', 'p-debounce'], replacement: UTILS_NAMES.debounce, severity: 'warning', rule: 'prefer-utils' },
  { packages: ['lodash.throttle', 'just-throttle', 'throttle-debounce'], replacement: '`debounce` / `throttle` from `@maz-ui/utils`', severity: 'warning', rule: 'prefer-utils' },
  { packages: ['js-cookie', 'universal-cookie', 'vue-cookies'], replacement: '`getCookie`, `setCookie`, `deleteCookie` from `@maz-ui/utils/helpers/cookie`', severity: 'warning', rule: 'prefer-utils' },
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
      useDark: '`useTheme` from `@maz-ui/themes` (`isDark`, `toggleDarkMode`)',
      useColorMode: '`useTheme` from `@maz-ui/themes` (`colorMode`, `setColorMode`)',
      usePreferredDark: '`useTheme` from `@maz-ui/themes`',
      useDebounceFn: '`debounce` from `@maz-ui/utils/helpers/debounce`',
      useThrottleFn: '`throttle` from `@maz-ui/utils/helpers/throttle`',
    },
    severity: 'info',
    rule: 'prefer-ecosystem',
  },
  { packages: ['vue-toastification', 'vue-sonner', 'vue3-toastify', 'notivue', '@kyvg/vue3-notification', 'vue-toast-notification'], replacement: '`useToast()` (maz-ui toast plugin)', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['@heroicons/vue', 'lucide-vue-next', '@lucide/vue', '@iconify/vue', '@phosphor-icons/vue', '@tabler/icons-vue', 'vue-feather-icons', '@fortawesome/', 'unplugin-icons', '~icons/', 'virtual:icons/', '@mdi/js', 'oh-vue-icons'], replacement: '@maz-ui/icons (`find_icons`)', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['floating-vue', 'v-tooltip', 'tippy.js', 'vue-tippy'], replacement: 'the `vTooltip` directive or MazPopover', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['@floating-ui/vue', '@floating-ui/dom', '@popperjs/core'], replacement: 'MazPopover (floating panel with positioning, triggers and focus management) or `vTooltip`', severity: 'info', rule: 'prefer-ecosystem' },
  { packages: ['vue-chartjs', 'vue-chart-3', 'apexcharts', 'vue3-apexcharts', 'echarts', 'vue-echarts'], replacement: 'MazChart (chart.js based)', severity: 'info', rule: 'prefer-ecosystem' },
  { packages: ['@vuepic/vue-datepicker', 'vue-datepicker-next', 'v-calendar', 'vue-flatpickr-component', 'flatpickr'], replacement: 'MazDatePicker', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue-tel-input', 'vue-phone-number-input', 'vue-country-code'], replacement: 'MazInputPhoneNumber / MazSelectCountry', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue-multiselect', 'vue-select', '@vueform/multiselect', 'vue3-select-component'], replacement: 'MazSelect (search, multiple, groups, custom options)', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue-final-modal', '@kouts/vue-modal', 'vue-js-modal'], replacement: 'MazDialog, MazDialogConfirm or MazBottomSheet', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue3-dropzone', 'vue-dropzone', 'dropzone', 'vue-upload-component', 'filepond', 'vue-filepond'], replacement: 'MazDropzone', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue3-otp-input', 'vue-otp-input'], replacement: 'MazInputCode', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue3-carousel', 'vue-agile', 'swiper/vue'], replacement: 'MazCarousel', severity: 'info', rule: 'prefer-ecosystem' },
  { packages: ['vue-skeletor', 'vue-content-loader', 'vue-loading-skeleton'], replacement: 'MazSkeleton', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue-loading-overlay', 'vue-spinner', 'vue-spinners', 'epic-spinners'], replacement: 'MazSpinner, MazFullscreenLoader or `useWait`', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vue-easy-lightbox', 'vue-image-zoomer', 'medium-zoom', 'viewerjs', 'v-viewer'], replacement: 'the `vZoomImg` / `vFullscreenImg` directives or MazGallery', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['aos'], replacement: 'the maz-ui AOS plugin (`useAos`)', severity: 'warning', rule: 'prefer-ecosystem' },
  { packages: ['vee-validate', '@vuelidate/core', 'vuelidate'], replacement: '`useFormValidator` / `useFormField` with your Standard Schema library (Zod, Valibot, ArkType)', severity: 'info', rule: 'prefer-ecosystem' },
]

interface ParsedImport {
  specifier: string
  names: string[]
  typeOnly: boolean
  offset: number
}

const IMPORT_REGEX = /import\s+(type\s+)?(?:([\w$]+)\s*(?:,\s*)?)?(?:\{([^}]*)\}|\*\s+as\s+[\w$]+)?\s*from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g

export function parseImports(code: string): ParsedImport[] {
  return [...code.matchAll(IMPORT_REGEX)].map((match) => {
    const [, typeKeyword, defaultName, named, specifier, sideEffect] = match
    const names = (named ?? '')
      .split(',')
      .map(entry => entry.trim())
      .filter(entry => entry && !entry.startsWith('type '))
      .map(entry => entry.split(/\s+as\s+/)[0].trim())

    return {
      specifier: specifier ?? sideEffect,
      names: defaultName ? [defaultName, ...names] : names,
      typeOnly: !!typeKeyword,
      offset: match.index ?? 0,
    }
  })
}

function matchesPackage(specifier: string, packages: string[]): boolean {
  return packages.some(name => (name.endsWith('/') ? specifier.startsWith(name) : specifier === name || specifier.startsWith(`${name}/`)))
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
    suggestion: near.length > 0 ? `Did you mean ${near.map(candidate => `\`${candidate}\``).join(' or ')}?` : 'Find the right one with `search_docs`.',
  }, offset)
}

function checkIconImport(entry: ParsedImport, offset: number, context: ReviewContext): void {
  if (entry.specifier !== '@maz-ui/icons' && !entry.specifier.startsWith('@maz-ui/icons/'))
    return

  const fromPath = /^@maz-ui\/icons\/(?:static|lazy|raw)\/(\w+)$/.exec(entry.specifier)?.[1]
  const icons = [...entry.names, ...(fromPath ? [fromPath] : [])]
    .map(name => name.replace(/^Lazy(?=Maz)/, ''))
    .filter(name => name.startsWith('Maz') && !context.knowledge.iconNames.has(name))

  for (const icon of new Set(icons)) {
    const near = closest(icon, context.knowledge.iconNames, { max: 3, limit: 3 })

    context.report({
      rule: 'unknown-icon',
      severity: 'error',
      message: `\`${icon}\` does not exist in @maz-ui/icons.`,
      suggestion: near.length > 0 ? `Did you mean ${near.map(name => `\`${name}\``).join(' or ')}? Search with \`find_icons\`.` : 'Search with `find_icons({ query: "..." })`.',
    }, offset)
  }
}

function isNuxtAutoImported(entry: ParsedImport): boolean {
  if (/^maz-ui\/(?:components(?:\/Maz\w+)?|composables(?:\/use\w+)?)$/.test(entry.specifier))
    return true

  return ['@maz-ui/themes', '@maz-ui/translations'].includes(entry.specifier)
    && entry.names.some(name => ['useTheme', 'useTranslations'].includes(name))
}

function checkEcosystemImport(entry: ParsedImport, offset: number, context: ReviewContext): void {
  if (checkEntryPoint(entry, offset, context))
    return

  checkComponentImport(entry, offset, context)
  checkIconImport(entry, offset, context)

  if (context.framework === 'nuxt' && !entry.typeOnly && isNuxtAutoImported(entry)) {
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
      const flagged = [...entry.names, ...(lodashPath ? [lodashPath] : [])].filter(name => rule.names?.[name])

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

export function reviewScript(code: string, offset: number, context: ReviewContext): void {
  for (const entry of parseImports(code)) {
    const position = offset + entry.offset

    if (/^(?:maz-ui|@maz-ui\/)/.test(entry.specifier))
      checkEcosystemImport(entry, position, context)
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

  checkClassStrings(code.replaceAll(/^\s*import\s[^\n]*$/gm, line => ' '.repeat(line.length)), offset, context)
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
