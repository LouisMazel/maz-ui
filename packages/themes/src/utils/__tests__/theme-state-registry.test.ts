import type { Ref } from 'vue'
import type { ThemeState } from '../../types'
import { ref } from 'vue'
import { getActiveThemeState, setActiveThemeState } from '../theme-state-registry'

describe('theme-state-registry', () => {
  describe('given a theme state', () => {
    describe('when it is set as active', () => {
      it('then it is returned', () => {
        const themeState = ref({ colorMode: 'dark' }) as Ref<ThemeState>

        setActiveThemeState(themeState)

        expect(getActiveThemeState()).toBe(themeState)
      })
    })
  })
})
