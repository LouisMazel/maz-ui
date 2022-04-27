<template>
  <Transition :name="transitionName">
    <div
      v-show="isActive"
      ref="Toaster"
      class="m-toast"
      :class="[`--${type}`, `--${positionY}`, `--${positionX}`]"
      role="alert"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click="click($event)"
    >
      <div class="m-toast__message-wrapper">
        <p class="m-toast__message">
          {{ message }}
        </p>
      </div>

      <button v-if="!persistent" class="--close">
        <MazIcon :src="XIcon" class="maz-h-5 maz-w-5 maz-cursor-pointer" />
      </button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import type { PropType } from 'vue'
  import { ToasterTimer } from './timer'
  import type { LocalToasterOptions } from './toaster-handler'
  import MazIcon from '@components/MazIcon.vue'
  import XIcon from '@package/icons/x.svg'
  import type { ToasterPositions } from './types'

  const Toaster = ref<HTMLDivElement>()

  const props = defineProps({
    position: {
      type: String as PropType<ToasterPositions>,
      default: 'bottom-right',
      required: true,
    },
    maxToasts: { type: [Number, Boolean], default: false },
    timeout: { type: Number, required: true },
    queue: { type: Boolean, default: false },
    noPauseOnHover: { type: Boolean, default: false },
    type: {
      type: String as PropType<LocalToasterOptions['type']>,
      default: 'info',
      validator: (value: string) => {
        return ['info', 'success', 'warning', 'danger'].includes(value)
      },
    },
    message: { type: String, required: true },
    persistent: { type: Boolean, default: false },
  })

  const emits = defineEmits(['close', 'click'])

  const positionY = computed(() =>
    props.position.includes('top') ? 'top' : 'bottom',
  )
  const positionX = computed(() => {
    if (props.position.includes('left')) return 'left'
    if (props.position.includes('right')) return 'right'
    return 'center'
  })

  const transitionName = computed(() => {
    if (positionX.value !== 'center') {
      return positionX.value === 'right' ? 'm-slide-right' : 'm-slide-left'
    }
    return positionY.value === 'top' ? 'm-slide-top' : 'm-slide-bottom'
  })

  const isActive = ref(false)
  const timer = ref<ToasterTimer>()
  const queueTimer = ref<ReturnType<typeof setTimeout>>()

  const containerClassName = `m-toast-container --${positionY.value} --${positionX.value}`
  const selectorContainerClass = `.${containerClassName.replaceAll(' ', '.')}`

  const createParents = () => {
    const container = document.querySelector(selectorContainerClass)

    if (container) return

    if (!container) {
      const body = document.body
      const toCreate = document.createElement('div')
      toCreate.className = containerClassName
      body.append(toCreate)
    }
  }

  const shouldQueue = () => {
    const container = document.querySelector(selectorContainerClass)

    if (!props.queue && props.maxToasts === false) {
      return false
    }

    if (props.maxToasts !== false && container) {
      return props.maxToasts <= container.childElementCount
    }
    return container && container.childElementCount > 0
  }

  const showNotice = () => {
    if (shouldQueue()) {
      queueTimer.value = setTimeout(showNotice, 250)
      return
    }

    const container = document.querySelector(selectorContainerClass)

    if (Toaster.value && container) {
      container.prepend(Toaster.value)
    }

    isActive.value = true
    timer.value = props.timeout
      ? new ToasterTimer(close, props.timeout)
      : undefined
  }

  function click(event: Event) {
    // eslint-disable-next-line unicorn/prefer-prototype-methods
    emits('click', event)
    if (!props.persistent) {
      close()
    }
  }

  const toggleTimer = (newVal: boolean) => {
    if (timer.value && !props.noPauseOnHover) {
      newVal ? timer.value.pause() : timer.value.resume()
    }
  }

  const stopTimer = () => {
    timer.value && timer.value.stop()
    if (queueTimer.value) {
      clearTimeout(queueTimer.value)
    }
  }

  const close = () => {
    stopTimer()
    isActive.value = false

    setTimeout(() => {
      // eslint-disable-next-line unicorn/prefer-prototype-methods
      emits('close')
      Toaster.value?.remove()

      const container = document.querySelector(selectorContainerClass)
      if (container && !container?.hasChildNodes()) {
        container.remove()
      }
    }, 300)
  }

  onMounted(() => {
    createParents()
    showNotice()
  })
</script>

<style lang="postcss">
  .m-toast-container {
    box-sizing: border-box;

    @apply maz-fixed maz-z-50 maz-flex maz-flex-col maz-space-y-2 maz-p-4;

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
        margin-bottom: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
        margin-top: calc(0.5rem * var(--tw-space-y-reverse));
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

    @apply maz-relative maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-self-center maz-rounded
      maz-pl-2 maz-pr-2 maz-text-white maz-transition
      maz-duration-300 maz-ease-in-out;

    &.--left,
    &.--right {
      @apply tab-m:maz-w-80;
    }

    &.--center {
      @apply tab-m:maz-w-80 tab-m:maz-justify-center;
    }

    &__message-wrapper {
      @apply maz-flex-1 maz-py-3;
    }

    &__message {
      @apply maz-m-0 maz-font-medium;
    }

    & .--close {
      @apply maz-ml-1 maz-flex maz-h-7 maz-w-7 maz-rounded-full maz-bg-transparent maz-p-0
        maz-flex-center
        hover:maz-bg-gray-900 hover:maz-bg-opacity-10;
    }

    &.--info {
      @apply maz-bg-info maz-text-info-contrast hover:maz-bg-info-600;

      & .--close {
        @apply maz-text-info-contrast;
      }
    }

    &.--success {
      @apply maz-bg-success maz-text-success-contrast hover:maz-bg-success-600;

      & .--close {
        @apply maz-text-success-contrast;
      }
    }

    &.--warning {
      @apply maz-bg-warning maz-text-warning-contrast hover:maz-bg-warning-600;

      & .--close {
        @apply maz-text-warning-contrast;
      }
    }

    &.--danger {
      @apply maz-bg-danger maz-text-danger-contrast hover:maz-bg-danger-600;

      & .--close {
        @apply maz-text-danger-contrast;
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
