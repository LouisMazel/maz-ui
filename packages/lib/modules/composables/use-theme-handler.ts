import { ref, computed } from 'vue'

const DEFAULT_OPTIONS = {
  darkClass: 'dark',
  lightClass: 'light',
  storageThemeKey: 'theme',
  storageThemeValueDark: 'dark',
  storageThemeValueLight: 'light',
  storageThemeValueSystem: 'system',
}

export const theme = ref<string>()

export type StrictThemeHandlerOptions = typeof DEFAULT_OPTIONS
export type ThemeHandlerOptions = Partial<StrictThemeHandlerOptions>

const setDarkTheme = ({
  darkClass,
  lightClass,
  storageThemeKey,
  storageThemeValueDark,
  setLocalStorageValue = true,
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean }) => {
  document.documentElement.classList.remove(lightClass)
  document.documentElement.classList.add(darkClass)
  theme.value = storageThemeValueDark

  if (setLocalStorageValue) {
    localStorage[storageThemeKey] = storageThemeValueDark
  }
}

const setLightTheme = ({
  darkClass,
  lightClass,
  storageThemeKey,
  storageThemeValueLight,
  setLocalStorageValue = true,
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean }) => {
  document.documentElement.classList.remove(darkClass)
  document.documentElement.classList.add(lightClass)

  theme.value = storageThemeValueLight

  if (setLocalStorageValue) {
    localStorage[storageThemeKey] = storageThemeValueLight
  }
}

function setSytemTheme(options: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean }) {
  document.documentElement.classList.remove(options.darkClass)
  document.documentElement.classList.remove(options.lightClass)
  theme.value = options.storageThemeValueSystem

  if (options.setLocalStorageValue) {
    localStorage[options.storageThemeKey] = options.storageThemeValueSystem
  }
  autoSetTheme(options)
}

function getPrefDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const autoSetTheme = (options: StrictThemeHandlerOptions) => {
  if (
    localStorage[options.storageThemeKey] === options.storageThemeValueDark ||
    (!(options.storageThemeKey in localStorage) && getPrefDark()) ||
    (localStorage[options.storageThemeKey] === options.storageThemeValueSystem && getPrefDark())
  ) {
    return setDarkTheme({ ...options, setLocalStorageValue: false })
  }

  return setLightTheme({ ...options, setLocalStorageValue: false })
}

const setTheme = ({
  shouldSetDarkMode,
  ...rest
}: StrictThemeHandlerOptions & { shouldSetDarkMode?: boolean }) => {
  if (typeof shouldSetDarkMode !== 'boolean') {
    return setSytemTheme(rest)
  }

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
  const hasSystemTheme = computed(() => theme.value === options.storageThemeValueSystem)

  return {
    autoSetTheme: () => autoSetTheme(options),
    toggleTheme: () => toggleTheme(options),
    setSystemTheme: () => setSytemTheme({ ...options, setLocalStorageValue: true }),
    setDarkTheme: () => setTheme({ ...options, shouldSetDarkMode: true }),
    setLightTheme: () => setTheme({ ...options, shouldSetDarkMode: false }),
    hasDarkTheme,
    hasLightTheme,
    hasSystemTheme,
    theme,
  }
}
