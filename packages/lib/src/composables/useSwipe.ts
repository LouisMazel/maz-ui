import type { MaybeRef } from 'vue'
import type { SwipeOptions } from '../utils/swipeHandler'
import { computed, ref, toValue } from 'vue'
import { Swipe } from '../utils/swipeHandler'

export function useSwipe(options: Omit<SwipeOptions, 'onValuesChanged' | 'element'> & { element: MaybeRef<HTMLElement> | string | null | undefined }) {
  const xDiff = ref<number>()
  const yDiff = ref<number>()
  const xStart = ref<number>()
  const xEnd = ref<number>()
  const yStart = ref<number>()
  const yEnd = ref<number>()

  const element = computed(() => toValue(options.element))

  const swiper = new Swipe({
    ...options,
    element: element.value,
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
    start: () => {
      if (element.value) {
        swiper.options.element = element.value
        swiper.start()
      }
      else {
        swiper.start()
      }
    },
    stop: swiper.stop,
  }
}
