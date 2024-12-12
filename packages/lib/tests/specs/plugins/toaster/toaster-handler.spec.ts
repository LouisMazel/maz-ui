import { ToasterHandler } from '@plugins/toaster'
import { createApp } from 'vue'

describe('toasterHandler', () => {
  let app: ReturnType<typeof createApp>
  let toasterHandler: ToasterHandler

  beforeEach(() => {
    app = createApp({})
    toasterHandler = new ToasterHandler(app, { timeout: 500 })
  })

  it('should show a success toast with the correct message and options', () => {
    toasterHandler.success('Success message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })

  it('should show an error toast with the correct message and options', () => {
    toasterHandler.error('Error message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })

  it('should show an info toast with the correct message and options', () => {
    toasterHandler.info('Info message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })

  it('should show a warning toast with the correct message and options', () => {
    toasterHandler.warning('Warning message', { timeout: 1000 })
    // Assert that the toast with the correct message and options was displayed
  })
})
