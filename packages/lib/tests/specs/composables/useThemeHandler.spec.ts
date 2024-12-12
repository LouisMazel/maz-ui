import { useThemeHandler } from '@composables/useThemeHandler'

describe('useThemeHandler', () => {
  let themeHandler: ReturnType<typeof useThemeHandler>

  beforeEach(() => {
    themeHandler = useThemeHandler()
    const { selectedTheme, theme } = useThemeHandler()
    // Reset theme before each test
    theme.value = ''
    selectedTheme.value = ''
    // Initialize theme handler before each test
  })

  it('autoSetTheme sets theme based on browser preference', () => {
    // Given browser preference is "dark", theme should be "dark"
    // window.matchMedia = vitest.fn().mockReturnValue({ matches: true })
    // themeHandler.autoSetTheme()
    // expect(theme.value).toBe('dark')

    // Given browser preference is "light", theme should be "light"
    localStorage.removeItem('theme')
    window.matchMedia = vitest.fn().mockReturnValue({ matches: false })
    themeHandler.autoSetTheme()
    expect(themeHandler.theme.value).toBe('light')
  })

  it('autoSetTheme uses stored theme value in localStorage if it exists', () => {
    // Given stored theme value in localStorage is "dark", theme should be "dark"
    localStorage.setItem('theme', 'dark')
    themeHandler.autoSetTheme()
    expect(themeHandler.theme.value).toBe('dark')

    // Given stored theme value in localStorage is "light", theme should be "light"
    localStorage.setItem('theme', 'light')
    themeHandler.autoSetTheme()
    expect(themeHandler.theme.value).toBe('light')
  })

  it('toggleTheme reverses current theme', () => {
    // Given current theme is "light", toggleTheme should set theme to "dark"
    localStorage.setItem('theme', 'light')
    themeHandler.toggleTheme()
    expect(themeHandler.theme.value).toBe('dark')

    // Given current theme is "dark", toggleTheme should set theme to "light"
    localStorage.setItem('theme', 'dark')
    themeHandler.toggleTheme()
    expect(themeHandler.theme.value).toBe('light')
  })

  it('setDarkTheme sets theme to "dark"', () => {
    themeHandler.setDarkTheme()
    expect(themeHandler.theme.value).toBe('dark')
  })

  it('setLightTheme sets theme to "light"', () => {
    themeHandler.setLightTheme()
    expect(themeHandler.theme.value).toBe('light')
  })

  it('hasDarkTheme computed value is true when theme is "dark"', () => {
    themeHandler.selectedTheme.value = 'dark'
    expect(themeHandler.hasDarkTheme.value).toBe(true)
  })

  it('hasDarkTheme computed value is false when theme is not "dark"', () => {
    themeHandler.selectedTheme.value = 'light'
    expect(themeHandler.hasDarkTheme.value).toBe(false)
  })

  it('hasLightTheme computed value is false when theme is not "light"', () => {
    themeHandler.selectedTheme.value = 'dark'
    expect(themeHandler.hasLightTheme.value).toBe(false)
  })
})
