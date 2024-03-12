<template>
  <label
    :for="instanceId"
    class="m-checkbox"
    :class="[{ '--disabled': disabled }, props.class]"
    tabindex="0"
    :style="style"
    role="checkbox"
    :aria-checked="isChecked"
    @keydown="keyboardHandler"
  >
    <input
      :id="instanceId"
      :checked="isChecked"
      v-bind="$attrs"
      tabindex="-1"
      :disabled="disabled"
      :name="name"
      type="checkbox"
      @change="emitValue(value ?? ($event?.target as HTMLInputElement)?.checked)"
    />
    <span>
      <CheckIcon class="check-icon" :class="checkIconSize" />
    </span>
    <slot></slot>
  </label>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { getCurrentInstance, computed, type HTMLAttributes } from 'vue'
  import type { Color, Size } from './types'
  export type { Color, Size }
  import CheckIcon from './../icons/check.svg'

  const instance = getCurrentInstance()

  defineOptions({
    inheritAttrs: false,
  })

  export type Props = {
    style?: HTMLAttributes['style']
    class?: HTMLAttributes['class']
    modelValue?: boolean | (string | number)[]
    id?: string
    color?: Color
    value?: string | number | boolean
    name?: string
    size?: Size
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    style: undefined,
    class: undefined,
    modelValue: undefined,
    id: undefined,
    color: 'primary',
    value: undefined,
    name: 'm-checkbox',
    size: 'md',
    disabled: false,
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

  const isChecked = computed(() =>
    typeof props.value !== 'boolean' && Array.isArray(props.modelValue)
      ? props.modelValue.includes(props.value as never)
      : typeof props.modelValue === 'boolean'
        ? props.modelValue
        : false,
  )

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

  const checkIconColor = computed(() => `var(--maz-color-${props.color}-contrast)`)
  const checkboxSelectedColor = computed(() => `var(--maz-color-${props.color})`)
  const checkboxBoxShadow = computed(() =>
    ['black', 'transparent'].includes(props.color)
      ? `var(--maz-color-muted)`
      : `var(--maz-color-${props.color}-alpha)`,
  )

  function keyboardHandler(event: KeyboardEvent) {
    if (['Space'].includes(event.code)) {
      event.preventDefault()
      emitValue(props.value ?? !props.modelValue)
    }
  }

  function getNewValue(value: boolean | string | number) {
    if (
      typeof value === 'boolean' &&
      (typeof props.modelValue === 'boolean' ||
        props.modelValue === undefined ||
        props.modelValue === null)
    ) {
      return props.modelValue ? false : true
    } else if (Array.isArray(props.modelValue) && typeof value !== 'boolean') {
      return props.modelValue.includes(value)
        ? props.modelValue.filter((v) => v !== value)
        : [...props.modelValue, value]
    } else {
      return [value]
    }
  }

  function emitValue(value: boolean | string | number) {
    const newValue = getNewValue(value)

    emits('update:model-value', newValue)
    emits('change', newValue)
  }
</script>

<style lang="postcss" scoped>
  .m-checkbox {
    @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-outline-none;

    .check-icon {
      color: v-bind('checkIconColor');

      @apply maz-scale-0 maz-transition-transform maz-duration-300 maz-ease-in-out;

      :deep(path) {
        stroke-width: 2.5;
      }
    }

    > span {
      @apply maz-relative maz-flex maz-rounded-md maz-border maz-border-border maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center dark:maz-border-color-lighter;

      width: v-bind('checkboxSize');
      height: v-bind('checkboxSize');
    }

    input {
      @apply maz-hidden;

      &:not(:checked) ~ span {
        @apply maz-bg-color dark:maz-bg-color-light;
      }

      &:checked ~ span {
        border-color: v-bind('checkboxSelectedColor');
        background-color: v-bind('checkboxSelectedColor');

        .check-icon {
          @apply maz-scale-100;
        }
      }

      &:disabled ~ span {
        @apply maz-bg-color-light dark:maz-bg-color-lighter;
      }
    }

    &.--disabled {
      @apply maz-cursor-not-allowed maz-text-muted;

      input:checked ~ span {
        @apply maz-border-border dark:maz-border-color-lighter;

        .check-icon {
          @apply maz-text-muted;
        }
      }
    }

    &:not(.--disabled) {
      @apply maz-cursor-pointer;

      &:hover > span,
      &:focus > span {
        @apply maz-transition-all maz-duration-300 maz-ease-in-out;

        box-shadow: 0 0 0 0.125rem v-bind('checkboxBoxShadow');
      }
    }
  }
</style>
