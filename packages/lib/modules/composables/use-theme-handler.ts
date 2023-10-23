import { ref, computed, onMounted } from 'vue'

const DEFAULT_OPTIONS = {
  darkClass: 'dark',
  lightClass: 'light',
  storageThemeKey: 'theme',
  storageThemeValueDark: 'dark',
  storageThemeValueLight: 'light',
  storageThemeValueSystem: 'system',
}

export type StrictThemeHandlerOptions = typeof DEFAULT_OPTIONS
export type ThemeHandlerOptions = Partial<StrictThemeHandlerOptions>

export const theme = ref<string>('system')

function setDarkTheme({
  darkClass,
  lightClass,
  storageThemeKey,
  storageThemeValueDark,
  setLocalStorageValue = true,
  setThemeValue = true,
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean; setThemeValue?: boolean }) {
  document.documentElement.classList.remove(lightClass)
  document.documentElement.classList.add(darkClass)

  if (setThemeValue) theme.value = storageThemeValueDark

  if (setLocalStorageValue) {
    localStorage[storageThemeKey] = storageThemeValueDark
  }
}

function setLightTheme({
  darkClass,
  lightClass,
  storageThemeKey,
  storageThemeValueLight,
  setLocalStorageValue = true,
  setThemeValue = true,
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean; setThemeValue?: boolean }) {
  document.documentElement.classList.remove(darkClass)
  document.documentElement.classList.add(lightClass)

  if (setThemeValue) theme.value = storageThemeValueLight

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

  autoSetTheme({ ...options, setThemeValue: false })
}

function getPrefDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function autoSetTheme(options: StrictThemeHandlerOptions & { setThemeValue?: boolean }) {
  if (
    localStorage[options.storageThemeKey] === options.storageThemeValueDark ||
    (!(options.storageThemeKey in localStorage) && getPrefDark()) ||
    (localStorage[options.storageThemeKey] === options.storageThemeValueSystem && getPrefDark())
  ) {
    return setDarkTheme({ ...options, setLocalStorageValue: false })
  }

  return setLightTheme({ ...options, setLocalStorageValue: false })
}

function setTheme({
  shouldSetDarkMode,
  ...rest
}: StrictThemeHandlerOptions & { shouldSetDarkMode?: boolean }) {
  if (typeof shouldSetDarkMode !== 'boolean') {
    return setSytemTheme(rest)
  }

  return shouldSetDarkMode ? setDarkTheme(rest) : setLightTheme(rest)
}

function toggleTheme(options: StrictThemeHandlerOptions) {
  return localStorage[options.storageThemeKey] === options.storageThemeValueDark
    ? setLightTheme(options)
    : setDarkTheme(options)
}

export function useThemeHandler(opts: ThemeHandlerOptions = DEFAULT_OPTIONS) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const hasDarkTheme = computed(() => theme.value === options.storageThemeValueDark)
  const hasLightTheme = computed(() => theme.value === options.storageThemeValueLight)
  const hasSystemTheme = computed(() => theme.value === options.storageThemeValueSystem)

  onMounted(() => {
    theme.value = localStorage[options.storageThemeKey]
  })

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
