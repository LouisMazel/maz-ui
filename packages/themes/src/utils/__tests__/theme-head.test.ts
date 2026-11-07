import type { ThemePreset } from '../../types'
import { ocean } from '../../presets/ocean'
import { CSS_ID } from '../css-generator'
import {
  DEFAULT_PRESET_NAME,
  getColorModeScript,
  getRequestThemeContext,
  getThemeHead,
  getThemeHeadTags,
  renderThemeHead,
  resolveThemeContext,
  resolveThemePresets,
} from '../theme-head'

function reader(cookies: Record<string, string>) {
  return (name: string) => cookies[name]
}

const customPreset: ThemePreset = { ...ocean, name: 'custom' }

function runScript(script: string, { cookie = '', systemDark = false }: { cookie?: string, systemDark?: boolean } = {}) {
  const classes = new Set<string>()
  const document = {
    cookie,
    documentElement: {
      classList: {
        toggle: (name: string, force: boolean) => force
          ? classes.add(name)
          : classes.delete(name),
      },
    },
  }
  const window = {
    matchMedia: () => ({ matches: systemDark }),
  }
  // eslint-disable-next-line no-new-func, sonarjs/code-eval
  new Function('document', 'window', script)(document, window)

  return {
    classes: [...classes],
    cookie: document.cookie,
  }
}

describe('theme-head', () => {
  describe('given resolveThemePresets', () => {
    describe('when the strategy is buildtime without a preset object', () => {
      it('then only the configured name is returned', async () => {
        expect(await resolveThemePresets({
          strategy: 'buildtime',
          preset: 'ocean',
        })).toEqual({ presetBase: 'ocean' })
        expect(await resolveThemePresets({ strategy: 'buildtime' })).toEqual({ presetBase: DEFAULT_PRESET_NAME })
      })
    })

    describe('when the cookie belongs to the configured preset', () => {
      it('then the active preset of the cookie is returned', async () => {
        const result = await resolveThemePresets({
          preset: 'folio',
        }, reader({ 'maz-preset': 'folio:ocean' }))

        expect(result.presetBase).toBe('folio')
        expect(result.basePreset?.name).toBe('folio')
        expect(result.preset?.name).toBe('ocean')
      })
    })

    describe('when the active preset of the cookie does not exist', () => {
      it('then the configured preset is returned', async () => {
        const result = await resolveThemePresets({
          preset: 'folio',
        }, reader({ 'maz-preset': 'folio:unknown' }))

        expect(result.preset?.name).toBe('folio')
      })
    })

    describe('when persistPreset is disabled', () => {
      it('then the cookie is ignored', async () => {
        const result = await resolveThemePresets({
          preset: 'folio',
          persistPreset: false,
        }, reader({ 'maz-preset': 'folio:ocean' }))

        expect(result.preset?.name).toBe('folio')
      })
    })

    describe('when the preset is an object with overrides', () => {
      it('then the overrides are merged into the active preset', async () => {
        const result = await resolveThemePresets({
          preset: customPreset,
          overrides: {
            foundation: { 'border-width': '3px' },
          },
        }, reader({}))

        expect(result.basePreset).toBe(customPreset)
        expect(result.preset?.foundation?.['border-width']).toBe('3px')
      })
    })

    describe('when the strategy is buildtime with a preset object', () => {
      it('then the cookie is ignored', async () => {
        const result = await resolveThemePresets({ preset: customPreset, strategy: 'buildtime' }, reader({ 'maz-preset': 'custom:ocean' }))

        expect(result.preset?.name).toBe('custom')
      })
    })
  })

  describe('given resolveThemeContext', () => {
    describe('when no option is passed', () => {
      it('then it returns the defaults of the config', async () => {
        const context = await resolveThemeContext({ preset: customPreset })

        expect(context).toMatchObject({
          presetBase: 'custom',
          colorMode: 'auto',
          isDark: false,
          systemColorMode: undefined,
          mode: 'both',
          strategy: 'runtime',
          darkModeStrategy: 'class',
          darkClass: 'dark',
          lightClass: 'light',
        })
      })
    })

    describe('when the cookie has a system part', () => {
      it('then the auto color mode follows it', async () => {
        const context = await resolveThemeContext({ preset: customPreset }, {
          readCookie: reader({ 'maz-color-mode': 'auto:dark' }),
        })

        expect(context.isDark).toBe(true)
        expect(context.systemColorMode).toBe('dark')
      })
    })

    describe('when a client hint is passed', () => {
      it('then it wins over the cookie', async () => {
        const context = await resolveThemeContext({ preset: customPreset }, {
          readCookie: reader({ 'maz-color-mode': ':dark' }),
          systemColorMode: 'light',
        })

        expect(context.isDark).toBe(false)
        expect(context.systemColorMode).toBe('light')
      })
    })

    describe('when the user chose a color mode', () => {
      it('then it wins over the config', async () => {
        const context = await resolveThemeContext({ preset: customPreset, colorMode: 'light' }, {
          readCookie: reader({ 'maz-color-mode': 'dark' }),
        })

        expect(context.colorMode).toBe('dark')
        expect(context.isDark).toBe(true)
      })
    })
  })

  describe('given getThemeHead', () => {
    describe('when the color mode is known', () => {
      it('then it returns the class, the CSS, the meta and the script', async () => {
        const head = await getThemeHead({ preset: customPreset }, {
          readCookie: reader({ 'maz-color-mode': 'dark' }),
        })

        expect(head.htmlClass).toBe('dark')
        expect(head.cssId).toBe(CSS_ID)
        expect(head.css).toContain(':root')
        expect(head.colorScheme).toBe('dark')
        expect(head.script).toContain('maz-color-mode')
      })
    })

    describe('when the system resolves to light', () => {
      it('then the class is the light class', async () => {
        const head = await getThemeHead({ preset: customPreset, lightClass: 'is-light' }, { systemColorMode: 'light' })

        expect(head.htmlClass).toBe('is-light')
      })
    })

    describe('when the server does not know the system preference', () => {
      it('then the class is left to the script', async () => {
        const head = await getThemeHead({ preset: customPreset }, {
          readCookie: reader({}),
        })

        expect(head.htmlClass).toBeUndefined()
        expect(head.script).toBeDefined()
      })
    })

    describe('when the dark mode strategy is media', () => {
      it('then there is no class and no script', async () => {
        const head = await getThemeHead({ preset: customPreset, darkModeStrategy: 'media' }, { systemColorMode: 'dark' })

        expect(head.htmlClass).toBeUndefined()
        expect(head.script).toBeUndefined()
      })
    })

    describe('when the strategy is buildtime', () => {
      it('then there is no CSS', async () => {
        const head = await getThemeHead({
          preset: 'ocean',
          strategy: 'buildtime',
        })

        expect(head.css).toBeUndefined()
        expect(head.presetBase).toBe('ocean')
      })
    })
  })

  describe('given getRequestThemeContext', () => {
    describe('when the request has cookies and a client hint', () => {
      it('then the context reads them', async () => {
        const context = await resolveThemeContext({ preset: customPreset }, getRequestThemeContext({
          'cookie': 'maz-color-mode=auto; other=1',
          'sec-ch-prefers-color-scheme': 'dark',
        }))

        expect(context.colorMode).toBe('auto')
        expect(context.isDark).toBe(true)
      })
    })

    describe('when the client hint is unknown', () => {
      it('then the system preference stays unknown', () => {
        expect(getRequestThemeContext({ 'sec-ch-prefers-color-scheme': 'blue' }).systemColorMode).toBeUndefined()
        expect(getRequestThemeContext({ 'sec-ch-prefers-color-scheme': 'light' }).systemColorMode).toBe('light')
      })
    })
  })

  describe('given getThemeHeadTags', () => {
    describe('when the color mode is chosen', () => {
      it('then it returns the class without the Accept-CH meta', async () => {
        const tags = getThemeHeadTags(await getThemeHead({ preset: customPreset }, {
          readCookie: reader({ 'maz-color-mode': 'dark' }),
        }))

        expect(tags.htmlAttrs).toEqual({ class: 'dark' })
        expect(tags.style).toEqual([
          {
            id: CSS_ID,
            innerHTML: expect.any(String),
          },
        ])
        expect(tags.meta).toEqual([
          { name: 'color-scheme', content: 'dark', id: 'maz-color-scheme' },
        ])
        expect(tags.script).toEqual([
          {
            id: 'maz-color-mode-blocking',
            innerHTML: expect.any(String),
            tagPosition: 'head',
          },
        ])
      })
    })

    describe('when the head has no class, CSS nor script', () => {
      it('then it only returns the meta', () => {
        const tags = getThemeHeadTags({ colorScheme: 'dark', cssId: CSS_ID } as never)

        expect(tags).toEqual({
          htmlAttrs: {},
          style: [],
          meta: [
            { name: 'color-scheme', content: 'dark', id: 'maz-color-scheme' },
          ],
          script: [],
        })
      })
    })
  })

  describe('given renderThemeHead', () => {
    describe('when the head has CSS and a script', () => {
      it('then it renders the three tags', async () => {
        const html = renderThemeHead(await getThemeHead({ preset: customPreset }, {
          readCookie: reader({}),
        }))

        expect(html).toContain('<meta name="color-scheme" content="light dark" id="maz-color-scheme">')
        expect(html).toContain('<meta http-equiv="Accept-CH" content="Sec-CH-Prefers-Color-Scheme" id="maz-color-http-accept-ch">')
        expect(html).toContain(`<style id="${CSS_ID}">`)
        expect(html).toContain('<script id="maz-color-mode-blocking">')
      })
    })

    describe('when the CSS contains a closing style tag', () => {
      it('then it is escaped', () => {
        const html = renderThemeHead({ colorScheme: 'light"', cssId: CSS_ID, css: 'a{}</style><script>' } as never)

        expect(html).toContain('content="light&quot;"')
        expect(html).toContain('a{}<\\/style><script>')
        expect(html).not.toContain('<script>a')
      })
    })

    describe('when the head has no CSS nor script', () => {
      it('then it only renders the meta', () => {
        const html = renderThemeHead({ colorScheme: 'dark', cssId: CSS_ID } as never)

        expect(html).toBe('<meta name="color-scheme" content="dark" id="maz-color-scheme">')
      })
    })
  })

  describe('given getColorModeScript', () => {
    describe('when the user has no choice and the system is dark', () => {
      it('then it sets the dark class and saves the system part', () => {
        const result = runScript(getColorModeScript(), { systemDark: true })

        expect(result.classes).toEqual(['dark'])
        expect(result.cookie).toContain('maz-color-mode=%3Adark')
      })
    })

    describe('when the user chose light and the system is dark', () => {
      it('then it sets the light class and keeps the choice', () => {
        const result = runScript(getColorModeScript({ lightClass: 'is-light' }), { cookie: 'maz-color-mode=light', systemDark: true })

        expect(result.classes).toEqual(['is-light'])
        expect(result.cookie).toContain('maz-color-mode=light%3Adark')
      })
    })

    describe('when the user chose dark and the cookie is up to date', () => {
      it('then it does not rewrite the cookie', () => {
        const result = runScript(getColorModeScript({ darkClass: 'is-dark' }), { cookie: 'maz-color-mode=dark%3Alight' })

        expect(result.classes).toEqual(['is-dark'])
        expect(result.cookie).toBe('maz-color-mode=dark%3Alight')
      })
    })

    describe('when the cookie is malformed', () => {
      it('then it falls back to the system', () => {
        const result = runScript(getColorModeScript(), { cookie: 'maz-color-mode=%E0%A4%A' })

        expect(result.classes).toEqual(['light'])
      })
    })

    describe('when the mode is dark only', () => {
      it('then it does not touch the classes', () => {
        const result = runScript(getColorModeScript({ mode: 'dark' }))

        expect(result.classes).toEqual([])
      })
    })
  })
})
