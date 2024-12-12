import type { ResolverFunction } from 'unplugin-auto-import/types'

const modules = [
  'capitalize',
  'checkAvailability',
  'countryCodeToUnicodeFlag',
  'currency',
  'date',
  'debounce',
  'injectStrict',
  'isClient',
  'normalizeString',
  'number',
  'sleep',
  'throttle',
  'truthyFilter',
  'useAos',
  'useBreakpoints',
  'useFormField',
  'useFormValidator',
  'useIdleTimeout',
  'useInstanceUniqId',
  'useReadingTime',
  'useStringMatching',
  'useSwipe',
  'useThemeHandler',
  'useTimer',
  'useToast',
  'useUserVisibility',
  'useWait',
  'useWindowSize',
  'useFormValidator',
  'useFormField',
]

/**
 * Resolver for Maz-UI (modules)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function UnpluginModulesResolver(): ResolverFunction {
  return (name) => {
    if (modules.includes(name)) {
      return {
        from: 'maz-ui',
        name,
      }
    }

    return undefined
  }
}
