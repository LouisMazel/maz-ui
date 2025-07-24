import { useDialog } from '@composables/useDialog'
import { withSetup } from '@tests/helpers/withSetup'

describe('given useDialog composable', () => {
  describe('when dialog plugin is installed', () => {
    it('then it should return the dialog handler', () => {
      const mockDialogHandler = {
        open: vi.fn(),
        close: vi.fn(),
        confirm: vi.fn(),
        alert: vi.fn(),
      }

      const [result] = withSetup(() => useDialog(), {
        mazDialog: mockDialogHandler,
      })

      expect(result).toBe(mockDialogHandler)
    })
  })

  describe('when dialog plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        withSetup(() => useDialog())
      }).toThrow('[maz-ui](useDialog) DialogPlugin is not installed')
    })
  })
})
