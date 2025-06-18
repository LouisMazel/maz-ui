<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { MazChevronLeft, MazXMark } from '@maz-ui/icons'
import { checkAvailability } from '@maz-ui/utils/src/utils/checkAvailability.js'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import MazSpinner from '../../components/MazSpinner.vue'

const props = withDefaults(defineProps<MazFullscreenImgProps>(), {
  zoom: true,
  offset: undefined,
  destroy: undefined,
  alt: undefined,
  animation: () => ({
    duration: 300,
    easing: 'ease-in-out',
  }),
  clickedElementBounds: undefined,
  openInstanceClass: 'm-fullscreen-img-instance',
})

const emits = defineEmits(['close', 'previous', 'next', 'before-close'])

export interface MazFullscreenImgProps {
  src: string
  clickedElementBounds?: {
    top: number
    left: number
    height: number
    width: number
  }
  offset?: number
  animation?: {
    duration?: number
    easing?: string
  }
  openInstanceClass?: string
  clickedElement: HTMLElement
  destroy?: () => void
  alt?: string | null
  zoom?: boolean
}

const imageLoaded = ref(false)
const showLoader = ref(false)
const loadedOnce = ref(false)
const hasMultipleInstances = ref(false)
const isZoomed = ref(false)
const animationState = reactive({
  running: false,
  ended: false,
})

const currentClickedElement = ref(props.clickedElement)
const currentClickedElementBounds = computed(() => props.clickedElement.getBoundingClientRect())
const isLandscapeImage = ref()

const currentSrc = ref(props.src)
const currentAlt = ref<string | null | undefined>(props.alt)

const FullscreenImgElement = ref<HTMLDivElement>()
const ImgElement = ref<HTMLImageElement>()
const hideImage = ref(true)

const imageZoomClasses = computed<HTMLAttributes['class']>(() => {
  return {
    '--is-zoomed': isZoomed.value,
    '--invisible': hideImage.value,
    '--absolute': !isZoomed.value,
  }
})

function onImageLoaded() {
  if (ImgElement.value) {
    isLandscapeImage.value = ImgElement.value?.naturalWidth > ImgElement.value?.naturalHeight
  }

  imageLoaded.value = true
  showLoader.value = false
  loadedOnce.value = true
}

watch(
  loadedOnce,
  (value) => {
    if (value) {
      openFullscreen()
    }
  },
  { immediate: true },
)

function close() {
  emits('before-close')
  closeFullscreen()
}

function keydownLister(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    nextPreviousImage(e.key === 'ArrowRight' ? 'next' : 'previous')
  }
}

function addClassToDocument() {
  document.documentElement.classList.add('--m-fullscreen-open')
}

function removeClassFromDocument() {
  document.documentElement.classList.remove('--m-fullscreen-open')
}

function getAllInstances(): HTMLElement[] {
  return [...document.querySelectorAll('.m-fullscreen-img-instance')] as HTMLElement[]
}

function getNewInstanceIndex(allInstances: HTMLElement[], newInstanceIndex: number): number {
  if (newInstanceIndex < 0) {
    return allInstances.length - 1
  }
  if (newInstanceIndex >= allInstances.length) {
    return 0
  }
  return newInstanceIndex
}

function useNextInstance(currentInstance: HTMLElement, nextInstance: HTMLElement) {
  currentInstance.classList.remove(props.openInstanceClass)
  nextInstance.classList.add(props.openInstanceClass)

  const src: string | null = nextInstance.getAttribute('data-src')
  const alt: string | null = nextInstance.getAttribute('data-alt')

  currentAlt.value = alt
  currentSrc.value = src ?? currentSrc.value
}

function nextPreviousImage(which: 'next' | 'previous'): void {
  hideImage.value = true

  const currentInstance: HTMLElement | null = document.querySelector(
    `.m-fullscreen-img-instance.${props.openInstanceClass}`,
  )

  if (currentInstance) {
    const allInstances = getAllInstances()
    const currentInstanceIndex = allInstances.indexOf(currentInstance)
    const newInstanceIndex
        = which === 'next' ? currentInstanceIndex + 1 : currentInstanceIndex - 1

    const nextInstance = allInstances[getNewInstanceIndex(allInstances, newInstanceIndex)]
    currentClickedElement.value = nextInstance

    if (nextInstance) {
      useNextInstance(currentInstance, nextInstance)
    }

    emits(which)

    imageLoaded.value = false
    showLoader.value = true

    checkAvailability(() => imageLoaded.value === true, () => {
      hideImage.value = false
      if (isZoomed.value) {
        setZoomStyles()
      }
      else {
        setEndAnimationStyles()
      }
    }, {
      expectedValue: true,
      interval: 100,
      maxAttempts: 50,
    })
  }
}

function setZoomStyles() {
  const imgElement = ImgElement.value

  if (!imgElement) {
    console.error('[maz-ui](vFullscreenImg) ImgElement is not defined')
    return
  }

  imgElement.style.removeProperty('max-width')
  imgElement.style.removeProperty('max-height')
  imgElement?.style.removeProperty('top')
  imgElement?.style.removeProperty('left')

  if (!isLandscapeImage.value) {
    imgElement.style.width = `100vw`
    imgElement.style.removeProperty('height')
  }
  else {
    imgElement.style.height = `100vh`
    imgElement.style.removeProperty('width')
  }
}

function toggleZoom() {
  if (isZoomed.value) {
    isZoomed.value = !isZoomed.value
    setEndAnimationStyles()
  }
  else {
    isZoomed.value = !isZoomed.value
    setZoomStyles()
  }
}

function runAnimation(frames: Keyframe[] | PropertyIndexedKeyframes) {
  animationState.running = true
  hideImage.value = false

  const animation = ImgElement.value?.animate(frames, {
    duration: props.animation.duration,
    easing: props.animation.easing,
  })

  if (!animation) {
    console.error('[maz-ui](vFullscreenImg) animation is not defined')
    animationState.running = false
    animationState.ended = true
    return
  }

  return animation
}

function getPositionsOfClikedElement(offset = props.offset ?? 0) {
  const width = currentClickedElement.value.clientWidth || 1
  const height = currentClickedElement.value.clientHeight || 1

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const scale = Math.min(
    (windowWidth - 2 * offset) / width,
    (windowHeight - 2 * offset) / height,
  )

  const centerX = (windowWidth - width * scale) / 2
  const centerY = (windowHeight - height * scale) / 2

  return {
    centerX,
    centerY,
    width,
    height,
    scale,
  }
}

function getAnimationFrames({ trigger }: { trigger: 'open' | 'close' }) {
  const { width, height, scale, centerX, centerY } = getPositionsOfClikedElement()

  const { top, left, width: clickedElementWidth, height: clickedElementHeight } = currentClickedElementBounds.value

  const frames = [
    {
      top: `${top}px`,
      left: `${left}px`,
      width: `${clickedElementWidth}px`,
      height: `${clickedElementHeight}px`,
      opacity: 0,
    },
    {
      top: `${centerY}px`,
      left: `${centerX}px`,
      width: `${width * scale}px`,
      height: `${height * scale}px`,
      opacity: 1,
    },
  ]

  return {
    frames: trigger === 'open' ? frames : frames.reverse(),
  }
}

function setEndAnimationStyles() {
  const { height, width, scale } = getPositionsOfClikedElement()

  const finalStyles = isLandscapeImage.value
    ? {
        width: `${width * scale}px`,
        maxHeight: `${height * scale}px`,
      }
    : {
        height: `${height * scale}px`,
        maxWidth: `${width * scale}px`,
      }

  if (!ImgElement.value) {
    console.error('[maz-ui](vFullscreenImg) ImgElement is not defined')
    return
  }

  if (isLandscapeImage.value) {
    ImgElement.value.style.removeProperty('height')
    ImgElement.value.style.removeProperty('maxHeight')
  }
  else {
    ImgElement.value.style.removeProperty('width')
    ImgElement.value.style.removeProperty('maxWidth')
  }

  Object.assign(ImgElement.value.style, finalStyles)
}

function openFullscreen() {
  const { frames } = getAnimationFrames({
    trigger: 'open',
  })

  const openAnimation = runAnimation(frames)

  if (!openAnimation) {
    console.error('[maz-ui](vFullscreenImg) open animation is not defined')
    setEndAnimationStyles()
    return
  }

  openAnimation.onfinish = () => {
    setEndAnimationStyles()
    animationState.running = false
    animationState.ended = true
  }
}

function closeFullscreen() {
  const { frames } = getAnimationFrames({
    trigger: 'close',
  })

  const closeAnimation = runAnimation(frames)

  function onFinish() {
    emits('close')
    FullscreenImgElement.value?.remove()
    props.destroy?.()
    animationState.running = false
    animationState.ended = true
  }

  if (!closeAnimation) {
    console.error('[maz-ui](vFullscreenImg) close animation is not defined')
    onFinish()
    return
  }

  closeAnimation.onfinish = onFinish
}

function onResizeWindow() {
  if (!isZoomed.value) {
    setEndAnimationStyles()
  }
}

onMounted(() => {
  showLoader.value = true
  document.addEventListener('keydown', keydownLister)
  window.addEventListener('resize', onResizeWindow)
  addClassToDocument()
  hasMultipleInstances.value = getAllInstances().length > 1
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keydownLister)
  window.removeEventListener('resize', onResizeWindow)
  removeClassFromDocument()
})
</script>

<template>
  <div
    ref="FullscreenImgElement"
    role="button"
    class="m-fullscreen-img m-reset-css"
    tabindex="0"
    @click.stop="close"
    @keypress.esc.prevent="close"
  >
    <button
      v-if="loadedOnce && hasMultipleInstances"
      type="button"
      class="m-fullscreen-btn --next"
      @click.stop="nextPreviousImage('next')"
    >
      <MazChevronLeft class="maz-rotate-180" />
    </button>
    <button
      v-if="loadedOnce && hasMultipleInstances"
      type="button"
      class="m-fullscreen-btn --previous"
      @click.stop="nextPreviousImage('previous')"
    >
      <MazChevronLeft />
    </button>

    <button type="button" class="m-fullscreen-btn --close" @click="close">
      <MazXMark />
    </button>

    <div class="m-fullscreen-img-scroller">
      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
      <img
        ref="ImgElement"
        :src="currentSrc"
        :alt="currentAlt ?? undefined"
        tabindex="0"
        :class="[imageZoomClasses]"
        @load="onImageLoaded"
        @click.stop="zoom && toggleZoom()"
      >

      <MazSpinner v-show="showLoader" class="m-fullscreen-img-loader" />
    </div>
  </div>
</template>

<style lang="postcss">
  html.--m-fullscreen-open {
  @apply maz-h-screen maz-overflow-hidden;
}
</style>

<style lang="postcss" scoped>
  .m-fullscreen-img {
  @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-h-screen maz-w-screen maz-items-center maz-bg-overlay/5 maz-outline-none maz-backdrop-blur;

  .m-fullscreen-img-scroller {
    @apply maz-flex maz-h-screen maz-w-screen maz-overflow-auto maz-flex-center;
  }

  img {
    @apply maz-z-2 maz-outline-none maz-cursor-zoom-in maz-object-center maz-object-contain;

    &.--is-zoomed {
      @apply maz-cursor-zoom-out;
    }

    &.--invisible {
      @apply maz-invisible;
    }

    &.--absolute {
      @apply maz-absolute;
    }
  }

  .m-fullscreen-img-loader {
    @apply maz-absolute maz-text-2xl maz-z-15;
  }

  .m-fullscreen-btn {
    @apply maz-absolute maz-z-15 maz-flex maz-h-20 maz-w-[7%] maz-min-w-[5em] maz-cursor-pointer maz-p-4 maz-transition-colors maz-duration-200;

    svg {
      @apply maz-text-3xl maz-transition-transform maz-duration-300 maz-ease-in-out;
    }

    &:hover {
      svg {
        @apply maz-scale-150;
      }
    }

    &.--close {
      @apply maz-right-0 maz-top-0 maz-items-start maz-justify-end;
    }

    &.--previous {
      @apply maz-left-0 maz-top-1/2 maz-h-screen maz--translate-y-1/2 maz-transform maz-items-center maz-justify-start;
    }

    &.--next {
      @apply maz-right-0 maz-top-1/2 maz-h-screen maz--translate-y-1/2 maz-transform maz-items-center maz-justify-end;
    }
  }
}
</style>
