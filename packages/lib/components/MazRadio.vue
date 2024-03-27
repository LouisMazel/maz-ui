<template>
  <label
    :for="instanceId"
    class="m-checkbox"
    :class="[{ '--disabled': disabled, '--selected': isSelected }, props.class]"
    tabindex="0"
    role="radio"
    :style="style"
    :aria-checked="isSelected"
    @keydown="keyboardHandler($event, value)"
  >
    <input
      :id="instanceId"
      :value="value"
      v-bind="$attrs"
      tabindex="-1"
      :disabled="disabled"
      :name="name"
      type="radio"
      :checked="isSelected"
      @change="emitValue(($event?.target as HTMLInputElement)?.value)"
    />
    <span>
      <span class="round"></span>
    </span>
    <slot></slot>
  </label>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { type PropType, getCurrentInstance, computed, type HTMLAttributes } from 'vue'
  import type { Color, Size } from './types'
  export type { Color, Size }

  const instance = getCurrentInstance()

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    modelValue: { type: String, default: undefined },
    value: { type: String, required: true },
    name: { type: String, required: true },
    id: { type: String, default: undefined },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
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

  const isSelected = computed(() => props.modelValue === props.value)

  const radioSize = computed(() => {
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

  const radioSelectedColor = computed(() => `var(--maz-color-${props.color})`)
  const radioBoxShadow = computed(() =>
    ['black', 'transparent'].includes(props.color)
      ? `var(--maz-color-muted)`
      : `var(--maz-color-${props.color}-alpha)`,
  )

  function keyboardHandler(event: KeyboardEvent, value: string) {
    if (['Space'].includes(event.code)) {
      event.preventDefault()
      emitValue(value)
    }
  }

  function emitValue(value: string) {
    emits('update:model-value', value)
    emits('change', value)
  }
</script>

<style lang="postcss" scoped>
  .m-checkbox {
    @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-align-top maz-outline-none;

    > span {
      @apply maz-relative maz-flex maz-rounded-full maz-border maz-border-border maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center dark:maz-border-color-lighter;

      width: v-bind('radioSize');
      height: v-bind('radioSize');

      .round {
        @apply maz-h-[50%] maz-w-[50%] maz-scale-0 maz-rounded-full maz-transition-transform maz-duration-300 maz-ease-in-out;

        background-color: v-bind('radioSelectedColor');
      }
    }

    &:not(.--selected) > span {
      @apply maz-bg-color dark:maz-bg-color-light;
    }

    &.--selected > span {
      border-color: v-bind('radioSelectedColor');

      .round {
        @apply maz-scale-100;
      }
    }

    input {
      @apply maz-hidden;
    }

    &.--disabled {
      @apply maz-cursor-not-allowed maz-text-muted;

      > span {
        @apply maz-bg-color-light dark:maz-bg-color-lighter;
      }

      &.--selected {
        > span {
          @apply maz-border-border dark:maz-border-color-lighter;

          .round {
            @apply maz-bg-muted;
          }
        }
      }
    }

    &:not(.--disabled) {
      @apply maz-cursor-pointer;

      &:hover > span,
      &:focus > span {
        @apply maz-transition-all maz-duration-300 maz-ease-in-out;

        box-shadow: 0 0 0 0.125rem v-bind('radioBoxShadow');
      }
    }
  }
</style>
