import { ToastHandler } from '@plugins/toast'
import { createApp } from 'vue'

describe('toastHandler', () => {
  let app: ReturnType<typeof createApp>
  let toastHandler: ToastHandler

  beforeEach(() => {
    app = createApp({})
    toastHandler = new ToastHandler(app, { timeout: 500 })
  })

  it('should show a success toast with the correct message and options', () => {
    toastHandler.success('Success message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })

  it('should show an error toast with the correct message and options', () => {
    toastHandler.error('Error message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })

  it('should show an info toast with the correct message and options', () => {
    toastHandler.info('Info message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })

  it('should show a warning toast with the correct message and options', () => {
    toastHandler.warning('Warning message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })
})
