import { ref, computed } from 'vue'

const DEFAULT_OPTIONS = {
  darkClass: 'dark',
  storageThemeKey: 'theme',
  storageThemeValueDark: 'dark',
  storageThemeValueLight: 'light',
}

export const theme = ref<string>()

export type ThemeHandlerOptions = Partial<typeof DEFAULT_OPTIONS>

const autoSetTheme = ({
  storageThemeKey,
  storageThemeValueDark,
  darkClass,
  storageThemeValueLight,
}: typeof DEFAULT_OPTIONS) => {
  if (
    localStorage[storageThemeKey] === storageThemeValueDark ||
    (!(storageThemeKey in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add(storageThemeValueDark)
    localStorage[storageThemeKey] = storageThemeValueDark
    theme.value = storageThemeValueDark
  } else {
    document.documentElement.classList.remove(darkClass)
    localStorage[storageThemeKey] = storageThemeValueLight
    theme.value = storageThemeValueLight
  }
}

const toggleTheme = ({
  storageThemeKey,
  storageThemeValueDark,
  darkClass,
  storageThemeValueLight,
}: typeof DEFAULT_OPTIONS) => {
  if (localStorage[storageThemeKey] === storageThemeValueDark) {
    document.documentElement.classList.remove(darkClass)
    localStorage[storageThemeKey] = storageThemeValueLight
    theme.value = storageThemeValueLight
  } else {
    document.documentElement.classList.add(darkClass)
    localStorage[storageThemeKey] = storageThemeValueDark
    theme.value = storageThemeValueDark
  }
}

export const useThemeHandler = (
  opts: ThemeHandlerOptions = DEFAULT_OPTIONS,
) => {
  const options = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const hasDarkTheme = computed(
    () => theme.value === options.storageThemeValueDark,
  )
  const hasLightTheme = computed(
    () => theme.value === options.storageThemeValueLight,
  )

  return {
    autoSetTheme: () => autoSetTheme(options),
    toggleTheme: () => toggleTheme(options),
    hasDarkTheme,
    hasLightTheme,
  }
}
