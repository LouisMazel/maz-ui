import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isClient } from '../helpers/isClient'

export interface StrictThemeHandlerOptions {
  /**
   * Class to be added to the html element when dark theme is set
   * @default 'dark'
   */
  darkClass: string
  /**
   * Class to be added to the html element when light theme is set
   * @default 'light'
   */
  lightClass: string
  /**
   * Key to store the theme in local storage
   * @default 'theme'
   */
  storageThemeKey: string
  /**
   * Value to set the theme to dark
   * @default 'dark'
   */
  storageThemeValueDark: string
  /**
   * Value to set the theme to light
   * @default 'light'
   */
  storageThemeValueLight: string
  /**
   * Value to set the theme to system
   * @default 'system'
   */
  storageThemeValueSystem: string
  /**
   * Watch for changes in the system theme
   * @default true
   */
  watchChanges: boolean
  /**
   * Default theme to set if no theme has been previously set by the user
   * Useful to force a theme on first visit
   * The value will not be stored in local storage
   * @default undefined
   */
  defaultTheme?: 'light' | 'dark'
}
export type ThemeHandlerOptions = Partial<StrictThemeHandlerOptions>

const DEFAULT_OPTIONS: StrictThemeHandlerOptions = {
  darkClass: 'dark',
  lightClass: 'light',
  storageThemeKey: 'theme',
  storageThemeValueDark: 'dark',
  storageThemeValueLight: 'light',
  storageThemeValueSystem: 'system',
  watchChanges: true,
}

const theme = ref<string>('system')
const selectedTheme = ref<string>('system')

function getPrefDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function setDarkTheme({
  darkClass,
  lightClass,
  storageThemeKey,
  storageThemeValueDark,
  setLocalStorageValue = true,
  setSelectedTheme = true,
}: StrictThemeHandlerOptions & {
  setLocalStorageValue?: boolean
  setSelectedTheme?: boolean
}) {
  if (!isClient()) {
    return
  }

  document.documentElement.classList.remove(lightClass)
  document.documentElement.classList.add(darkClass)

  theme.value = storageThemeValueDark
  if (setSelectedTheme)
    selectedTheme.value = storageThemeValueDark

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
  setSelectedTheme = true,
}: StrictThemeHandlerOptions & {
  setLocalStorageValue?: boolean
  setSelectedTheme?: boolean
}) {
  if (!isClient()) {
    return
  }

  document.documentElement.classList.remove(darkClass)
  document.documentElement.classList.add(lightClass)

  theme.value = storageThemeValueLight
  if (setSelectedTheme)
    selectedTheme.value = storageThemeValueLight

  if (setLocalStorageValue) {
    localStorage[storageThemeKey] = storageThemeValueLight
  }
}

function setSytemTheme({
  setLocalStorageValue = true,
  ...options
}: StrictThemeHandlerOptions & { setLocalStorageValue?: boolean }) {
  if (!isClient()) {
    return
  }

  document.documentElement.classList.remove(options.darkClass)
  document.documentElement.classList.remove(options.lightClass)

  theme.value = options.storageThemeValueSystem
  selectedTheme.value = options.storageThemeValueSystem

  if (setLocalStorageValue) {
    localStorage[options.storageThemeKey] = options.storageThemeValueSystem
  }

  return autoSetTheme(options)
}

function setDefaultTheme(options: StrictThemeHandlerOptions) {
  if (!options.defaultTheme) {
    return console.error('[maz-ui](useThemeHandler) No default theme set')
  }

  if (!['light', 'dark'].includes(options.defaultTheme)) {
    return console.error('[maz-ui](useThemeHandler) Default theme must be "light" or "dark"')
  }

  switch (options.defaultTheme) {
    case 'dark': {
      return setDarkTheme({
        ...options,
        setLocalStorageValue: false,
        setSelectedTheme: true,
      })
    }
    case 'light': {
      return setLightTheme({
        ...options,
        setLocalStorageValue: false,
        setSelectedTheme: true,
      })
    }
  }
}

function autoSetTheme(options: StrictThemeHandlerOptions) {
  if (!isClient()) {
    return
  }

  if (!localStorage[options.storageThemeKey] && options.defaultTheme) {
    return setDefaultTheme(options)
  }

  const shouldSetDarkTheme
    = localStorage[options.storageThemeKey] === options.storageThemeValueDark
    || (!localStorage[options.storageThemeKey] && getPrefDark())
    || (localStorage[options.storageThemeKey] === options.storageThemeValueSystem && getPrefDark())

  return shouldSetDarkTheme
    ? setDarkTheme({
      ...options,
      setLocalStorageValue: false,
      setSelectedTheme: false,
    })
    : setLightTheme({
      ...options,
      setLocalStorageValue: false,
      setSelectedTheme: false,
    })
}

function setTheme({
  theme,
  ...rest
}: StrictThemeHandlerOptions & { theme: 'light' | 'dark' | 'system' }) {
  if (theme === 'system') {
    return setSytemTheme(rest)
  }

  if (theme === 'dark') {
    return setDarkTheme(rest)
  }

  return setLightTheme(rest)
}

function toggleTheme(options: StrictThemeHandlerOptions) {
  return theme.value === options.storageThemeValueDark
    ? setLightTheme(options)
    : setDarkTheme(options)
}

export function useThemeHandler(opts?: ThemeHandlerOptions) {
  const globalOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  function themeWatchHandler() {
    autoSetTheme(globalOptions)
  }

  onMounted(() => {
    if (localStorage[globalOptions.storageThemeKey]) {
      selectedTheme.value = localStorage[globalOptions.storageThemeKey]
    }

    if (globalOptions.watchChanges) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', themeWatchHandler)
    }
  })

  onBeforeUnmount(() => {
    if (globalOptions.watchChanges) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', themeWatchHandler)
    }
  })

  watch(selectedTheme, (value) => {
    localStorage[globalOptions.storageThemeKey] = value

    switch (value) {
      case globalOptions.storageThemeValueDark: {
        setDarkTheme(globalOptions)
        break
      }
      case globalOptions.storageThemeValueLight: {
        setLightTheme(globalOptions)
        break
      }
      case globalOptions.storageThemeValueSystem: {
        setSytemTheme(globalOptions)
        break
      }
    }
  })

  return {
    autoSetTheme: () => autoSetTheme(globalOptions),
    toggleTheme: () => toggleTheme(globalOptions),
    setSystemTheme: () => setTheme({ ...globalOptions, theme: 'system' }),
    setDarkTheme: () => setTheme({ ...globalOptions, theme: 'dark' }),
    setLightTheme: () => setTheme({ ...globalOptions, theme: 'light' }),
    setDefaultTheme: () => setDefaultTheme(globalOptions),
    hasDarkTheme: computed(() => selectedTheme.value === globalOptions.storageThemeValueDark),
    hasLightTheme: computed(() => selectedTheme.value === globalOptions.storageThemeValueLight),
    hasSystemTheme: computed(() => selectedTheme.value === globalOptions.storageThemeValueSystem),
    theme,
    selectedTheme,
  }
}
