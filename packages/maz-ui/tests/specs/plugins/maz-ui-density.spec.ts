import type { App } from 'vue'
import { MazUi } from '@plugins/maz-ui.ts'

vi.mock('@maz-ui/themes/plugin', () => ({ MazUiTheme: { install: vi.fn() } }))
vi.mock('@maz-ui/translations/plugin', () => ({ MazUiTranslations: { install: vi.fn() } }))

describe('given MazUi plugin with the density option', () => {
  let app: App

  beforeEach(() => {
    app = { use: vi.fn(), provide: vi.fn() } as unknown as App
  })

  afterEach(() => {
    document.documentElement.className = ''
  })

  describe('when the density is compact', () => {
    beforeEach(() => {
      MazUi.install?.(app, { theme: { preset: {} as any }, density: 'compact' })
    })

    it('then the html element gets the compact class', () => {
      expect(document.documentElement.classList.contains('m-density-compact')).toBe(true)
    })
  })

  describe('when the density is not set', () => {
    beforeEach(() => {
      MazUi.install?.(app, { theme: { preset: {} as any } })
    })

    it('then the html element has no density class', () => {
      expect(document.documentElement.className).toBe('')
    })
  })
})
