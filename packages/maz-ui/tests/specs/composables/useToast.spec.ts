import { useToast } from '@composables/useToast.ts'
import { ToastHandler } from '@plugins/toast/ToastHandler.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { createApp } from 'vue'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

function createMockToastHandler() {
  return {
    message: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    accent: vi.fn(),
  }
}

describe('given useToast composable', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when a toast handler is provided by the deprecated ToastPlugin', () => {
    it('then it calls the methods of the provided handler', () => {
      const mockToastHandler = createMockToastHandler()

      const [toast] = withSetup(() => useToast(), {
        mazToast: mockToastHandler,
      })

      toast.message('Test message')
      toast.success('Success message')
      toast.error('Error message')
      toast.info('Info message')
      toast.warning('Warning message')
      toast.accent('Accent message')

      expect(mockToastHandler.message).toHaveBeenCalledWith('Test message')
      expect(mockToastHandler.success).toHaveBeenCalledWith('Success message')
      expect(mockToastHandler.error).toHaveBeenCalledWith('Error message')
      expect(mockToastHandler.info).toHaveBeenCalledWith('Info message')
      expect(mockToastHandler.warning).toHaveBeenCalledWith('Warning message')
      expect(mockToastHandler.accent).toHaveBeenCalledWith('Accent message')
    })
  })

  describe('when no plugin is installed', () => {
    describe('when it is called in the setup of a component', () => {
      it('then it shows the toasts with a handler of the app', () => {
        const success = vi.spyOn(ToastHandler.prototype, 'success').mockReturnValue({ destroy: vi.fn(), close: vi.fn() })

        const [toast] = withSetup(() => useToast())
        const { success: showSuccess } = toast
        showSuccess('Saved')

        expect(success).toHaveBeenCalledWith('Saved')
      })
    })

    describe('when it is called twice in the same app', () => {
      it('then both calls share the same handler', () => {
        const info = vi.spyOn(ToastHandler.prototype, 'info').mockReturnValue({ destroy: vi.fn(), close: vi.fn() })

        const [[first, second]] = withSetup(() => [useToast(), useToast()])
        first.info('First')
        second.info('Second')

        expect(info.mock.contexts[0]).toBe(info.mock.contexts[1])
      })
    })

    describe('when it is called outside of an injection context', () => {
      it('then it throws an error', () => {
        expect(() => useToast()).toThrow('[maz-ui](useToast) no Vue app found')
      })
    })
  })

  describe('when the MazUi plugin gives the global options', () => {
    describe('when it is called in an injection context without component', () => {
      it('then the handler uses the app and the toast options of the plugin', () => {
        const warning = vi.spyOn(ToastHandler.prototype, 'warning').mockReturnValue({ destroy: vi.fn(), close: vi.fn() })
        const app = createApp({ template: '<div />' })
        const toastOptions = { position: 'top-right' as const }
        app.provide(MAZ_UI_CONTEXT_INJECTION_KEY, { app, toast: toastOptions })

        const toast = app.runWithContext(() => useToast())
        toast.warning('Careful')

        const handler = warning.mock.contexts[0] as unknown as { app: unknown, globalOptions: unknown }
        expect(handler.app).toBe(app)
        expect(handler.globalOptions).toBe(toastOptions)
      })
    })
  })
})
