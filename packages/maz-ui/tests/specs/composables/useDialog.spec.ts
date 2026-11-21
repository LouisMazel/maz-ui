import { useDialog } from '@composables/useDialog.ts'
import { DialogHandler } from '@plugins/dialog/DialogHandler.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { createApp } from 'vue'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

describe('given useDialog composable', () => {
  describe('when a dialog handler is provided by the deprecated DialogPlugin', () => {
    it('then it returns the provided handler', () => {
      const mockDialogHandler = {
        open: vi.fn(),
        confirm: vi.fn(),
      }

      const [result] = withSetup(() => useDialog(), {
        mazDialog: mockDialogHandler,
      })

      expect(result).toBe(mockDialogHandler)
    })
  })

  describe('when no plugin is installed', () => {
    describe('when it is called in the setup of a component', () => {
      it('then it returns a dialog handler', () => {
        const [result] = withSetup(() => useDialog())

        expect(result).toBeInstanceOf(DialogHandler)
      })
    })

    describe('when it is called twice in the same app', () => {
      it('then both calls return the same handler', () => {
        const [[first, second]] = withSetup(() => [useDialog(), useDialog()])

        expect(first).toBe(second)
      })
    })

    describe('when it is called in two apps', () => {
      it('then each app has its own handler', () => {
        const [first] = withSetup(() => useDialog())
        const [second] = withSetup(() => useDialog())

        expect(first).not.toBe(second)
      })
    })

    describe('when it is called outside of an injection context', () => {
      it('then it throws an error', () => {
        expect(() => useDialog()).toThrow('[maz-ui](useDialog) no Vue app found')
      })
    })
  })

  describe('when the MazUi plugin gives the global options', () => {
    describe('when it is called in an injection context without component', () => {
      it('then the handler uses the dialog options of the plugin', () => {
        const app = createApp({ template: '<div />' })
        const dialogOptions = { acceptText: 'Yes' }
        app.provide(MAZ_UI_CONTEXT_INJECTION_KEY, { app, dialog: dialogOptions })

        const dialog = app.runWithContext(() => useDialog())

        expect(dialog.globalOptions).toBe(dialogOptions)
      })
    })
  })

  describe('when the app has neither the MazUi plugin nor a component instance', () => {
    describe('when it is called in app.runWithContext', () => {
      it('then it throws an error', () => {
        const app = createApp({ template: '<div />' })

        expect(() => app.runWithContext(() => useDialog())).toThrow('install the MazUi plugin')
      })
    })
  })
})
