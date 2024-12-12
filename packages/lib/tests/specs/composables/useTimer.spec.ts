import { useTimer } from '@composables/useTimer'
import { mount } from '@vue/test-utils'

describe('useTimer', () => {
  it('should start and trigger callback when timeout is reached', async () => {
    const callbackMock = vi.fn()
    const wrapper = mount({
      template: '<div></div>',
      setup() {
        const { start } = useTimer({ timeout: 1000, callback: callbackMock })
        start()
        return {}
      },
    })

    // Wait for the timeout to complete
    await new Promise(resolve => setTimeout(resolve, 1200))

    expect(callbackMock).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should pause and resume the timer correctly', () => {
    const wrapper = mount({
      template: '<div></div>',
      async setup() {
        const { start, pause, resume, remainingTime } = useTimer({ timeout: 1000 })
        start()

        // Pause after 500 milliseconds
        setTimeout(() => {
          pause()
        }, 500)

        // Wait for a short duration
        await new Promise(resolve => setTimeout(resolve, 300))

        // Resume and check if the remaining time is still decreasing
        resume()

        // Wait for the timeout to complete
        await new Promise(resolve => setTimeout(resolve, 800))

        // Ensure the callback is not triggered (paused during the period)
        expect(remainingTime.value).toBeLessThan(500)
        wrapper.unmount()
      },
    })
  })

  it('should stop the timer', () => {
    const wrapper = mount({
      template: '<div></div>',
      async setup() {
        const { start, stop, remainingTime } = useTimer({ timeout: 1000 })
        start()

        // Wait for a short duration
        await new Promise(resolve => setTimeout(resolve, 300))

        // Stop and check if the remaining time is the initial timeout
        stop()

        // Wait for the initial timeout duration
        await new Promise(resolve => setTimeout(resolve, 800))

        // Ensure the callback is not triggered, and the remaining time is the initial timeout
        expect(remainingTime.value).toBe(1000)
        wrapper.unmount()
      },
    })
  })
})
