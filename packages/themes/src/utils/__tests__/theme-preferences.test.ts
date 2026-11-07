import {
  clearPresetPreference,
  getDefaultColorMode,
  getSystemColorMode,
  parseColorModeCookie,
  parsePresetCookie,
  readColorModePreference,
  readPresetPreference,
  resolveActivePresetName,
  resolveIsDark,
  saveColorModeChoice,
  savePresetPreference,
  saveSystemColorMode,
  serializeColorModeCookie,
} from '../theme-preferences'

const { isServer } = vi.hoisted(() => ({
  isServer: vi.fn(() => false),
}))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({ isServer }))

function clearCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim()
    if (name)
      document.cookie = `${name}=; max-age=0; path=/`
  }
}

function stubSystem(dark: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: dark })))
}

describe('theme-preferences', () => {
  afterEach(() => {
    clearCookies()
    vi.unstubAllGlobals()
    isServer.mockReturnValue(false)
  })

  describe('given parseColorModeCookie', () => {
    describe('when the cookie has a choice and a system part', () => {
      it('then it returns both', () => {
        expect(parseColorModeCookie('auto:dark')).toEqual({ colorMode: 'auto', system: 'dark' })
      })
    })

    describe('when the cookie only has a system part', () => {
      it('then it returns the system part', () => {
        expect(parseColorModeCookie(':light')).toEqual({ colorMode: undefined, system: 'light' })
      })
    })

    describe('when the cookie has the legacy format', () => {
      it('then the value is the choice', () => {
        expect(parseColorModeCookie('dark')).toEqual({ colorMode: 'dark', system: undefined })
      })
    })

    describe('when the cookie has unknown values', () => {
      it('then they are ignored', () => {
        expect(parseColorModeCookie('blue:purple')).toEqual({ colorMode: undefined, system: undefined })
      })
    })

    describe('when the cookie is missing', () => {
      it('then it returns an empty preference', () => {
        expect(parseColorModeCookie(undefined)).toEqual({})
      })
    })
  })

  describe('given serializeColorModeCookie', () => {
    describe('when the preference has a choice and a system part', () => {
      it('then it joins them', () => {
        expect(serializeColorModeCookie({ colorMode: 'light', system: 'dark' })).toBe('light:dark')
      })
    })

    describe('when the preference only has a system part', () => {
      it('then the choice is empty', () => {
        expect(serializeColorModeCookie({ system: 'dark' })).toBe(':dark')
      })
    })

    describe('when the preference only has a choice', () => {
      it('then it is the choice', () => {
        expect(serializeColorModeCookie({ colorMode: 'auto' })).toBe('auto')
      })
    })

    describe('when the preference is empty', () => {
      it('then it is empty', () => {
        expect(serializeColorModeCookie({})).toBe('')
      })
    })
  })

  describe('given parsePresetCookie', () => {
    describe('when the cookie is scoped', () => {
      it('then it returns the base and the active preset', () => {
        expect(parsePresetCookie('folio:ocean')).toEqual({ base: 'folio', active: 'ocean' })
      })
    })

    describe('when the cookie is a legacy plain name', () => {
      it('then it returns null', () => {
        expect(parsePresetCookie('ocean')).toBeNull()
      })
    })

    describe('when a part is empty', () => {
      it('then it returns null', () => {
        expect(parsePresetCookie('folio:')).toBeNull()
      })
    })

    describe('when the cookie is missing', () => {
      it('then it returns null', () => {
        expect(parsePresetCookie(null)).toBeNull()
      })
    })
  })

  describe('given the cookie readers', () => {
    describe('when a reader is passed', () => {
      it('then the preferences are read from it', () => {
        const cookies: Record<string, string> = { 'maz-color-mode': 'dark:light', 'maz-preset': 'folio:nova' }
        const read = (name: string) => cookies[name]

        expect(readColorModePreference(read)).toEqual({ colorMode: 'dark', system: 'light' })
        expect(readPresetPreference(read)).toEqual({ base: 'folio', active: 'nova' })
      })
    })

    describe('when no reader is passed', () => {
      it('then the preferences are read from document.cookie', () => {
        document.cookie = 'maz-color-mode=auto%3Adark; path=/'
        document.cookie = 'maz-preset=folio%3Aocean; path=/'

        expect(readColorModePreference()).toEqual({ colorMode: 'auto', system: 'dark' })
        expect(readPresetPreference()).toEqual({ base: 'folio', active: 'ocean' })
      })
    })
  })

  describe('given saveColorModeChoice', () => {
    describe('when the cookie has a system part', () => {
      it('then it keeps it', () => {
        document.cookie = 'maz-color-mode=%3Adark; path=/'

        saveColorModeChoice('light')

        expect(readColorModePreference()).toEqual({ colorMode: 'light', system: 'dark' })
      })
    })

    describe('when the legacy system cookie exists', () => {
      it('then it is deleted', () => {
        document.cookie = 'maz-resolved-color-mode=dark; path=/'

        saveColorModeChoice('dark')

        expect(document.cookie).not.toContain('maz-resolved-color-mode')
      })
    })

    describe('when running on the server', () => {
      it('then it writes nothing', () => {
        isServer.mockReturnValue(true)

        saveColorModeChoice('dark')

        expect(document.cookie).toBe('')
      })
    })
  })

  describe('given saveSystemColorMode', () => {
    describe('when the user chose a color mode', () => {
      it('then it keeps the choice', () => {
        document.cookie = 'maz-color-mode=dark; path=/'

        saveSystemColorMode('light')

        expect(readColorModePreference()).toEqual({ colorMode: 'dark', system: 'light' })
      })
    })

    describe('when the value does not change', () => {
      it('then the cookie is not rewritten', () => {
        document.cookie = 'maz-color-mode=%3Alight; path=/'
        const setter = vi.spyOn(document, 'cookie', 'set')

        saveSystemColorMode('light')

        expect(setter).not.toHaveBeenCalled()
        setter.mockRestore()
      })
    })
  })

  describe('given savePresetPreference', () => {
    describe('when called with a base and an active preset', () => {
      it('then it writes the scoped cookie', () => {
        savePresetPreference('folio', 'ocean')

        expect(readPresetPreference()).toEqual({ base: 'folio', active: 'ocean' })
      })
    })

    describe('when a part is empty', () => {
      it('then it writes nothing', () => {
        savePresetPreference('', 'ocean')

        expect(readPresetPreference()).toBeNull()
      })
    })

    describe('when the cookie is cleared', () => {
      it('then it is deleted', () => {
        savePresetPreference('folio', 'ocean')

        clearPresetPreference()

        expect(readPresetPreference()).toBeNull()
      })
    })
  })

  describe('given getSystemColorMode', () => {
    describe('when the system prefers dark', () => {
      it('then it returns dark', () => {
        stubSystem(true)

        expect(getSystemColorMode()).toBe('dark')
      })
    })

    describe('when matchMedia is missing', () => {
      it('then it returns light', () => {
        vi.stubGlobal('matchMedia', undefined)

        expect(getSystemColorMode()).toBe('light')
      })
    })

    describe('when running on the server', () => {
      it('then it returns light', () => {
        isServer.mockReturnValue(true)

        expect(getSystemColorMode()).toBe('light')
      })
    })
  })

  describe('given getDefaultColorMode', () => {
    describe('when the config has a color mode', () => {
      it('then it returns it', () => {
        expect(getDefaultColorMode({ colorMode: 'light' })).toBe('light')
      })
    })

    describe('when the config only supports the dark mode', () => {
      it('then it returns dark', () => {
        expect(getDefaultColorMode({ mode: 'dark' })).toBe('dark')
      })
    })

    describe('when the config has nothing', () => {
      it('then it returns auto', () => {
        expect(getDefaultColorMode({})).toBe('auto')
      })
    })
  })

  describe('given resolveIsDark', () => {
    describe('when the mode is forced', () => {
      it('then the mode wins over the color mode', () => {
        expect(resolveIsDark({ mode: 'light', colorMode: 'dark' }, 'dark')).toBe(false)
        expect(resolveIsDark({ mode: 'dark', colorMode: 'light' }, 'light')).toBe(true)
      })
    })

    describe('when the color mode is auto', () => {
      it('then it follows the system', () => {
        expect(resolveIsDark({ mode: 'both', colorMode: 'auto' }, 'dark')).toBe(true)
      })
    })

    describe('when the color mode is auto and no system is passed', () => {
      it('then it reads the system preference', () => {
        stubSystem(true)

        expect(resolveIsDark({ mode: 'both', colorMode: 'auto' })).toBe(true)
      })
    })

    describe('when the color mode is chosen', () => {
      it('then it ignores the system', () => {
        expect(resolveIsDark({ mode: 'both', colorMode: 'light' }, 'dark')).toBe(false)
      })
    })
  })

  describe('given resolveActivePresetName', () => {
    describe('when the cookie belongs to the configured preset', () => {
      it('then the active preset of the cookie wins', () => {
        expect(resolveActivePresetName('folio', { base: 'folio', active: 'ocean' })).toBe('ocean')
      })
    })

    describe('when the cookie belongs to another app', () => {
      it('then the configured preset wins', () => {
        expect(resolveActivePresetName('folio', { base: 'nova', active: 'ocean' })).toBe('folio')
      })
    })

    describe('when there is no cookie', () => {
      it('then the configured preset wins', () => {
        expect(resolveActivePresetName('folio', null)).toBe('folio')
      })
    })
  })
})
