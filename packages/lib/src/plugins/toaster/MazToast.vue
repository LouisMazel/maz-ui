<script lang="ts" setup>
import type { LocalToasterOptions } from './ToasterHandler'
import type { ToasterAction, ToasterLink, ToasterPosition } from './types'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import MazBtn from '../../components/MazBtn.vue'
import { useTimer } from '../../composables/useTimer'

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
  maxToasts: false,
  timeout: 10_000,
  type: 'info',
  message: undefined,
  link: undefined,
  action: undefined,
  icon: true,
})

const emits = defineEmits(['close', 'click', 'open'])

const XIcon = defineAsyncComponent(() => import('../../../icons/x-mark.svg'))
const ExternalLink = defineAsyncComponent(() => import('../../../icons/arrow-top-right-on-square.svg'))
const ExclamationTriangle = defineAsyncComponent(() => import('../../../icons/exclamation-triangle.svg'))
const ExclamationCircle = defineAsyncComponent(() => import('../../../icons/exclamation-circle.svg'))
const InformationCircle = defineAsyncComponent(() => import('../../../icons/information-circle.svg'))
const CheckCircle = defineAsyncComponent(() => import('../../../icons/check-circle.svg'))
const Link = defineAsyncComponent(() => import('../../../icons/link.svg'))

const Toaster = ref<HTMLDivElement>()

export interface Props {
  message: string
  position?: ToasterPosition
  maxToasts?: number | boolean
  timeout?: number | boolean
  queue?: boolean
  noPauseOnHover?: boolean
  type?: LocalToasterOptions['type']
  link?: ToasterLink
  action?: ToasterAction
  persistent?: boolean
  icon?: boolean
}

const iconComponent = computed(() => {
  if (!props.icon)
    return undefined

  switch (props.type) {
    case 'danger': {
      return ExclamationTriangle
    }
    case 'info': {
      return InformationCircle
    }
    case 'success': {
      return CheckCircle
    }
    case 'warning': {
      return ExclamationCircle
    }
    default: {
      return undefined
    }
  }
})

const positionY = computed(() => (props.position.includes('top') ? 'top' : 'bottom'))
const positionX = computed(() => {
  if (props.position.includes('left'))
    return 'left'
  if (props.position.includes('right'))
    return 'right'
  return 'center'
})

const transitionName = computed(() => {
  if (positionX.value !== 'center') {
    return positionX.value === 'right' ? 'm-slide-right' : 'm-slide-left'
  }
  return positionY.value === 'top' ? 'm-slide-top' : 'm-slide-bottom'
})

const actionLoading = ref(false)
const isActive = ref(false)
const queueTimer = ref<ReturnType<typeof setTimeout>>()

const containerClassName = `m-toast-container m-reset-css --${positionY.value} --${positionX.value}`
const selectorContainerClass = `.${containerClassName.replaceAll(' ', '.')}`

const timer = useTimer({
  callback: closeToast,
  timeout: typeof props.timeout === 'number' ? props.timeout : 0,
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

  if (!props.queue && props.maxToasts === false) {
    return false
  }

  if (typeof props.maxToasts === 'number' && container) {
    return props.maxToasts <= container.childElementCount
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

  if (typeof props.timeout === 'number' && props.timeout > 0) {
    timer.start()
  }
}

const progressBarWidth = ref<string>('100%')

function getProgressBarColor() {
  switch (props.type) {
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
      return 'maz-bg-primary'
    }
  }
}

watch(
  timer.remainingTime,
  (remainingTime) => {
    if (typeof props.timeout === 'number') {
      const percent = (100 * remainingTime) / props.timeout
      progressBarWidth.value = `${percent}%`
    }
  },
)

function click(event: Event) {
  emits('click', event)

  if (!props.persistent) {
    closeToast()
  }
}

async function clickOnAction(func: ToasterAction['func'], event: Event) {
  actionLoading.value = true
  await func()
  actionLoading.value = false
  if (props.action?.closeToast) {
    click(event)
  }
}

function toggleTimer(shouldPause: boolean) {
  if (props.noPauseOnHover) {
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

defineExpose({ closeToast })

function onAnimationEnter() {
  emits('open')
}

function onAnimationLeave() {
  emits('close')
  Toaster.value?.remove()

  const container = document.querySelector(selectorContainerClass)
  if (container && !container?.hasChildNodes()) {
    container.remove()
  }
}

onMounted(() => {
  createParents()
  showNotice()
})
</script>

<template>
  <Transition
    :name="transitionName"
    @after-leave="onAnimationLeave"
    @after-enter="onAnimationEnter"
  >
    <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
    <button
      v-show="isActive"
      ref="Toaster"
      class="m-toast m-reset-css"
      :class="[
        `--${type}`,
        `--${positionY}`,
        `--${positionX}`,
        { 'maz-pb-1': typeof timeout === 'number' && timeout > 0, '--persistent': persistent },
      ]"
      role="alert"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click.stop="link && !link?.closeToast ? undefined : click($event)"
    >
      <Component :is="iconComponent" v-if="iconComponent" class="maz-text-2xl" />

      <div class="m-toast__message-wrapper">
        <p class="m-toast__message">
          {{ message }}
        </p>
      </div>

      <MazBtn
        v-if="action"
        data-test="action-btn"
        :color="type"
        pastel
        :loading="actionLoading"
        size="sm"
        @click.stop="action ? clickOnAction(action.func, $event) : undefined"
      >
        {{ action.text }}
      </MazBtn>
      <MazBtn
        v-if="link"
        data-test="link-btn"
        :color="type"
        pastel
        size="xs"
        :href="link.href"
        :target="link.target ?? '_self'"
      >
        <div class="maz-flex maz-items-center maz-gap-2">
          <span v-if="link.text"> {{ link.text }} </span>

          <ExternalLink v-if="link?.target === '_blank'" class="maz-text-xl" />
          <Link v-else class="maz-text-xl" />
        </div>
      </MazBtn>

      <button v-if="!persistent" class="--close" @click.stop="click($event)">
        <XIcon class="--icon maz-text-xl" />
      </button>

      <div
        v-if="typeof timeout === 'number' && timeout > 0"
        class="progress-bar maz-absolute maz-inset-x-0 maz-bottom-0 maz-h-1"
      >
        <div
          :style="{
            width: progressBarWidth,
          }"
          class="maz-h-full !maz-transition-all !maz-duration-200 !maz-ease-linear"
          :class="getProgressBarColor()"
        />
      </div>
    </button>
    <!-- eslint-enable vuejs-accessibility/mouse-events-have-key-events -->
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

    & > :not([hidden]) ~ :not([hidden]) {
      @apply maz-my-2;
    }
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

  @apply maz-relative maz-flex maz-w-full maz-cursor-default maz-items-center maz-gap-2 maz-self-center maz-overflow-hidden maz-rounded maz-pl-2 maz-pr-2 maz-shadow-md maz-transition maz-duration-300 maz-ease-in-out;

  &:not(.--persistent) {
    @apply maz-cursor-pointer;
  }

  &.--left,
  &.--right {
    @apply tab-m:maz-w-[22rem];
  }

  &.--center {
    @apply tab-m:maz-w-[22rem] tab-m:maz-justify-center;
  }

  &__message-wrapper {
    @apply maz-flex-1 maz-py-3;
  }

  &__message {
    @apply maz-m-0 maz-text-start maz-font-medium;
  }

  & .--close {
    @apply maz-flex maz-h-9 maz-w-9 maz-rounded maz-bg-transparent maz-p-0 maz-flex-center hover:maz-bg-gray-900/20;

    & .--icon {
      @apply maz-cursor-pointer;
    }
  }

  &.--info {
    @apply maz-bg-info maz-text-info-contrast;

    &:not(.--persistent) {
      @apply hover:maz-bg-info-400;
    }
  }

  &.--success {
    @apply maz-bg-success maz-text-success-contrast;

    &:not(.--persistent) {
      @apply hover:maz-bg-success-400;
    }
  }

  &.--warning {
    @apply maz-bg-warning maz-text-warning-contrast;

    &:not(.--persistent) {
      @apply hover:maz-bg-warning-400;
    }
  }

  &.--danger {
    @apply maz-bg-danger maz-text-danger-contrast;

    &:not(.--persistent) {
      @apply hover:maz-bg-danger-400;
    }
  }

  &.--theme {
    @apply maz-bg-color maz-text-normal dark:maz-border dark:maz-border-solid  dark:maz-border-color-lighter;

    &:not(.--persistent) {
      @apply hover:maz-bg-color-light;
    }
  }
}

.m-slide-top-enter-active,
.m-slide-top-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: translateY(0);
}

.m-slide-top-enter-from,
.m-slide-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.m-slide-bottom-enter-active,
.m-slide-bottom-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: translateY(0);
}

.m-slide-bottom-enter-from,
.m-slide-bottom-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.m-slide-right-enter-active,
.m-slide-right-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: translateX(0);
}

.m-slide-right-enter-from,
.m-slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.m-slide-left-enter-active,
.m-slide-left-leave-active {
  opacity: 1;
  transition: all 300ms;
  transform: translateX(0);
}

.m-slide-left-enter-from,
.m-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
