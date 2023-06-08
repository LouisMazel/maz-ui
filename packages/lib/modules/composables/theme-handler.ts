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
  setLocalStorageValue = true,
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean }) => {
  document.documentElement.classList.add(darkClass)
  theme.value = storageThemeValueDark

  if (setLocalStorageValue) {
    localStorage[storageThemeKey] = storageThemeValueDark
  }
}

const setLightTheme = ({
  darkClass,
  storageThemeKey,
  storageThemeValueLight,
  setLocalStorageValue = true,
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean }) => {
  document.documentElement.classList.remove(darkClass)
  theme.value = storageThemeValueLight

  if (setLocalStorageValue) {
    localStorage[storageThemeKey] = storageThemeValueLight
  }
}

const autoSetTheme = (options: StrictThemeHandlerOptions) => {
  if (
    localStorage[options.storageThemeKey] === options.storageThemeValueDark ||
    (!(options.storageThemeKey in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    setDarkTheme({ ...options, setLocalStorageValue: false })
  } else {
    setLightTheme({ ...options, setLocalStorageValue: false })
  }
}

const setTheme = ({
  shouldSetDarkMode,
  ...rest
}: StrictThemeHandlerOptions & { shouldSetDarkMode: boolean }) => {
  return shouldSetDarkMode ? setDarkTheme(rest) : setLightTheme(rest)
}

const toggleTheme = (options: StrictThemeHandlerOptions) => {
  return localStorage[options.storageThemeKey] === options.storageThemeValueDark
    ? setLightTheme(options)
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
