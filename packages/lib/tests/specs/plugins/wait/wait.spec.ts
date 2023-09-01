import { createApp } from 'vue'
import { WaitHandler, installWait } from '@modules/plugins'

describe('WaitHandler', () => {
  let app: ReturnType<typeof createApp>
  let waitHandler: WaitHandler

  beforeEach(() => {
    app = createApp({})
    app.use(installWait)
    waitHandler = new WaitHandler()
  })

  test('should start a loader', () => {
    const stop = waitHandler.start('loader1')
    expect(waitHandler.isLoading('loader1')).toBe(true)
    stop()
  })

  test('should stop a loader', () => {
    waitHandler.start('loader1')
    waitHandler.stop('loader1')
    expect(waitHandler.isLoading('loader1')).toBe(false)
  })

  test('should return true for anyLoading if any loader is running', () => {
    waitHandler.start('loader1')
    expect(waitHandler.anyLoading.value).toBe(true)
  })

  test('should return false for anyLoading if no loader is running', () => {
    expect(waitHandler.anyLoading.value).toBe(false)
  })
})
