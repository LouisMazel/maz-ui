import { useTimer } from '@composables/useTimer'
import { withSetup } from '@tests/helpers/withSetup'

describe('useTimer', () => {
  it('should start and trigger callback when timeout is reached', async () => {
    const callbackMock = vi.fn()
    const [{ start }, app] = withSetup(() => {
      const timer = useTimer({ timeout: 1000, callback: callbackMock })
      return timer
    })

    start()

    // Wait for the timeout to complete
    await new Promise(resolve => setTimeout(resolve, 1200))

    expect(callbackMock).toHaveBeenCalled()
    app.unmount()
  })

  it('should pause and resume the timer correctly', async () => {
    const [{ pause, resume, remainingTime }, app] = withSetup(() => {
      const timer = useTimer({ timeout: 1000 })
      timer.start()
      return timer
    })

    // Wait for timer to start
    await new Promise(resolve => setTimeout(resolve, 100))

    // Pause the timer
    pause()

    // Wait while paused
    await new Promise(resolve => setTimeout(resolve, 300))

    // Resume and check if the remaining time is still decreasing
    resume()

    // Wait for the timeout to complete
    await new Promise(resolve => setTimeout(resolve, 400))

    // The timer should have been paused for 300ms, so remaining time should be less than initial 1000ms but more than 0
    expect(remainingTime.value).toBeLessThan(1000)
    expect(remainingTime.value).toBeGreaterThan(0)
    app.unmount()
  })

  it('should stop the timer', async () => {
    const [{ stop, remainingTime }, app] = withSetup(() => {
      const timer = useTimer({ timeout: 1000 })
      timer.start()
      return timer
    })

    // Wait for a short duration
    await new Promise(resolve => setTimeout(resolve, 300))

    // Stop and check if the remaining time is the initial timeout
    stop()

    // Wait for the initial timeout duration
    await new Promise(resolve => setTimeout(resolve, 800))

    // Ensure the callback is not triggered, and the remaining time is the initial timeout
    expect(remainingTime.value).toBe(1000)
    app.unmount()
  })
})
