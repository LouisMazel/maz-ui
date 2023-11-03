<template>
  <label
    :for="instanceId"
    class="m-checkbox"
    :class="{ '--disabled': disabled }"
    tabindex="1"
    @keydown="keyboardHandler"
  >
    <input
      :id="instanceId"
      :checked="modelValue"
      v-bind="$attrs"
      :disabled="disabled"
      :name="name"
      type="checkbox"
      @change="emitValue(($event?.target as HTMLInputElement)?.checked)"
    />
    <span>
      <Transition name="maz-scale">
        <CheckIcon v-show="modelValue" class="check-icon" :class="checkIconSize" />
      </Transition>
    </span>
    <slot></slot>
  </label>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { type PropType, getCurrentInstance, computed } from 'vue'
  import type { Color, Size } from './types'
  export type { Color, Size }
  import CheckIcon from './../icons/check.svg'

  const instance = getCurrentInstance()

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    id: { type: String, default: undefined },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
    name: { type: String, default: 'm-checkbox' },
    size: { type: String as PropType<Size>, default: 'md' },
    disabled: { type: Boolean, default: false },
  })
  const emits = defineEmits([
    /* emitted when value change */
    'update:model-value',
    /* emited when value change */
    'change',
  ])

  const instanceId = useInstanceUniqId({
    componentName: 'MazCheckbox',
    instance,
    providedId: props.id,
  })

  const checkboxSize = computed(() => {
    switch (props.size) {
      case 'xl': {
        return '2.25rem'
      }
      case 'lg': {
        return '2rem'
      }
      default: {
        return '1.625rem'
      }
      case 'sm': {
        return '1.425rem'
      }
      case 'xs': {
        return '1.325rem'
      }
      case 'mini': {
        return '1.2rem'
      }
    }
  })

  const checkIconSize = computed(() => {
    switch (props.size) {
      case 'xl': {
        return 'maz-text-2xl'
      }
      case 'lg': {
        return 'maz-text-xl'
      }
      default: {
        return 'maz-text-lg'
      }
      case 'sm': {
        return 'maz-text-base'
      }
      case 'xs': {
        return 'maz-text-sm'
      }
      case 'mini': {
        return 'maz-text-xs'
      }
    }
  })

  const checkIconColor = computed(() => `var(--maz-color-${props.color})`)
  const checkboxBorderColor = computed(() => `var(--maz-color-${props.color})`)
  const checkboxBoxShadow = computed(() =>
    ['black', 'transparent'].includes(props.color)
      ? `var(--maz-color-muted)`
      : `var(--maz-color-${props.color}-alpha)`,
  )

  function keyboardHandler(event: KeyboardEvent) {
    if (['Enter', 'Space'].includes(event.code)) {
      event.preventDefault()
      emitValue(!props.modelValue)
    }
  }

  function emitValue(value: boolean) {
    emits('update:model-value', value)
    emits('change', value)
  }
</script>

<style lang="postcss" scoped>
  .m-checkbox {
    @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-outline-none;

    .check-icon {
      color: v-bind('checkIconColor');

      :deep(path) {
        stroke-width: 2.5;
      }
    }

    span {
      @apply maz-relative maz-flex maz-rounded maz-border maz-border-color-light maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center dark:maz-border-color-lighter;

      width: v-bind('checkboxSize');
      height: v-bind('checkboxSize');
    }

    &.--disabled {
      @apply maz-cursor-not-allowed;
    }

    &:not(.--disabled) {
      @apply maz-cursor-pointer;

      &:hover span,
      &:focus span {
        @apply maz-transition-all maz-duration-300 maz-ease-in-out;

        box-shadow: 0 0 0 0.125rem v-bind('checkboxBoxShadow');
      }
    }

    input {
      @apply maz-hidden;

      &:disabled ~ span {
        @apply maz-bg-color-light;
      }

      &:checked ~ span {
        border-color: v-bind('checkboxBorderColor');
      }
    }
  }
</style>
