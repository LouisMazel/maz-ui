<template>
  <div
    ref="FullscreenImgElement"
    role="button"
    class="m-fullscreen-img"
    tabindex="0"
    @click.stop="close"
    @keypress.esc.prevent="close"
  >
    <MazSpinner v-show="showLoader" class="m-fullscreen-img-loader maz-h-16" />

    <button
      v-if="loadedOnce && hasMultipleInstances"
      type="button"
      class="m-fullscreen-btn --next"
      @click.stop="nextPreviousImage('next')"
    >
      <ChevronLeft class="maz-rotate-180 maz-text-3xl" />
    </button>
    <button
      v-if="loadedOnce && hasMultipleInstances"
      type="button"
      class="m-fullscreen-btn --previous"
      @click.stop="nextPreviousImage('previous')"
    >
      <ChevronLeft class="maz-text-3xl" />
    </button>

    <button type="button" class="m-fullscreen-btn --close" @click="close">
      <XMark class="maz-text-3xl" />
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
        @click.stop="zoom ? toggleZoom() : undefined"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, defineAsyncComponent, onBeforeUnmount, ref, onMounted, watch } from 'vue'

  const emits = defineEmits(['close', 'previous', 'next', 'before-close'])

  const MazSpinner = defineAsyncComponent(() => import('./../../../components/MazSpinner.vue'))
  const XMark = defineAsyncComponent(() => import('./../../../icons/x-mark.svg'))
  const ChevronLeft = defineAsyncComponent(() => import('./../../../icons/chevron-left.svg'))

  export type Props = {
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
    alt?: string
    zoom?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
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

  const imageLoaded = ref(false)
  const showLoader = ref(false)
  const loadedOnce = ref(false)
  const hasMultipleInstances = ref(false)
  const isZoomed = ref(false)

  const currentElement = ref(props.clickedElement)
  const currentElementBounds = computed(() => props.clickedElement.getBoundingClientRect())
  const isLandscapeImage = computed(
    () => currentElementBounds.value.height < currentElementBounds.value.width,
  )

  const currentSrc = ref(props.src)
  const currentAlt = ref<string | null | undefined>(props.alt)

  const FullscreenImgElement = ref<HTMLDivElement>()
  const ImgElement = ref<HTMLImageElement>()

  const imageZoomClasses = computed(() => {
    if (isZoomed.value) {
      return `--is-zoomed maz-cursor-zoom-out`
    }

    return `maz-cursor-zoom-in`
  })

  function onImageLoaded() {
    imageLoaded.value = true
    showLoader.value = false
    loadedOnce.value = true
  }

  watch(
    () => loadedOnce.value,
    (value) => {
      if (value) {
        openFullscreen()
      }
    },
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

    currentAlt.value = alt
    if (src) {
      currentSrc.value = src
    }

    imageLoaded.value = false

    if (!imageLoaded.value) {
      showLoader.value = true
    }
  }

  function nextPreviousImage(which: 'next' | 'previous'): void {
    const currentInstance: HTMLElement | null = document.querySelector(
      `.m-fullscreen-img-instance.${props.openInstanceClass}`,
    )

    if (currentInstance) {
      const allInstances = getAllInstances()
      const currentInstanceIndex = allInstances.indexOf(currentInstance)
      const newInstanceIndex =
        which === 'next' ? currentInstanceIndex + 1 : currentInstanceIndex - 1

      const nextInstance = allInstances[getNewInstanceIndex(allInstances, newInstanceIndex)]
      currentElement.value = nextInstance

      if (nextInstance) {
        useNextInstance(currentInstance, nextInstance)
      }

      emits(which)

      if (isZoomed.value) {
        setZoomStyles(ImgElement.value as HTMLElement)
      } else {
        setEndAnimationStyles()
      }
    }
  }

  function setZoomStyles(imgElement: HTMLElement) {
    if (isLandscapeImage.value) {
      imgElement.style.width = `${window.innerWidth}px`
      imgElement.style.removeProperty('height')
    } else {
      imgElement.style.height = `${window.innerHeight}px`
      imgElement.style.removeProperty('width')
    }

    imgElement.style.removeProperty('top')
    imgElement.style.removeProperty('left')
  }

  async function toggleZoom() {
    const imgElement = ImgElement.value as HTMLImageElement

    if (isZoomed.value) {
      isZoomed.value = !isZoomed.value
      setEndAnimationStyles()
    } else {
      isZoomed.value = !isZoomed.value
      setZoomStyles(imgElement)
    }
  }

  function runAnimation(frames: Keyframe[] | PropertyIndexedKeyframes) {
    return ImgElement.value?.animate(frames, {
      duration: props.animation.duration, // Durée de l'animation en millisecondes
      easing: props.animation.easing, // Fonction d'interpolation pour l'animation inverse
    })
  }

  function getPositions(offset = props.offset ?? 0) {
    const originalWidth =
      currentElement.value instanceof HTMLImageElement
        ? currentElement.value.naturalWidth
        : currentElement.value.clientWidth
    const originalHeight =
      currentElement.value instanceof HTMLImageElement
        ? currentElement.value.naturalHeight
        : currentElement.value.clientHeight

    // Obtenez les dimensions de la fenêtre
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Calculez le facteur d'échelle pour conserver les proportions
    const scale = Math.min(
      (windowWidth - 2 * offset) / originalWidth,
      (windowHeight - 2 * offset) / originalHeight,
    )

    // Calculez les coordonnées pour centrer l'image
    const centerX = (windowWidth - originalWidth * scale) / 2
    const centerY = (windowHeight - originalHeight * scale) / 2

    return {
      originalWidth,
      originalHeight,
      scale,
      centerX,
      centerY,
    }
  }

  function getAnimationFrames({ trigger }: { trigger: 'open' | 'close' }) {
    const { originalWidth, originalHeight, scale, centerX, centerY } = getPositions()

    const { top, left, width, height } = currentElementBounds.value

    const frames = [
      {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        opacity: 0,
      },
      {
        top: `${centerY}px`,
        left: `${centerX}px`,
        width: `${originalWidth * scale}px`,
        height: `${originalHeight * scale}px`,
        opacity: 1,
      },
    ]

    return {
      frames: trigger === 'open' ? frames : frames.reverse(),
    }
  }

  function setEndAnimationStyles() {
    const { centerX, centerY, originalHeight, originalWidth, scale } = getPositions()

    const finalStyles = {
      top: `${centerY}px`,
      left: `${centerX}px`,
      width: `${originalWidth * scale}px`,
      height: `${originalHeight * scale}px`,
    }

    if (!ImgElement.value) {
      throw console.error('[maz-ui](vFullscreenImg) ImgElement is not defined')
    }

    Object.assign(ImgElement.value.style, finalStyles)
  }

  function openFullscreen() {
    const { frames } = getAnimationFrames({
      trigger: 'open',
    })

    // Utilisez la fonction animate pour gérer l'animation avec les nouvelles coordonnées

    const openAnimation = runAnimation(frames)

    // Ajoutez un gestionnaire d'événements pour détecter la fin de l'animation
    if (!openAnimation) {
      throw console.error('[maz-ui](vFullscreenImg) open animation is not defined')
    }

    openAnimation.onfinish = () => {
      setEndAnimationStyles()
    }
  }

  function closeFullscreen() {
    const { frames } = getAnimationFrames({
      trigger: 'close',
    })

    const closeAnimation = runAnimation(frames)

    if (!closeAnimation) {
      throw console.error('[maz-ui](vFullscreenImg) close animation is not defined')
    }

    // Ajoutez un gestionnaire d'événements pour détecter la fin de l'animation inverse
    closeAnimation.onfinish = () => {
      // Retirez l'élément du DOM
      emits('close')
      FullscreenImgElement.value?.remove()
      props.destroy?.()
    }
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

<style lang="postcss">
  html.--m-fullscreen-open {
    @apply maz-h-screen maz-overflow-hidden;
  }
</style>

<style lang="postcss" scoped>
  .m-fullscreen-img {
    @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-h-screen maz-w-screen maz-items-center maz-bg-overlay maz-outline-none maz-backdrop-blur;

    .m-fullscreen-img-scroller {
      @apply maz-flex maz-h-screen maz-w-screen maz-overflow-auto maz-flex-center;
    }

    img {
      @apply maz-fixed maz-z-[1051] maz-select-none maz-object-contain maz-object-center maz-outline-none;
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
</style>
