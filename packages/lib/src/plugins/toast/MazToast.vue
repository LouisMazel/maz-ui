<script lang="ts" setup>
import type { ToastButton, ToastOptions } from './types'
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/lazy/MazArrowTopRightOnSquare'
import { MazCheckCircle } from '@maz-ui/icons/lazy/MazCheckCircle'
import { MazExclamationCircle } from '@maz-ui/icons/lazy/MazExclamationCircle'
import { MazExclamationTriangle } from '@maz-ui/icons/lazy/MazExclamationTriangle'
import { MazInformationCircle } from '@maz-ui/icons/lazy/MazInformationCircle'
import { MazLinkIcon } from '@maz-ui/icons/lazy/MazLinkIcon'
import { MazXMark } from '@maz-ui/icons/lazy/MazXMark'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
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

const MazBtn = defineAsyncComponent(() => import('../../components/MazBtn.vue'))

const Toast = ref<HTMLDivElement>()

const internalButtons = computed<ToastButton[]>(() => {
  const buttonArray: ToastButton[] = []

  if (button) {
    buttonArray.push(button)
  }

  if (buttons) {
    buttonArray.push(...buttons)
  }

  return buttonArray
})

export interface MazToastProps extends ToastOptions {
  /**
   * The message of the toast
   */
  message?: string
  /**
   * The type of the toast
   */
  type?: ToastOptions['type']
  /**
   * The function to destroy the toast
   */
  destroy?: () => void
}

const iconComponent = computed(() => {
  if (!icon)
    return undefined

  switch (type) {
    case 'destructive': {
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

const isActive = ref(false)
const queueTimer = ref<ReturnType<typeof setTimeout>>()

const CONTAINER_POSITION_Y = {
  top: 'maz:top-0 maz:flex',
  bottom: 'maz:bottom-0 maz:flex maz:flex-col-reverse',
} as const

const CONTAINER_POSITION_X = {
  left: 'maz:left-0 maz:w-full maz:tab-m:w-auto',
  right: 'maz:inset-e-0 maz:w-full maz:tab-m:w-auto',
  center: 'maz:w-full maz:tab-m:fixed maz:tab-m:left-2/4 maz:tab-m:w-auto',
} as const

const TOAST_BUTTON_COLOR: Record<NonNullable<ToastOptions['type']>, string> = {
  info: 'maz:bg-info maz:text-info-foreground maz:border-info-600 maz:hover:bg-info-600 maz:dark:bg-info/10 maz:dark:text-info-400 maz:dark:border-info/20 maz:hover:dark:bg-info/20',
  success: 'maz:bg-success maz:text-success-foreground maz:border-success-600 maz:hover:bg-success-600 maz:dark:bg-success/10 maz:dark:text-success-400 maz:dark:border-success/20 maz:dark:hover:bg-success/20',
  warning: 'maz:bg-warning maz:text-warning-foreground maz:border-warning-600 maz:hover:bg-warning-600 maz:dark:bg-warning/10 maz:dark:text-warning-400 maz:dark:border-warning/20 maz:dark:hover:bg-warning/20',
  destructive: 'maz:bg-destructive maz:text-destructive-foreground maz:border-destructive-600 maz:hover:bg-destructive-600 maz:dark:bg-destructive/10 maz:dark:text-destructive-400 maz:dark:border-destructive/20 maz:dark:hover:bg-destructive/20',
  contrast: 'maz:bg-contrast maz:text-contrast-foreground maz:border-contrast-600/20 maz:hover:bg-contrast-500 maz:dark:hover:bg-contrast/70',
  accent: 'maz:bg-accent maz:text-accent-foreground maz:border-accent-600 maz:hover:bg-accent-600 maz:dark:bg-accent/10 maz:dark:text-accent-400 maz:dark:border-accent/20 maz:dark:hover:bg-accent/20',
} as const

const TOAST_CLOSE_COLOR: Record<NonNullable<ToastOptions['type']>, string> = {
  info: 'maz:bg-info maz:text-info-foreground maz:border-info-400 maz:hover:bg-info-600 maz:dark:bg-info/10 maz:dark:border-info/20 maz:dark:text-info-600 maz:hover:dark:bg-info/20',
  success: 'maz:bg-success maz:text-success-foreground maz:border-success-600 maz:hover:bg-success-600 maz:dark:bg-success/10 maz:dark:border-success/20 maz:dark:text-success-600 maz:dark:hover:bg-success/20',
  warning: 'maz:bg-warning maz:text-warning-foreground maz:border-warning-600 maz:hover:bg-warning-600 maz:dark:bg-warning/10 maz:dark:border-warning/20 maz:dark:text-warning-600 maz:dark:hover:bg-warning/20',
  destructive: 'maz:bg-destructive maz:text-destructive-foreground maz:border-destructive-600 maz:hover:bg-destructive-600 maz:dark:bg-destructive/10 maz:dark:border-destructive/20 maz:dark:text-destructive-600 maz:dark:hover:bg-destructive/20',
  contrast: 'maz:bg-contrast maz:text-contrast-foreground maz:border-contrast-600/20 maz:hover:bg-contrast/70',
  accent: 'maz:bg-accent maz:text-accent-foreground maz:border-accent-600 maz:hover:bg-accent-600 maz:dark:bg-accent/10 maz:dark:text-accent-400 maz:dark:border-accent/20 maz:dark:hover:bg-accent/20',
} as const

const CLOSE_POSITION_X = {
  left: 'maz:-inset-e-2',
  right: 'maz:-left-2',
  center: 'maz:-left-2',
} as const

const BUTTON_POSITION_X = {
  left: 'maz:tab-m:w-88',
  right: 'maz:tab-m:w-88',
  center: 'maz:tab-m:w-88 maz:tab-m:justify-center',
} as const

const containerClassName = `m-toast-container m-reset-css --${positionY.value} --${positionX.value} maz:fixed maz:flex maz:flex-col maz:gap-2 maz:p-4 ${CONTAINER_POSITION_Y[positionY.value]} ${CONTAINER_POSITION_X[positionX.value]}`
const selectorContainerClass = `.m-toast-container.--${positionY.value}.--${positionX.value}`

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

  if (Toast.value && container) {
    container.prepend(Toast.value)
  }

  isActive.value = true

  if (typeof timeout === 'number' && timeout > 0 && !persistent) {
    timer.start()
  }
}

const progressBarWidth = ref<string>('100%')

function getProgressBarColor() {
  switch (type) {
    case 'destructive': {
      return 'maz:bg-destructive-800'
    }
    case 'info': {
      return 'maz:bg-info-800'
    }
    case 'success': {
      return 'maz:bg-success-800'
    }
    case 'warning': {
      return 'maz:bg-warning-800'
    }
    default: {
      return 'maz:bg-contrast-foreground'
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
async function onButtonClick(button: ToastButton, event: Event) {
  if (button.onClick) {
    isActionLoading.value = true
    timer.pause()
    await button.onClick()
    timer.resume()
    isActionLoading.value = false
  }

  click(event, button.closeToast ?? false)
}

function toggleTimer(shouldPause: boolean) {
  if (!pauseOnHover || persistent || isActionLoading.value) {
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
  Toast.value?.remove()
  destroy?.()

  const container = document.querySelector(selectorContainerClass)
  if (container && !container?.hasChildNodes()) {
    container.remove()
  }
}

function getButtonRightIcon(button: ToastButton) {
  if (!button.to && !button.href) {
    return button.rightIcon
  }

  if (button.target === '_blank') {
    return MazArrowTopRightOnSquare
  }

  return MazLinkIcon
}

defineExpose({
  /**
   * Close the toast
   * @description This is used to close the toast
   */
  closeToast,
})

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
      v-show="isActive" ref="Toast" class="m-toast m-reset-css maz:relative maz:z-10" :class="[
        `--${type}`,
        `--${positionY}`,
        `--${positionX}`,
        { '--persistent': persistent },
      ]"
    >
      <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
      <button
        role="alert"
        class="m-toast__button maz:relative maz:flex maz:w-full maz:items-center maz:gap-2 maz:self-center maz:rounded maz:ps-2 maz:pe-2 maz:shadow-md maz:transition maz:duration-300 maz:ease-in-out maz:overflow-hidden maz:border maz:backdrop-blur-xl"
        :class="[TOAST_BUTTON_COLOR[type], BUTTON_POSITION_X[positionX]]"
        @mouseover="toggleTimer(true)"
        @mouseleave="toggleTimer(false)"
        @touchstart.passive="toggleTimer(true)"
        @touchend.passive="toggleTimer(false)"
        @click.stop="click($event)"
      >
        <component :is="iconComponent" v-if="iconComponent" class="maz:text-2xl" />

        <div class="m-toast__message maz:m-0 maz:text-start maz:font-medium maz:flex-1 maz:py-3" v-text="html ? undefined : message" v-html="html ? message : undefined" />

        <MazBtn
          v-for="(toastButton, index) in internalButtons"
          :key="index"
          v-bind="{
            ...toastButton,
            onClick: undefined,
          }"
          :loading="isActionLoading || toastButton.loading"
          :right-icon="getButtonRightIcon(toastButton)"
          @click.stop="onButtonClick(toastButton, $event)"
        />

        <div
          v-if="typeof timeout === 'number' && timeout > 0 && !persistent"
          class="m-toast__progress-bar maz:absolute maz:inset-x-0"
        >
          <div
            :style="{
              width: progressBarWidth,
            }"
            class="m-toast__progress-bar-inner maz:h-full maz:transition-all maz:duration-200 maz:ease-linear"
            :class="getProgressBarColor()"
          />
        </div>
      </button>
      <!-- eslint-enable vuejs-accessibility/mouse-events-have-key-events -->
      <button
        class="m-toast__close maz:flex maz:rounded-full maz:p-0.5 maz:flex-center maz:absolute maz:border maz:-top-2 maz:backdrop-blur-xl"
        :class="[TOAST_CLOSE_COLOR[type], CLOSE_POSITION_X[positionX]]"
        @click.stop="click($event)"
      >
        <MazXMark class="m-toast__close-icon maz:cursor-pointer" />
      </button>
    </div>
  </Transition>
</template>

<style>
.m-toast-container {
  z-index: 1051;

  &.--center {
    @media (width >= 768px) {
      transform: translate(-50%, 0);
    }
  }
}
</style>

<style scoped>
.m-toast {
  box-sizing: border-box;

  & * {
    box-sizing: border-box;
  }

  & .m-toast__progress-bar {
    bottom: max(var(--maz-border-width), 1px);
    height: max(var(--maz-border-width), 0.125rem);
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
