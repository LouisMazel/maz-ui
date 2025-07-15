import { useToast } from '@composables/useToast'
import { createApp } from 'vue'

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

      const app = createApp({
        setup() {
          app.provide('mazToast', mockToastHandler)
          const toast = useToast()
          return { toast }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      expect(vm.toast.message).toBeDefined()
      expect(vm.toast.success).toBeDefined()
      expect(vm.toast.error).toBeDefined()
      expect(vm.toast.info).toBeDefined()
      expect(vm.toast.warning).toBeDefined()

      app.unmount()
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

      const app = createApp({
        setup() {
          app.provide('mazToast', mockToastHandler)
          const toast = useToast()
          return { toast }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      vm.toast.message('Test message')
      expect(mockToastHandler.message).toHaveBeenCalledWith('Test message')

      vm.toast.success('Success message')
      expect(mockToastHandler.success).toHaveBeenCalledWith('Success message')

      vm.toast.error('Error message')
      expect(mockToastHandler.error).toHaveBeenCalledWith('Error message')

      vm.toast.info('Info message')
      expect(mockToastHandler.info).toHaveBeenCalledWith('Info message')

      vm.toast.warning('Warning message')
      expect(mockToastHandler.warning).toHaveBeenCalledWith('Warning message')

      app.unmount()
    })
  })

  describe('when toast plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        useToast()
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

      const app = createApp({
        setup() {
          app.provide('mazToast', mockToastHandler)
          const toast = useToast()
          return { toast }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      // Extract method reference and call it
      const { message } = vm.toast
      message('Test message')

      expect(mockToastHandler.message).toHaveBeenCalledWith('Test message')

      app.unmount()
    })
  })
})
