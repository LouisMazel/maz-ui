import { ref } from 'vue'

export interface TimerOptions {
  /**
   * The time in milliseconds
   * @default 1000
   */
  timeout?: number
  /**
   * The callback to execute when the timer is finished
   * @default undefined
   */
  callback?: () => unknown
  /**
   * The interval to update the remaining time
   * @default 200
   */
  remainingTimeUpdate?: number
  /**
   * The offset time to execute the callback
   * @default 0
   */
  callbackOffsetTime?: number
}

export function useTimer({ timeout = 1000, callback, remainingTimeUpdate = 200, callbackOffsetTime = 0 }: TimerOptions) {
  const internalTimeout = ref<number>(timeout)
  const remainingTime = ref<number>(timeout)

  let timerId: ReturnType<typeof setInterval> | undefined

  function start(timeout?: number) {
    if (typeof timeout === 'number') {
      remainingTime.value = timeout
    }

    if (typeof timeout === 'number') {
      internalTimeout.value = timeout
    }

    startInterval()
  }

  function startInterval() {
    if (!timerId) {
      timerId = setInterval(() => {
        remainingTime.value -= remainingTimeUpdate
        if (remainingTime.value <= 0) {
          stop()
          setTimeout(() => callback?.(), callbackOffsetTime)
        }
      }, remainingTimeUpdate)
    }
  }

  function pause() {
    if (timerId) {
      clearInterval(timerId)
      timerId = undefined
    }
  }

  function resume() {
    if (!timerId && remainingTime.value > 0) {
      startInterval()
    }
  }

  function stop() {
    setTimeout(() => remainingTime.value = internalTimeout.value, callbackOffsetTime * 2)
    pause()
  }

  return {
    remainingTime,
    start,
    pause,
    resume,
    stop,
  }
}
