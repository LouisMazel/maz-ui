import type { MazUiMotion } from '@/utils/motion.ts'
import { useReducedMotion } from '@composables/useReducedMotion.ts'
import { createApp } from 'vue'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

function mountWithMotion(motion: MazUiMotion | undefined, prefersReduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: prefersReduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })))

  let result!: ReturnType<typeof useReducedMotion>
  const app = createApp({
    setup() {
      result = useReducedMotion()
      return {}
    },
    template: '<div></div>',
  })
  app.provide(MAZ_UI_CONTEXT_INJECTION_KEY, { app, motion })
  app.mount(document.createElement('div'))

  return { result, app }
}

describe('given useReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when the motion option is auto and the user prefers reduced motion', () => {
    it('then the motion is reduced', () => {
      const { result, app } = mountWithMotion(undefined, true)

      expect(result.shouldReduceMotion.value).toBe(true)
      app.unmount()
    })
  })

  describe('when the motion option is full and the user prefers reduced motion', () => {
    it('then the motion is not reduced', () => {
      const { result, app } = mountWithMotion('full', true)

      expect(result.prefersReducedMotion.value).toBe(true)
      expect(result.shouldReduceMotion.value).toBe(false)
      app.unmount()
    })
  })

  describe('when the motion option is reduced and the user does not prefer it', () => {
    it('then the motion is reduced', () => {
      const { result, app } = mountWithMotion({ mode: 'reduced' }, false)

      expect(result.shouldReduceMotion.value).toBe(true)
      app.unmount()
    })
  })
})
