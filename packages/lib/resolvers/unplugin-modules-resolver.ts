import type { ComponentResolverFunction } from 'unplugin-vue-components/types'

export function UnpluginModulesResolver(): ComponentResolverFunction {
  return (name) => {
    type MazUiModules = keyof typeof import('maz-ui')

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
    ] as MazUiModules[]

    if (modules.includes(name as MazUiModules)) {
      return {
        from: 'maz-ui',
        name,
      }
    }

    return undefined
  }
}
