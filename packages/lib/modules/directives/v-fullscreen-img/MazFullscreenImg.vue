<template>
  <div
    ref="FullscreenImgElement"
    role="button"
    class="m-fullscreen-img"
    tabindex="0"
    :class="{ '--animation-active': animationActive }"
    @click.self="close"
    @keypress.esc.prevent="close"
  >
    <MazSpinner v-show="showLoader" class="m-fullscreen-img-loader maz-h-16" />

    <button
      v-if="loadedOnce && hasMultipleInstances"
      type="button"
      class="m-fullscreen-btn --next"
      @click.stop="nextPreviousImage(true)"
    >
      <ChevronLeft class="maz-rotate-90 maz-text-2xl" />
    </button>
    <button
      v-if="showFullscreenImg && loadedOnce && hasMultipleInstances"
      type="button"
      class="m-fullscreen-btn --previous"
      @click.stop="nextPreviousImage(false)"
    >
      <ChevronLeft class="maz-text-2xl" />
    </button>

    <button type="button" class="m-fullscreen-btn --close" @click="close">
      <XMark class="maz-text-2xl" />
    </button>

    <div class="m-fullscreen-img-scroller">
      <Transition
        :name="hasBasicScaleAnimation ? undefined : 'maz-scale-fade'"
        @before-enter="hasAnimationBasedOnImageClicked && setClikedElementProperties()"
        @enter="hasAnimationBasedOnImageClicked && onAnimationEnter()"
        @after-enter="hasAnimationBasedOnImageClicked && onAnimationEnterFinish()"
        @before-leave="hasAnimationBasedOnImageClicked && onAnimationBeforeLeave()"
        @leave="hasAnimationBasedOnImageClicked && setClikedElementProperties()"
        @after-leave="onAnimationLeaveFinish"
      >
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
        <img
          v-show="showFullscreenImg"
          id="ZvImgElement"
          ref="ImgElement"
          :src="currentSrc"
          :alt="currentAlt"
          tabindex="0"
          :class="[{ zoomable: zoom }, imageZoomClasses]"
          @load="onImageLoaded"
          @click="zoom ? toogleZoom($event) : undefined"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import MazSpinner from './../../../components/MazSpinner.vue'
  import { sleep as delay } from './../../index'
  import { computed } from 'vue'
  import { nextTick } from 'vue'
  import { onMounted, onBeforeUnmount } from 'vue'
  import { ref } from 'vue'
  import XMark from './../../../icons/x-mark.svg'
  import ChevronLeft from './../../../icons/chevron-left.svg'
  import { onBeforeMount } from 'vue'

  const emits = defineEmits(['close', 'previous', 'next', 'before-close'])

  type VueScrollTo = {
    scrollTo: (
      _imgElement: HTMLImageElement,
      _timeout: number,
      paylaod?: { container?: HTMLElement | null; easing: string; offset: number },
    ) => void
  }

  let vueScrollTo: VueScrollTo

  onBeforeMount(async () => {
    vueScrollTo = (await import('vue-scrollto')) as unknown as VueScrollTo
  })

  const props = withDefaults(
    defineProps<{
      destroy?: () => void
      src: string
      alt?: string
      openInstanceClass: string
      zoom?: boolean
      disabled?: boolean
      clickedElementBounds: {
        top: number
        left: number
        height: number
        width: number
      }
      clickedElement: HTMLElement
      animated: boolean
      scaleAnimation?: boolean
    }>(),
    {
      destroy: undefined,
      zoom: true,
      animated: true,
      alt: undefined,
    },
  )

  const showFullscreenImg = ref(false)
  const imageLoaded = ref(false)
  const showLoader = ref(false)
  const loadedOnce = ref(false)
  const hasMultipleInstances = ref(false)
  const isZoomed = ref(false)
  const animationActive = ref(false)

  const isImageElement = ref(props.clickedElement instanceof HTMLImageElement)

  const currentSrc = ref(props.src)
  const currentAlt = ref<string | undefined>(props.alt)

  const FullscreenImgElement = ref<HTMLDivElement>()
  const ImgElement = ref<HTMLImageElement>()

  const hasAnimationBasedOnImageClicked = computed(
    () => isImageElement.value && props.animated && !props.scaleAnimation,
  )
  const hasBasicScaleAnimation = computed(
    () => (isImageElement.value || !props.animated) && !props.scaleAnimation,
  )

  const isLandscapeImage = ref(false)

  const imageZoomClasses = computed(() => {
    if (isZoomed.value) {
      return `--is-zoomed maz-cursor-zoom-in maz-max-w-[none] ${
        isLandscapeImage.value ? 'maz-h-screen maz-w-auto' : 'maz-h-auto maz-w-screen'
      }`
    }

    return `cursor-zoom-out ${
      isLandscapeImage.value
        ? 'maz-w-screen maz-h-screen --is-landscape'
        : 'maz-h-screen maz-w-auto'
    }`
  })

  function onImageLoaded() {
    imageLoaded.value = true
    showLoader.value = false
    loadedOnce.value = true
  }

  function close() {
    emits('before-close')
    showFullscreenImg.value = false
  }

  function keydownLister(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      nextPreviousImage(e.key === 'ArrowRight')
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
    return newInstanceIndex < 0
      ? allInstances.length - 1
      : newInstanceIndex >= allInstances.length
      ? 0
      : newInstanceIndex
  }

  async function useNextInstance(currentInstance: HTMLElement, nextInstance: HTMLElement) {
    currentInstance.classList.remove(props.openInstanceClass)
    nextInstance.classList.add(props.openInstanceClass)

    const src: string | null = nextInstance.getAttribute('data-src')
    const alt: string | null = nextInstance.getAttribute('data-alt')

    currentAlt.value = alt ?? undefined
    if (src) {
      currentSrc.value = src
    }

    imageLoaded.value = false

    await delay(300)

    if (!imageLoaded.value) {
      showLoader.value = true
    }
  }

  function nextPreviousImage(isNext: boolean): void {
    const currentInstance: HTMLElement | null = document.querySelector(
      `.m-fullscreen-img-instance.${props.openInstanceClass}`,
    )

    if (currentInstance) {
      const allInstances = getAllInstances()
      const currentInstanceIndex = allInstances.indexOf(currentInstance)
      const newInstanceIndex = isNext ? currentInstanceIndex + 1 : currentInstanceIndex - 1

      const nextInstance = allInstances[getNewInstanceIndex(allInstances, newInstanceIndex)]

      if (nextInstance) {
        useNextInstance(currentInstance, nextInstance)
      }

      emits(isNext ? 'next' : 'previous')
    }
  }

  async function toogleZoom(event: MouseEvent) {
    const imgElement = event.target as HTMLImageElement

    // The animation needs image sizes to work, so we delete it just after the animation
    imgElement.style.width = `${imgElement.clientWidth}px`
    imgElement.style.height = `${imgElement.clientHeight}px`

    await delay(0)
    isZoomed.value = !isZoomed.value

    imgElement.style.removeProperty('width')
    imgElement.style.removeProperty('height')

    await delay(0)
    const zoomTargetRatio = imgElement.clientWidth / event.clientY
    const height = window.innerWidth / zoomTargetRatio
    const offset = height - window.innerHeight / 2

    vueScrollTo.scrollTo(imgElement, 200, {
      container: imgElement.parentElement,
      easing: 'linear',
      offset: isZoomed.value ? offset : 0,
    })
  }

  onMounted(async () => {
    await nextTick()

    document.addEventListener('keydown', keydownLister)

    showFullscreenImg.value = true
    showLoader.value = true

    addClassToDocument()

    hasMultipleInstances.value = getAllInstances().length > 1

    if (ImgElement.value) {
      isLandscapeImage.value = props.clickedElementBounds.height < props.clickedElementBounds.width
    }
  })

  function setClikedElementProperties() {
    if (ImgElement.value) {
      animationActive.value = true

      ImgElement.value.style.removeProperty('margin-left')
      ImgElement.value.style.removeProperty('margin-right')

      ImgElement.value.style.opacity = '0.5'
      ImgElement.value.style.width = `${props.clickedElementBounds.width}px`
      ImgElement.value.style.height = `${props.clickedElementBounds.height}px`
      ImgElement.value.style.top = `${props.clickedElementBounds.top}px`
      ImgElement.value.style.left = `${props.clickedElementBounds.left}px`
    }
  }

  async function onAnimationEnter() {
    await delay(0)
    if (ImgElement.value) {
      ImgElement.value.style.opacity = '1'
      ImgElement.value.style.removeProperty('height')
      ImgElement.value.style.removeProperty('width')
      ImgElement.value.style.removeProperty('transform')

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const initalElementHeight = props.clickedElementBounds.height
      const initalElementWidth = props.clickedElementBounds.width

      if (isLandscapeImage.value) {
        ImgElement.value.style.left = `0px`

        const imageHeight = (initalElementHeight * windowWidth) / initalElementWidth
        const top = (windowHeight - imageHeight) / 2

        ImgElement.value.style.top = `${top <= 0 ? 0 : top}px`
      } else {
        ImgElement.value.style.top = '0px'

        const imageWidth = (initalElementWidth * windowHeight) / initalElementHeight
        const left = (windowWidth - imageWidth) / 2

        ImgElement.value.style.left = `${left <= 0 ? 0 : left}px`
      }
    }
  }

  function onAnimationEnterFinish() {
    if (ImgElement.value) {
      ImgElement.value.style.removeProperty('top')
      ImgElement.value.style.removeProperty('left')
      ImgElement.value.style.marginLeft = 'auto'
      ImgElement.value.style.marginRight = 'auto'
      ImgElement.value.style.removeProperty('opacity')
    }
    animationActive.value = false
  }

  function onAnimationBeforeLeave() {
    if (ImgElement.value) {
      const { left, top } = ImgElement.value.getBoundingClientRect()
      ImgElement.value.style.left = `${left}px`
      ImgElement.value.style.top = `${top}px`
      ImgElement.value.style.width = `${ImgElement.value.width}px`
      ImgElement.value.style.height = `${ImgElement.value.height}px`
      animationActive.value = true
    }
  }

  function onAnimationLeaveFinish() {
    emits('close')
    FullscreenImgElement.value?.remove()
    props.destroy?.()
  }

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', keydownLister)
    removeClassFromDocument()
  })
</script>

<style lang="postcss">
  html.--m-fullscreen-open {
    @apply maz-h-screen maz-overflow-hidden;
  }
</style>

<style lang="postcss" scoped>
  .m-fullscreen-img {
    @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-h-screen maz-w-screen maz-items-center maz-bg-overlay maz-bg-opacity-80 maz-outline-none maz-backdrop-blur;

    backdrop-filter: blur(3px);

    .m-fullscreen-img-scroller {
      @apply maz-max-h-screen maz-overflow-auto;
    }

    &.--animation-active {
      .m-fullscreen-img-scroller {
        @apply maz-h-screen maz-w-screen;
      }
    }

    &:not(.--animation-active) {
      @apply maz-flex maz-flex-center;
    }

    img {
      @apply maz-relative maz-select-none maz-object-contain maz-object-center maz-outline-none maz-transition-all maz-duration-200 maz-ease-linear;
    }

    .m-fullscreen-img-loader {
      @apply maz-absolute maz-left-1/2 maz-top-1/2 maz-z-10 maz--translate-x-1/2 maz--translate-y-1/2 maz-transform maz-text-6xl;
    }

    .m-fullscreen-btn {
      @apply maz-absolute maz-z-10 maz-flex maz-h-20 maz-w-[7%] maz-min-w-[5em] maz-cursor-pointer maz-p-4 maz-transition-colors maz-duration-200;

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

  .maz-scale-fade-enter-from,
  .maz-scale-fade-leave-to {
    @apply maz-scale-50 maz-opacity-0;
  }

  .maz-scale-fade-enter-active,
  .maz-scale-fade-leave-active {
    transition-property: all;
    transition-duration: 200ms;
  }
</style>
