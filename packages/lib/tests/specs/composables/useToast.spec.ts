import { useToast } from '@composables/useToast'
import { withSetup } from '@tests/helpers/withSetup'

describe('given useToast composable', () => {
  describe('when toast plugin is installed', () => {
    it('then it should return toast methods', () => {
      const mockToastHandler = {
        message: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
      }

      const [toast] = withSetup(() => useToast(), {
        mazToast: mockToastHandler,
      })

      expect(toast.message).toBeDefined()
      expect(toast.success).toBeDefined()
      expect(toast.error).toBeDefined()
      expect(toast.info).toBeDefined()
      expect(toast.warning).toBeDefined()
    })
  })

  describe('when toast methods are called', () => {
    it('then it should call the underlying toast handler methods', () => {
      const mockToastHandler = {
        message: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
      }

      const [toast] = withSetup(() => useToast(), {
        mazToast: mockToastHandler,
      })

      toast.message('Test message')
      expect(mockToastHandler.message).toHaveBeenCalledWith('Test message')

      toast.success('Success message')
      expect(mockToastHandler.success).toHaveBeenCalledWith('Success message')

      toast.error('Error message')
      expect(mockToastHandler.error).toHaveBeenCalledWith('Error message')

      toast.info('Info message')
      expect(mockToastHandler.info).toHaveBeenCalledWith('Info message')

      toast.warning('Warning message')
      expect(mockToastHandler.warning).toHaveBeenCalledWith('Warning message')
    })
  })

  describe('when toast plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        withSetup(() => useToast())
      }).toThrow('[maz-ui](useToast) ToastPlugin is not installed')
    })
  })

  describe('when toast methods are bound correctly', () => {
    it('then it should maintain proper this context', () => {
      const mockToastHandler = {
        message: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
      }

      const [toast] = withSetup(() => useToast(), {
        mazToast: mockToastHandler,
      })

      // Extract method reference and call it
      const { message } = toast
      message('Test message')

      expect(mockToastHandler.message).toHaveBeenCalledWith('Test message')
    })
  })
})
