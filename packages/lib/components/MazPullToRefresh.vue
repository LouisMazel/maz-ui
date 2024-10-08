<script lang="ts" setup>
import type { Color } from './types'
import { computed, defineAsyncComponent, onUnmounted, ref, watch } from 'vue'
import { isClient } from '../modules/helpers/is-client'
import { isInStandaloneMode } from '../modules/helpers/is-standalone-mode'

export type { Color } from './types'

const props = withDefaults(defineProps<Props>(), {
  distance: 100,
  offset: 0,
  action: undefined,
  containerSelector: undefined,
  headerClass: undefined,
  spinnerColor: 'theme',
  disabled: false,
  standaloneMode: false,
})

const emits = defineEmits(['loaded', 'start', 'error', 'finish', 'response'])

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

export interface Props {
  distance?: number
  offset?: number
  action?: () => unknown
  containerSelector?: string
  headerClass?: string
  spinnerColor?: Color
  disabled?: boolean
  standaloneMode?: boolean
}

const isDisabled = computed(
  () =>
    props.disabled
    || props.action === undefined
    || (props.standaloneMode && isClient() && !isInStandaloneMode()),
)

const margin = ref({
  top: 0,
  bottom: 0,
})

const pull = ref<{
  from: number
  to: number
  distance: number
  available: boolean
  state: 'start' | 'move' | 'end'
}>({
  from: -1,
  to: -1,
  distance: 0,
  available: false,
  state: 'end',
})

const internalLoading = ref(false)

const container = computed<HTMLElement | undefined>(() => {
  if (typeof document === 'undefined' || isDisabled.value) {
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
  if ((pull.value.state !== 'move' && pull.value.state !== 'end') || isDisabled.value) {
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
  if (
    internalLoading.value
    || (margin.value.top < 0 && margin.value.bottom < 0)
    || isDisabled.value
  ) {
    return
  }

  const item = event.touches.item(0)

  if (!item) {
    return
  }

  pull.value.state = 'start'
  pull.value.from = item.pageY
}

function handleTouchMove(event: TouchEvent) {
  if (internalLoading.value || pull.value.from < 0 || window.scrollY > 0 || isDisabled.value) {
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
  pull.value.state = 'move'

  // setTimeout(() => {
  //   resetPull()
  // }, 10_000)
}

function handleTouchEnd() {
  if (internalLoading.value || isDisabled.value) {
    return
  }

  if (pullHeight.value === props.distance && pull.value.state === 'move' && window.scrollY <= 0) {
    runAction()
  }
  else {
    resetPull()
  }
}

function resetPull() {
  pull.value = {
    from: -1,
    to: -1,
    distance: 0,
    available: false,
    state: 'end',
  }
}

async function runAction() {
  try {
    setLoading(true)
    emits('start')
    const response = await props.action?.()
    emits('loaded')
    emits('response', response)
  }
  catch (error) {
    emits('error', error)
    throw error
  }
  finally {
    resetPull()
    setLoading(false)
    emits('finish')
  }
}

watch(
  () => isDisabled.value,
  (disabled) => {
    if (disabled === true) {
      removeEvents()
    }
    else {
      initComponentAndEvents()
    }
  },
  { immediate: true },
)

function initComponentAndEvents() {
  if (!container.value || isDisabled.value || document === undefined) {
    return
  }

  container.value.addEventListener('touchstart', handleTouchStart)
  container.value.addEventListener('touchmove', handleTouchMove)
  container.value.addEventListener('touchend', handleTouchEnd)
  updateView(container.value)
}

function removeEvents() {
  if (!container.value || document === undefined) {
    return
  }

  container.value.removeEventListener('touchstart', handleTouchStart)
  container.value.removeEventListener('touchmove', handleTouchMove)
  container.value.removeEventListener('touchend', handleTouchEnd)
}

onUnmounted(() => {
  removeEvents()
})
</script>

<template>
  <div class="m-pull-to-refresh" :class="{ '--available': pull.available || pullHeight > 10 }">
    <div
      v-if="!isDisabled"
      class="loading-header"
      :style="{ height: `${pullHeight}px` }"
      :class="headerClass"
    >
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
            <MazSpinner :color="spinnerColor" size="2.5em" />
          </div>
        </slot>
      </div>
    </div>

    <slot />
  </div>
</template>

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
