<template>
  <label
    :for="instanceId"
    class="m-checkbox"
    :class="[{ '--disabled': disabled, '--selected': isSelected }, props.class]"
    tabindex="0"
    role="radio"
    :style
    :aria-checked="isSelected"
    @keydown="keyboardHandler($event, value)"
  >
    <input
      :id="instanceId"
      :value
      v-bind="$attrs"
      tabindex="-1"
      :disabled
      :name="name"
      type="radio"
      :checked="isSelected"
      @change="emitValue(($event?.target as HTMLInputElement)?.value)"
    />
    <span>
      <span class="round"></span>
    </span>

    <!--
      @slot Label of the radio
        @binding {Boolean} is-selected - If the radio is selected
        @binding {string | number | boolean} value - The value of the radio
    -->
    <slot :is-selected :value>
      {{ label }}
    </slot>
  </label>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { computed, type StyleValue } from 'vue'
  import type { Color, Size } from './types'
  export type { Color, Size }

  const props = withDefaults(
    defineProps<{
      /** Style attribut of the component root element */
      style?: StyleValue
      /** Class attribut of the component root element */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      class?: any
      /** The id of the radio */
      id?: string
      /** @model The value of the radio */
      modelValue?: string | number | boolean
      /** The value of the radio */
      value: string | number | boolean
      /** The name of the radio */
      name: string
      /** The label of the radio */
      label?: string
      /** The color of the radio */
      color?: Color
      /** The size of the radio */
      size?: Size
      /** The disabled state of the radio */
      disabled?: boolean
    }>(),
    {
      style: undefined,
      class: undefined,
      id: undefined,
      modelValue: undefined,
      label: undefined,
      color: 'primary',
      size: 'md',
      disabled: false,
    },
  )

  const emits = defineEmits<{
    /**
     * Event emitted when value change
     * @property {string | number | boolean} value - selected value
     */
    (event: 'update:model-value', value: string | number | boolean): void
    /**
     * Event emitted when value change
     * @property {string | number | boolean} value - selected value
     */
    (event: 'change', value: string | number | boolean): void
  }>()

  const instanceId = useInstanceUniqId({
    componentName: 'MazCheckbox',
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

  function keyboardHandler(event: KeyboardEvent, value: string | number | boolean) {
    if (['Space'].includes(event.code)) {
      event.preventDefault()
      emitValue(value)
    }
  }

  function emitValue(value: string | number | boolean) {
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
