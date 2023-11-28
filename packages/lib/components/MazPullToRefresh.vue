<template>
  <div class="m-pull-to-refresh" :class="{ '--available': pull.available || pullHeight > 10 }">
    <div class="loading-header" :style="{ height: pullHeight + 'px' }">
      <div v-if="!pull.available" class="header-text">
        <slot name="pull-before">
          <span>Pull to refresh</span>
        </slot>
      </div>
      <div v-else-if="pull.available && !internalLoading" class="header-text">
        <slot name="pull-ready">
          <span> Release to refresh </span>
        </slot>
      </div>
      <div v-if="internalLoading" class="header-text">
        <slot name="pull-loading">
          <div class="maz-flex maz-flex-col maz-flex-center">
            <MazSpinner color="theme" />
            <span>Loading</span>
          </div>
        </slot>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted, withDefaults } from 'vue'

  const props = withDefaults(
    defineProps<{
      distance?: number
      offset?: number
      action?: () => unknown
      containerSelector?: string
    }>(),
    {
      distance: 100,
      offset: 0,
      action: undefined,
      containerSelector: undefined,
    },
  )

  const emits = defineEmits(['loaded', 'start', 'error', 'finish', 'response'])

  const touchState = ref<'start' | 'move' | 'end'>('end')

  const margin = ref({
    top: 0,
    bottom: 0,
  })

  const pull = ref<{
    from: number
    to: number
    distance: number
    available: boolean
  }>({
    from: -1,
    to: -1,
    distance: 0,
    available: false,
  })

  const internalLoading = ref(false)

  const container = computed<HTMLElement | undefined>(() => {
    if (typeof document === 'undefined') {
      return
    }

    const element = props.containerSelector
      ? (document.querySelector(props.containerSelector) as HTMLElement)
      : document.body

    if (!element) {
      throw new Error('MazPullToRefresh - container not found')
    }

    return element
  })

  const pullHeight = computed(() => {
    if (touchState.value !== 'move' && touchState.value !== 'end') {
      return 0
    }
    return pull.value.distance > props.distance ? props.distance : pull.value.distance
  })

  function updateView(container: HTMLElement) {
    const { top, height } = container.getBoundingClientRect()

    margin.value = {
      top,
      bottom: window.innerHeight - (height + top + props.offset),
    }
  }

  function setLoading(type: boolean) {
    internalLoading.value = type
  }

  function handleTouchStart(event: TouchEvent) {
    if (internalLoading.value || (margin.value.top < 0 && margin.value.bottom < 0)) {
      return
    }

    const item = event.touches.item(0)

    if (!item) {
      return
    }

    touchState.value = 'start'

    pull.value.from = item.pageY
  }

  function handleTouchMove(event: TouchEvent) {
    if (internalLoading.value || pull.value.from < 0 || window.scrollY > 0) {
      return
    }

    const item = event.touches.item(0)

    if (!item) {
      return
    }

    pull.value.to = item.pageY
    const distance = pull.value.to - pull.value.from

    pull.value.distance = distance > 0 ? distance : 0
    pull.value.available = pull.value.distance >= props.distance
    touchState.value = 'move'
  }

  function handleTouchEnd() {
    if (
      (pullHeight.value === props.distance && touchState.value === 'move') ||
      window.scrollY < 0
    ) {
      runAction()
    } else {
      resetPull()
    }

    touchState.value = 'end'
  }

  function resetPull() {
    pull.value = {
      from: -1,
      to: -1,
      distance: 0,
      available: false,
    }
  }

  async function runAction() {
    try {
      setLoading(true)
      emits('start')
      const response = await props.action?.()
      emits('loaded')
      emits('response', response)
    } catch (error) {
      emits('error', error)
      throw error
    } finally {
      resetPull()
      setLoading(false)
      emits('finish')
    }
  }

  onMounted(() => {
    if (container.value) {
      container.value.addEventListener('touchstart', handleTouchStart, { passive: true })
      container.value.addEventListener('touchmove', handleTouchMove, { passive: true })
      container.value.addEventListener('touchend', handleTouchEnd, { passive: true })
      updateView(container.value)
    }
  })

  onUnmounted(() => {
    container.value?.removeEventListener('touchstart', handleTouchStart)
    container.value?.removeEventListener('touchmove', handleTouchMove)
    container.value?.removeEventListener('touchend', handleTouchEnd)
  })
</script>

<style lang="postcss" scoped>
  .m-pull-to-refresh {
    .loading-header,
    .loading-footer {
      @apply maz-relative maz-flex maz-w-full maz-text-center maz-text-[0.8em] maz-flex-center;

      .header-text {
        @apply maz-absolute maz-flex maz-w-full maz-flex-center;
      }
    }

    &:not(.--available) {
      .header-text {
        @apply maz-bottom-2;
      }
    }
  }
</style>
