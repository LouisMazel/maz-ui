<script lang="ts" setup>
import type { ToasterButton, ToasterOptions } from './types'
import { MazArrowTopRightOnSquare, MazCheckCircle, MazExclamationCircle, MazExclamationTriangle, MazInformationCircle, MazLink, MazXMark } from '@maz-ui/icons'
import { computed, onMounted, ref, watch } from 'vue'
import MazBtn from '../../components/MazBtn.vue'
import { useTimer } from '../../composables/useTimer'

const {
  position = 'bottom-right',
  maxToasts = false,
  timeout = 10_000,
  type = 'info',
  message,
  icon = true,
  queue,
  pauseOnHover = true,
  persistent,
  destroy,
  button,
  buttons,
  html = false,
} = defineProps<MazToastProps>()

const emits = defineEmits<{
  close: []
  click: [Event]
  open: []
}>()

const Toaster = ref<HTMLDivElement>()

const internalButtons = computed<ToasterButton[]>(() => {
  const buttonArray: ToasterButton[] = []

  if (button) {
    buttonArray.push(button)
  }

  if (buttons) {
    buttonArray.push(...buttons)
  }

  return buttonArray
})

export interface MazToastProps extends ToasterOptions {
  /**
   * The message of the toast
   */
  message?: string
  /**
   * The type of the toast
   */
  type?: ToasterOptions['type']
  /**
   * The function to destroy the toast
   */
  destroy?: () => void
}

const iconComponent = computed(() => {
  if (!icon)
    return undefined

  switch (type) {
    case 'danger': {
      return MazExclamationTriangle
    }
    case 'info': {
      return MazInformationCircle
    }
    case 'success': {
      return MazCheckCircle
    }
    case 'warning': {
      return MazExclamationCircle
    }
    default: {
      return undefined
    }
  }
})

const positionY = computed(() => (position.includes('top') ? 'top' : 'bottom'))
const positionX = computed(() => {
  if (position.includes('left'))
    return 'left'
  if (position.includes('right'))
    return 'right'
  return 'center'
})

const transitionName = computed(() => {
  if (positionX.value !== 'center') {
    return positionX.value === 'right' ? 'm-slide-right' : 'm-slide-left'
  }
  return positionY.value === 'top' ? 'm-slide-top' : 'm-slide-bottom'
})

// const actionLoading = ref(false)
const isActive = ref(false)
const queueTimer = ref<ReturnType<typeof setTimeout>>()

const containerClassName = `m-toast-container m-reset-css --${positionY.value} --${positionX.value}`
const selectorContainerClass = `.${containerClassName.replaceAll(' ', '.')}`

const timer = useTimer({
  callback: closeToast,
  timeout: typeof timeout === 'number' ? timeout : 0,
  callbackOffsetTime: 200,
})

function createParents() {
  const container = document.querySelector(selectorContainerClass)

  if (container)
    return

  if (!container) {
    const body = document.body
    const toCreate = document.createElement('div')
    toCreate.className = containerClassName
    body.append(toCreate)
  }
}

function shouldQueue() {
  const container = document.querySelector(selectorContainerClass)

  if (!queue && maxToasts === false) {
    return false
  }

  if (typeof maxToasts === 'number' && container) {
    return maxToasts <= container.childElementCount
  }

  return container && container.childElementCount > 0
}

function showNotice() {
  if (shouldQueue()) {
    queueTimer.value = setTimeout(showNotice, 250)
    return
  }

  const container = document.querySelector(selectorContainerClass)

  if (Toaster.value && container) {
    container.prepend(Toaster.value)
  }

  isActive.value = true

  if (typeof timeout === 'number' && timeout > 0 && !persistent) {
    timer.start()
  }
}

const progressBarWidth = ref<string>('100%')

function getProgressBarColor() {
  switch (type) {
    case 'danger': {
      return 'maz-bg-danger-700'
    }
    case 'info': {
      return 'maz-bg-info-700'
    }
    case 'success': {
      return 'maz-bg-success-700'
    }
    case 'warning': {
      return 'maz-bg-warning-700'
    }
    default: {
      return 'maz-bg-theme'
    }
  }
}

watch(
  timer.remainingTime,
  (remainingTime) => {
    if (typeof timeout === 'number') {
      const percent = (100 * remainingTime) / timeout
      progressBarWidth.value = `${percent}%`
    }
  },
)

function click(event: Event, shouldClose: boolean = true) {
  emits('click', event)

  if (!shouldClose) {
    return
  }

  closeToast()
}
const isActionLoading = ref(false)
async function onButtonClick(button: ToasterButton, event: Event) {
  if (button.onClick) {
    isActionLoading.value = true
    timer.reset()
    await button.onClick()
    isActionLoading.value = false
  }

  click(event, button.closeToast ?? false)
}

function toggleTimer(shouldPause: boolean) {
  if (!pauseOnHover || persistent) {
    return
  }

  if (shouldPause) {
    timer.pause()
  }
  else {
    timer.resume()
  }
}

function stopTimer() {
  timer.stop()
  if (queueTimer.value) {
    clearTimeout(queueTimer.value)
  }
}

function closeToast() {
  stopTimer()
  isActive.value = false
}

function onAnimationEnter() {
  emits('open')
}

function onAnimationLeave() {
  emits('close')
  Toaster.value?.remove()
  destroy?.()

  const container = document.querySelector(selectorContainerClass)
  if (container && !container?.hasChildNodes()) {
    container.remove()
  }
}

function getButtonRightIcon(button: ToasterButton) {
  if (!button.to && !button.href) {
    return undefined
  }

  if (button.target === '_blank') {
    return MazArrowTopRightOnSquare
  }
  return MazLink
}

defineExpose({ closeToast })

onMounted(() => {
  createParents()
  showNotice()
})
</script>

<template>
  <Transition
    :name="transitionName"
    appear
    @after-leave="onAnimationLeave"
    @after-enter="onAnimationEnter"
  >
    <div
      v-show="isActive" ref="Toaster" class="m-toast m-reset-css" :class="[
        `--${type}`,
        `--${positionY}`,
        `--${positionX}`,
        { '--persistent': persistent },
      ]"
    >
      <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
      <button
        role="alert"
        class="m-toast__button"
        @mouseover="toggleTimer(true)"
        @mouseleave="toggleTimer(false)"
        @touchstart="toggleTimer(true)"
        @touchend="toggleTimer(false)"
        @click.stop="click($event)"
      >
        <Component :is="iconComponent" v-if="iconComponent" class="maz-text-2xl" />

        <div class="m-toast__message" v-text="html ? undefined : message" v-html="html ? message : undefined" />

        <template v-for="(_button, index) in internalButtons" :key="index">
          <MazBtn
            v-bind="_button"
            :loading="isActionLoading || _button.loading"
            :right-icon="getButtonRightIcon(_button)"
            @click.stop="onButtonClick(_button, $event)"
          />
        </template>

        <div
          v-if="typeof timeout === 'number' && timeout > 0 && !persistent"
          class="m-toast__progress-bar"
        >
          <div
            :style="{
              width: progressBarWidth,
            }"
            class="m-toast__progress-bar-inner"
            :class="getProgressBarColor()"
          />
        </div>
      </button>
      <!-- eslint-enable vuejs-accessibility/mouse-events-have-key-events -->
      <button class="m-toast__close" @click.stop="click($event)">
        <MazXMark class="m-toast__close-icon" />
      </button>
    </div>
  </Transition>
</template>

<style lang="postcss">
.m-toast-container {
  @apply maz-fixed maz-flex maz-flex-col maz-gap-2 maz-p-4;

  z-index: 1051;

  &.--top {
    @apply maz-top-0 maz-flex;
  }

  &.--center {
    @apply maz-w-full tab-m:maz-fixed tab-m:maz-left-2/4 tab-m:maz-w-auto;

    @screen tab-m {
      transform: translate(-50%, 0);
    }
  }

  &.--bottom {
    @apply maz-bottom-0 maz-flex maz-flex-col-reverse;
  }

  &.--right {
    @apply maz-right-0 maz-w-full tab-m:maz-w-auto;
  }

  &.--left {
    @apply maz-left-0 maz-w-full tab-m:maz-w-auto;
  }
}
</style>

<style lang="postcss" scoped>
.m-toast {
  box-sizing: border-box;

  & * {
    box-sizing: border-box;
  }

  @apply maz-relative maz-z-10;

  &.--left {
    & .m-toast__close {
      @apply -maz-right-2;
    }
  }

  &.--right {
    & .m-toast__close {
      @apply -maz-left-2;
    }
  }

  &.--center {
    & .m-toast__close {
      @apply -maz-left-2;
    }

    & .m-toast__button {
      @apply tab-m:maz-w-[22rem] tab-m:maz-justify-center;
    }
  }

  &.--left,
  &.--right {
    & .m-toast__button {
      @apply tab-m:maz-w-[22rem];
    }
  }

  &__message {
    @apply maz-m-0 maz-text-start maz-font-medium maz-flex-1 maz-py-3 maz-text-sm;
  }

  &__button {
    @apply maz-relative maz-flex maz-w-full maz-items-center maz-gap-1 maz-self-center maz-rounded maz-pl-2 maz-pr-2 maz-shadow-md maz-transition maz-duration-300 maz-ease-in-out maz-overflow-hidden maz-border maz-backdrop-blur-lg;
  }

  &__close {
    @apply maz-flex maz-rounded-full maz-p-0.5 maz-flex-center maz-absolute maz-border -maz-top-2 maz-backdrop-blur-lg;

    &__close-icon {
      @apply maz-cursor-pointer;
    }
  }

  &.--info {
    .m-toast__button {
      @apply maz-bg-info-alpha-10 maz-text-info-600 dark:maz-text-info-600 maz-border-info-alpha-20 hover:maz-bg-info-alpha-20;
    }

    & .m-toast__close {
      @apply maz-bg-info-alpha-10 maz-border-info-alpha-20 maz-text-info-600 dark:maz-text-info-600 hover:maz-bg-info-alpha-20 hover:maz-text-info-700;
    }
  }

  &.--success {
    .m-toast__button {
      @apply maz-bg-success-alpha-10 maz-text-success-600 dark:maz-text-success-600 maz-border-success-alpha-20 hover:maz-bg-success-alpha-20;
    }

    & .m-toast__close {
      @apply maz-bg-success-alpha-10 maz-border-success-alpha-20 maz-text-success-600 dark:maz-text-success-600 hover:maz-bg-success-alpha-20 hover:maz-text-success-700;
    }
  }

  &.--warning {
    .m-toast__button {
      @apply maz-bg-warning-alpha-10 maz-text-warning-600 dark:maz-text-warning-600 maz-border-warning-alpha-20 hover:maz-bg-warning-alpha-20;
    }

    & .m-toast__close {
      @apply maz-bg-warning-alpha-10 maz-border-warning-alpha-20 maz-text-warning-600 dark:maz-text-warning-600 hover:maz-bg-warning-alpha-20 hover:maz-text-warning-700;
    }
  }

  &.--danger {
    .m-toast__button {
      @apply maz-bg-danger-alpha-10 maz-text-danger-600 dark:maz-text-danger-600 maz-border-danger-alpha-20 hover:maz-bg-danger-alpha-20;
    }

    & .m-toast__close {
      @apply maz-bg-danger-alpha-10 maz-border-danger-alpha-20 maz-text-danger-600 dark:maz-text-danger-600 hover:maz-bg-danger-alpha-20 hover:maz-text-danger-700;
    }
  }

  &.--theme {
    .m-toast__button {
      @apply maz-bg-color maz-text-normal maz-border-neutral-600/20 dark:maz-border-neutral-600/50 hover:maz-bg-neutral-600/20;
    }

    & .m-toast__close {
      @apply maz-bg-color maz-text-normal hover:maz-bg-neutral-600/20 maz-border-neutral-600/50 dark:maz-border-neutral-600/50;
    }
  }

  & .m-toast__progress-bar {
    @apply maz-absolute maz-inset-x-0 maz-bottom-[0px] maz-h-[1px];

    & .m-toast__progress-bar-inner {
      @apply maz-h-full maz-transition-all maz-duration-200 maz-ease-linear;
    }
  }
}

.m-slide-top-enter-active,
.m-slide-top-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: scale(1) translateY(0);
}

.m-slide-top-enter-from,
.m-slide-top-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(-100%);
}

.m-slide-bottom-enter-active,
.m-slide-bottom-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: scale(1) translateY(0);
}

.m-slide-bottom-enter-from,
.m-slide-bottom-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(100%);
}

.m-slide-right-enter-active,
.m-slide-right-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: scale(1) translateX(0);
}

.m-slide-right-enter-from,
.m-slide-right-leave-to {
  opacity: 0;
  transform: scale(0.6) translateX(100%);
}

.m-slide-left-enter-active,
.m-slide-left-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: scale(1) translateX(0);
}

.m-slide-left-enter-from,
.m-slide-left-leave-to {
  opacity: 0;
  z-index: 0;
  transform: scale(0.6) translateX(-200%);
}
</style>
