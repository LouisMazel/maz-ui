import type { ResolverFunction } from 'unplugin-auto-import/types'

type Composables = keyof typeof import('maz-ui/src/composables/index.ts')
type Modules = keyof typeof import('maz-ui/src/index.ts')

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
  useThemeHandler: true,
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
  currency: true,
  date: true,
  debounce: true,
  isClient: true,
  normalizeString: true,
  number: true,
  sleep: true,
  throttle: true,
  truthyFilter: true,
  IdleTimeout: true,
  throttleId: true,
  pascalCase: true,
  camelCase: true,
  isStandaloneMode: true,
  debounceId: true,
  countryFlagUrlFromFlagCdn: true,
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
export function MazModulesResolver(): ResolverFunction {
  return (name) => {
    if (modulesMap[name] === true) {
      return {
        from: 'maz-ui',
        name,
      }
    }

    if (composablesMap[name] === true) {
      return {
        from: 'maz-ui/composables',
        name,
      }
    }

    return undefined
  }
}
