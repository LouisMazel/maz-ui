<template>
  <div class="m-switch" :class="[`--${color}`]">
    <input
      :id="uniqueId"
      v-bind="$attrs"
      type="checkbox"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      class="m-switch__input"
      @change="emit"
    />
    <label
      :for="uniqueId"
      class="m-switch__toggle"
      :style="[{ '--m-switch-bg-bar': bgColorClassVar } as StyleValue]"
    >
      <span :style="[bgColorStyle]" />
    </label>
  </div>
</template>

<script lang="ts">
  export type { Color } from './types'
</script>

<script lang="ts" setup>
  import {
    computed,
    getCurrentInstance,
    type PropType,
    type StyleValue,
  } from 'vue'
  import type { Color } from './types'

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    id: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    color: { type: String as PropType<Color>, default: 'primary' },
  })

  const emits = defineEmits(['update:model-value'])

  const uniqueId = computed(
    () => props.id ?? `mazSwitch-${getCurrentInstance()?.uid}`,
  )

  const bgColorClassVar = computed(
    () => `var(--maz-color-${props.color}-alpha)`,
  )

  const bgColorStyle = computed<StyleValue>(() => ({
    backgroundColor: props.modelValue
      ? `var(--maz-color-${props.color})`
      : 'var(--maz-color-white)',
  }))

  const emit = (e: Event) => {
    const target = e.target as HTMLInputElement | undefined
    emits('update:model-value', target?.checked ?? false)
  }
</script>

<style lang="postcss">
  .m-switch {
    &__input {
      @apply maz-absolute;

      left: -9999px;
    }

    &__toggle {
      @apply maz-relative maz-block maz-h-6 maz-w-12 maz-cursor-pointer;

      transform: translate3d(0, 0, 0);

      &::before {
        content: '';
        transition: all 200ms ease-in-out;

        @apply maz-relative maz-top-1 maz-left-1 maz-block maz-h-4 maz-w-10 maz-rounded-full;

        background-color: var(--m-switch-bg-bar);
      }

      & span {
        @apply maz-absolute maz-top-0 maz-left-0 maz-block maz-h-6 maz-w-6 maz-rounded-full;

        box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
        transition: all 200ms ease-in-out;
      }
    }

    &__input:checked + &__toggle {
      span {
        transform: translateX(1.5em);

        &::before {
          transform: scale(1);
          opacity: 0;
          transition: all 400ms ease-in-out;
        }
      }
    }

    &__input:disabled + &__toggle {
      @apply maz-cursor-not-allowed;
    }
  }
</style>
