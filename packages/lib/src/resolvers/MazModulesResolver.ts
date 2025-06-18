import type { ResolverFunction } from 'unplugin-auto-import/types'
import { capitalize } from '@maz-ui/utils/src/formatters/capitalize.js'

type Modules = keyof typeof import('maz-ui/src/index.ts')
type Composables = keyof typeof import('maz-ui/src/composables/index.ts')

const composablesMap: Record<Composables, true> = {
  useInjectStrict: true,
  useAos: true,
  useBreakpoints: true,
  useFormField: true,
  useFormValidator: true,
  useIdleTimeout: true,
  useInstanceUniqId: true,
  useReadingTime: true,
  useStringMatching: true,
  useSwipe: true,
  useTimer: true,
  useToast: true,
  useUserVisibility: true,
  useWait: true,
  useWindowSize: true,
  useLanguageDisplayNames: true,
  useFreezeValue: true,
  useDialog: true,
  useMountComponent: true,
}

const modulesMap: Record<Modules, true> = {
  capitalize: true,
  checkAvailability: true,
  countryCodeToUnicodeFlag: true,
  formatCurrency: true,
  formatDate: true,
  debounce: true,
  isClient: true,
  isServer: true,
  normalizeString: true,
  formatNumber: true,
  sleep: true,
  throttle: true,
  truthyFilter: true,
  IdleTimeout: true,
  throttleId: true,
  pascalCase: true,
  camelCase: true,
  isStandaloneMode: true,
  debounceId: true,
  getCountryFlagUrl: true,
  isEqual: true,
  debounceCallback: true,
  ScriptLoader: true,
  Swipe: true,
  UserVisibility: true,
  TextareaAutogrow: true,
}

/**
 * Resolver for Maz-UI (modules)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazModulesResolver(options?: { devMode?: boolean, prefix?: string }): ResolverFunction {
  return (name) => {
    const { devMode = false, prefix = '' } = options || {}
    const base = devMode ? 'maz-ui/src' : 'maz-ui'
    const extension = devMode ? '/index.ts' : ''

    if (modulesMap[name as keyof typeof modulesMap] === true) {
      return {
        from: `${base}${extension}`,
        name,
        as: `${prefix.toLowerCase()}${capitalize(name)}`,
      }
    }

    if (composablesMap[name as keyof typeof composablesMap] === true) {
      return {
        from: `${base}/composables${extension}`,
        name,
        as: `use${capitalize(prefix)}${name.replace(/^use/, '')}`,
      }
    }

    return undefined
  }
}
