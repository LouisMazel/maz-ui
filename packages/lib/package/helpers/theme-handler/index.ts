import { ref } from 'vue'

const DEFAULT_OPTIONS = {
  darkClass: 'dark',
  storageThemeKey: 'theme',
  storageThemeValueDark: 'dark',
  storageThemeValueLight: 'light',
}

export const hasDarkMode = ref(false)

export const useThemeHandler = (opts = DEFAULT_OPTIONS) => {
  const {
    darkClass,
    storageThemeKey,
    storageThemeValueDark,
    storageThemeValueLight,
  } = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const autoSetTheme = () => {
    if (
      localStorage[storageThemeKey] === storageThemeValueDark ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add(storageThemeValueDark)
      localStorage[storageThemeKey] = storageThemeValueDark
      hasDarkMode.value = true
    } else {
      document.documentElement.classList.remove(darkClass)
      localStorage[storageThemeKey] = storageThemeValueLight
      hasDarkMode.value = false
    }
  }

  const toggleTheme = () => {
    if (localStorage[storageThemeKey] === storageThemeValueDark) {
      document.documentElement.classList.remove(darkClass)
      localStorage[storageThemeKey] = storageThemeValueLight
      hasDarkMode.value = false
    } else {
      document.documentElement.classList.add(darkClass)
      localStorage[storageThemeKey] = storageThemeValueDark
      hasDarkMode.value = true
    }
  }

  return {
    autoSetTheme,
    toggleTheme,
    hasDarkMode: hasDarkMode.value,
  }
}
