import { useWait } from '@composables/useWait'
import { createApp } from 'vue'

describe('given useWait composable', () => {
  describe('when wait plugin is installed', () => {
    it('then it should return the wait handler', () => {
      const mockWaitHandler = {
        start: vi.fn(),
        stop: vi.fn(),
        isWaiting: vi.fn().mockReturnValue(false),
      }

      const app = createApp({})
      app.provide('mazWait', mockWaitHandler)

      const result = useWait()
      expect(result).toBe(mockWaitHandler)
    })
  })

  describe('when wait plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        useWait()
      }).toThrow('[maz-ui](useWait) WaitPlugin is not installed')
    })
  })
})
