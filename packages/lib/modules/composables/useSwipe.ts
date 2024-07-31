import { ref } from 'vue'
import { Swipe, type SwipeOptions } from '../helpers/swipe-handler'

export function useSwipe(options: Omit<SwipeOptions, 'onValuesChanged'>) {
  const xDiff = ref<number>()
  const yDiff = ref<number>()
  const xStart = ref<number>()
  const xEnd = ref<number>()
  const yStart = ref<number>()
  const yEnd = ref<number>()

  const swiper = new Swipe({
    ...options,
    element: options.element,
    onValuesChanged(values) {
      xDiff.value = values.xDiff
      yDiff.value = values.yDiff
      xStart.value = values.xStart
      xEnd.value = values.xEnd
      yStart.value = values.yStart
      yEnd.value = values.yEnd
    },
  })

  return {
    xDiff,
    yDiff,
    xStart,
    xEnd,
    yStart,
    yEnd,
    start: swiper.start,
    stop: swiper.stop,
  }
}
