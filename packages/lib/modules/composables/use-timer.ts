import { ref } from 'vue'

export interface TimerOptions {
  timeout: number
  callback?: () => unknown
  remainingTimeUpdate?: number
}

export const useTimer = ({ timeout, callback, remainingTimeUpdate = 200 }: TimerOptions) => {
  const remainingTime = ref(timeout)

  let timerId: ReturnType<typeof setInterval> | undefined

  function start() {
    remainingTime.value = timeout

    startInterval()
  }

  function startInterval() {
    if (!timerId) {
      timerId = setInterval(() => {
        remainingTime.value -= remainingTimeUpdate
        if (remainingTime.value <= 0) {
          stop()
          callback?.()
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
    remainingTime.value = timeout
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
