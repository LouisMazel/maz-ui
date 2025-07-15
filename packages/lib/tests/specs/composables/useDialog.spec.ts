import { useDialog } from '@composables/useDialog'
import { createApp } from 'vue'

describe('given useDialog composable', () => {
  describe('when dialog plugin is installed', () => {
    it('then it should return the dialog handler', () => {
      const mockDialogHandler = {
        open: vi.fn(),
        close: vi.fn(),
        confirm: vi.fn(),
        alert: vi.fn(),
      }

      const app = createApp({})
      app.provide('mazDialog', mockDialogHandler)

      const result = useDialog()
      expect(result).toBe(mockDialogHandler)
    })
  })

  describe('when dialog plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        useDialog()
      }).toThrow('[maz-ui](useDialog) DialogPlugin is not installed')
    })
  })
})
