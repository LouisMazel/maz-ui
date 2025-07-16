import { useAos } from '@composables/useAos'
import { createApp } from 'vue'

describe('given useAos composable', () => {
  describe('when AOS plugin is installed', () => {
    it('then it should return the AOS handler', () => {
      const mockAosHandler = {
        init: vi.fn(),
        refresh: vi.fn(),
        refreshHard: vi.fn(),
      }

      const app = createApp({
        setup() {
          app.provide('mazAos', mockAosHandler)
          return { result: useAos() }
        },
      })

      const vm = app.mount(document.createElement('div'))
      expect(vm.result).toBe(mockAosHandler)
      app.unmount()
    })
  })

  describe('when AOS plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        useAos()
      }).toThrow('[maz-ui](useAos) AosPlugin is not installed')
    })
  })
})
