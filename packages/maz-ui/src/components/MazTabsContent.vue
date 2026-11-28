<script lang="ts" setup>
import type { MazTabsProvide } from './MazTabs.vue'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

const { currentTab, orientation } = useInjectStrict<MazTabsProvide>('maz-tabs')

const rootRef = useTemplateRef<HTMLElement>('rootRef')

const hideOverflow = ref(false)

const allowOverFlow = debounce(() => {
  hideOverflow.value = false
}, 700)

function setOverflowHiddenTemp() {
  hideOverflow.value = true
  allowOverFlow()
}

let animation: Animation | undefined

function readTime(style: CSSStyleDeclaration, name: string, fallback: number) {
  const value = style.getPropertyValue(name).trim()
  const number = Number.parseFloat(value)

  if (Number.isNaN(number))
    return fallback

  return value.endsWith('ms')
    ? number
    : value.endsWith('s')
      ? number * 1000
      : number
}

function stopAnimation() {
  animation?.cancel()
  animation = undefined
}

/** The height of the content follows the height of the panels: the container animates from the old panel to the new one */
async function animateHeight(from: number) {
  const element = rootRef.value

  if (!element || typeof element.animate !== 'function')
    return

  await nextTick()

  const to = element.offsetHeight
  const style = getComputedStyle(element)
  const scale = readTime(style, '--maz-motion-scale', 1)
  const duration = readTime(style, '--maz-motion-normal', 200) * scale

  if (duration < 20)
    return

  const easing = style.getPropertyValue('--maz-easing-out').trim() || 'ease-out'

  animation = element.animate(
    [{ height: `${from}px` }, { height: `${to}px` }],
    { duration, easing },
  )
}

watch(
  currentTab,
  () => {
    const height = rootRef.value?.offsetHeight ?? 0

    setOverflowHiddenTemp()
    stopAnimation()

    if (height > 0)
      animateHeight(height)
  },
  { flush: 'pre', immediate: true },
)

onBeforeUnmount(stopAnimation)
</script>

<template>
  <div
    ref="rootRef"
    class="m-tabs-content m-reset-css maz:relative"
    :class="{ 'maz:overflow-hidden': hideOverflow, 'maz:min-w-0 maz:flex-1': orientation === 'vertical' }"
  >
    <slot />
  </div>
</template>
