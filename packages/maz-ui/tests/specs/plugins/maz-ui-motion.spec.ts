import type { App } from 'vue'
import { MazUi } from '@plugins/maz-ui.ts'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

vi.mock('@maz-ui/themes/plugin', () => ({ MazUiTheme: { install: vi.fn() } }))
vi.mock('@maz-ui/translations/plugin', () => ({ MazUiTranslations: { install: vi.fn() } }))

describe('given MazUi plugin with the motion option', () => {
  let app: App

  beforeEach(() => {
    app = { use: vi.fn(), provide: vi.fn() } as unknown as App
  })

  afterEach(() => {
    document.documentElement.className = ''
  })

  describe('when the motion is reduced for the whole page', () => {
    beforeEach(() => {
      MazUi.install?.(app, { theme: { preset: {} as any }, motion: { mode: 'reduced', scope: 'page' } })
    })

    it('then the html element gets the motion classes', () => {
      expect(document.documentElement.classList.contains('m-motion-reduced')).toBe(true)
      expect(document.documentElement.classList.contains('m-motion-page')).toBe(true)
    })

    it('then the motion option is given to the composables', () => {
      expect(app.provide).toHaveBeenCalledWith(MAZ_UI_CONTEXT_INJECTION_KEY, expect.objectContaining({ motion: { mode: 'reduced', scope: 'page' } }))
    })
  })
})
