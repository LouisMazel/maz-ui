import { useThemeHandler, theme } from '@package/composables/theme-handler'

describe('useThemeHandler', () => {
  let themeHandler: ReturnType<typeof useThemeHandler>

  beforeEach(() => {
    // Reset theme before each test
    theme.value = ''
    // Initialize theme handler before each test
    themeHandler = useThemeHandler()
  })

  test('autoSetTheme sets theme based on browser preference', () => {
    // Given browser preference is "dark", theme should be "dark"
    window.matchMedia = vitest.fn().mockReturnValue({ matches: true })
    themeHandler.autoSetTheme()
    expect(theme.value).toBe('dark')

    // Given browser preference is "light", theme should be "light"
    window.localStorage.removeItem('theme')
    window.matchMedia = vitest.fn().mockReturnValue({ matches: false })
    themeHandler.autoSetTheme()
    expect(theme.value).toBe('light')
  })

  test('autoSetTheme uses stored theme value in localStorage if it exists', () => {
    // Given stored theme value in localStorage is "dark", theme should be "dark"
    localStorage.setItem('theme', 'dark')
    themeHandler.autoSetTheme()
    expect(theme.value).toBe('dark')

    // Given stored theme value in localStorage is "light", theme should be "light"
    localStorage.setItem('theme', 'light')
    themeHandler.autoSetTheme()
    expect(theme.value).toBe('light')
  })

  test('toggleTheme reverses current theme', () => {
    // Given current theme is "light", toggleTheme should set theme to "dark"
    localStorage.setItem('theme', 'light')
    themeHandler.toggleTheme()
    expect(theme.value).toBe('dark')

    // Given current theme is "dark", toggleTheme should set theme to "light"
    localStorage.setItem('theme', 'dark')
    themeHandler.toggleTheme()
    expect(theme.value).toBe('light')
  })

  test('setDarkTheme sets theme to "dark"', () => {
    themeHandler.setDarkTheme()
    expect(theme.value).toBe('dark')
  })

  test('setLightTheme sets theme to "light"', () => {
    themeHandler.setLightTheme()
    expect(theme.value).toBe('light')
  })

  test('hasDarkTheme computed value is true when theme is "dark"', () => {
    theme.value = 'dark'
    expect(themeHandler.hasDarkTheme.value).toBe(true)
  })

  test('hasDarkTheme computed value is false when theme is not "dark"', () => {
    theme.value = 'light'
    expect(themeHandler.hasDarkTheme.value).toBe(false)
  })

  test('hasLightTheme computed value is false when theme is not "light"', () => {
    theme.value = 'dark'
    expect(themeHandler.hasLightTheme.value).toBe(false)
  })
})
