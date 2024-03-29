<template>
  <label
    :for="instanceId"
    class="m-switch"
    :class="[{ '--is-disabled': disabled }, props.class]"
    role="switch"
    :style="style"
    :aria-checked="modelValue"
    tabindex="0"
  >
    <input
      :id="instanceId"
      v-bind="$attrs"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      class="m-switch__input"
      @change="emit"
    />
    <span class="m-switch__toggle"> </span>

    <span v-if="$slots.default" class="m-switch__label">
      <slot></slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
  import { computed, type HTMLAttributes, type PropType } from 'vue'
  import type { Color } from './types'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'

  export type { Color }

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    modelValue: { type: Boolean, required: true },
    id: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    color: { type: String as PropType<Color>, default: 'primary' },
  })

  const emits = defineEmits([
    /* emitted on value change */
    'update:model-value',
    /* emitted on value change */
    'change',
  ])

  const instanceId = useInstanceUniqId({
    componentName: 'MazCheckbox',
    providedId: props.id,
  })

  const bgColorClassVar = computed(() => `var(--maz-color-${props.color}-alpha)`)

  const bgColorStyle = computed<HTMLAttributes['class']>(() =>
    props.modelValue ? `var(--maz-color-${props.color})` : 'var(--maz-color-white)',
  )

  const emit = (e: Event) => {
    const target = e.target as HTMLInputElement | undefined
    emits('update:model-value', target?.checked ?? false)
    emits('change', target?.checked ?? false)
  }
</script>

<style lang="postcss">
  .m-switch {
    @apply maz-relative maz-inline-flex maz-cursor-pointer maz-items-center maz-gap-2 maz-align-top;

    &.--is-disabled {
      @apply maz-cursor-not-allowed;
    }

    &__input {
      @apply maz-absolute;

      left: -9999px;
    }

    &__toggle {
      @apply maz-h-6 maz-w-12;

      &::before {
        content: '';
        transition: all 200ms ease-in-out;

        @apply maz-relative maz-left-1 maz-top-1 maz-block maz-h-4 maz-w-10 maz-rounded-full;

        background-color: v-bind('bgColorClassVar');
      }

      &::after {
        content: '';

        @apply maz-absolute maz-left-0 maz-top-0 maz-block maz-h-6 maz-w-6 maz-rounded-full;

        background-color: v-bind('bgColorStyle');
        box-shadow: 0 2px 8px 0 hsl(0deg 0% 0% / 20%);
        transition: all 200ms ease-in-out;
      }
    }

    &__input:checked + .m-switch__toggle {
      &::after {
        @apply maz-translate-x-6;
      }
    }

    &__input:disabled {
      + .m-switch__toggle {
        &::after {
          @apply maz-bg-color-light dark:maz-bg-color-lighter;
        }

        &::before {
          @apply maz-bg-color-lighter dark:maz-bg-color-light;
        }
      }
    }
  }
</style>
