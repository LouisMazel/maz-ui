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

  it('should pause and resume the timer correctly', async () => {
    let pauseFn: (() => void) | undefined
    let resumeFn: (() => void) | undefined
    let remainingTimeRef: { value: number } | undefined

    const wrapper = mount({
      template: '<div></div>',
      setup() {
        const { start, pause, resume, remainingTime } = useTimer({ timeout: 1000 })
        pauseFn = pause
        resumeFn = resume
        remainingTimeRef = remainingTime
        start()

        return {}
      },
    })

    // Wait for timer to start
    await new Promise(resolve => setTimeout(resolve, 100))

    // Pause the timer
    pauseFn?.()

    // Wait while paused
    await new Promise(resolve => setTimeout(resolve, 300))

    // Resume and check if the remaining time is still decreasing
    resumeFn?.()

    // Wait for the timeout to complete
    await new Promise(resolve => setTimeout(resolve, 400))

    // The timer should have been paused for 300ms, so remaining time should be less than initial 1000ms but more than 0
    expect(remainingTimeRef?.value).toBeLessThan(1000)
    expect(remainingTimeRef?.value).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('should stop the timer', async () => {
    let stopFn: (() => void) | undefined
    let remainingTimeRef: { value: number } | undefined

    const wrapper = mount({
      template: '<div></div>',
      setup() {
        const { start, stop, remainingTime } = useTimer({ timeout: 1000 })
        stopFn = stop
        remainingTimeRef = remainingTime
        start()

        return {}
      },
    })

    // Wait for a short duration
    await new Promise(resolve => setTimeout(resolve, 300))

    // Stop and check if the remaining time is the initial timeout
    stopFn?.()

    // Wait for the initial timeout duration
    await new Promise(resolve => setTimeout(resolve, 800))

    // Ensure the callback is not triggered, and the remaining time is the initial timeout
    expect(remainingTimeRef?.value).toBe(1000)
    wrapper.unmount()
  })
})
