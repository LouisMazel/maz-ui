import type { ResolverFunction } from 'unplugin-auto-import/types'

export function UnpluginModulesResolver(): ResolverFunction {
  return (name) => {
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
    ]

    if (modules.includes(name)) {
      return {
        from: 'maz-ui',
        name,
      }
    }

    return undefined
  }
}
