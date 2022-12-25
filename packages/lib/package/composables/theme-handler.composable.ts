import { ref, computed } from 'vue'

const DEFAULT_OPTIONS = {
  darkClass: 'dark',
  storageThemeKey: 'theme',
  storageThemeValueDark: 'dark',
  storageThemeValueLight: 'light',
}

export const theme = ref<string>()

export type StrictThemeHandlerOptions = typeof DEFAULT_OPTIONS
export type ThemeHandlerOptions = Partial<StrictThemeHandlerOptions>

const setDarkTheme = ({
  darkClass,
  storageThemeKey,
  storageThemeValueDark,
}: StrictThemeHandlerOptions) => {
  document.documentElement.classList.add(darkClass)
  localStorage[storageThemeKey] = storageThemeValueDark
  theme.value = storageThemeValueDark
}

const removeDarkTheme = ({
  darkClass,
  storageThemeKey,
  storageThemeValueLight,
}: StrictThemeHandlerOptions) => {
  document.documentElement.classList.remove(darkClass)
  localStorage[storageThemeKey] = storageThemeValueLight
  theme.value = storageThemeValueLight
}

const autoSetTheme = (options: StrictThemeHandlerOptions) => {
  if (
    localStorage[options.storageThemeKey] === options.storageThemeValueDark ||
    (!(options.storageThemeKey in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    setDarkTheme(options)
  } else {
    removeDarkTheme(options)
  }
}

const setTheme = ({
  shouldSetDarkMode,
  ...rest
}: StrictThemeHandlerOptions & { shouldSetDarkMode: boolean }) => {
  return shouldSetDarkMode ? setDarkTheme(rest) : removeDarkTheme(rest)
}

const toggleTheme = (options: StrictThemeHandlerOptions) => {
  return localStorage[options.storageThemeKey] === options.storageThemeValueDark
    ? removeDarkTheme(options)
    : setDarkTheme(options)
}

export const useThemeHandler = (opts: ThemeHandlerOptions = DEFAULT_OPTIONS) => {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const hasDarkTheme = computed(() => theme.value === options.storageThemeValueDark)
  const hasLightTheme = computed(() => theme.value === options.storageThemeValueLight)

  return {
    autoSetTheme: () => autoSetTheme(options),
    toggleTheme: () => toggleTheme(options),
    setDarkTheme: () => setTheme({ ...options, shouldSetDarkMode: true }),
    setLightTheme: () => setTheme({ ...options, shouldSetDarkMode: false }),
    hasDarkTheme,
    hasLightTheme,
    theme,
  }
}
