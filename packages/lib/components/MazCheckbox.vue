<template>
  <div class="m-checkbox" :class="[`m-checkbox--${color}`]">
    <input
      :id="instanceId"
      :checked="modelValue"
      v-bind="$attrs"
      :name="name"
      type="checkbox"
      @change="$emit('update:model-value', ($event?.target as HTMLInputElement)?.checked)"
    />
    <label :for="instanceId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
  export type { Color } from './types'
</script>

<script lang="ts" setup>
  import { useInstanceUniqId } from '../modules/composables/instance-uniq-id'
  import { type PropType, getCurrentInstance } from 'vue'
  import type { Color } from './types'

  const instance = getCurrentInstance()

  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    id: { type: String, default: undefined },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: Color) => {
        return [
          'primary',
          'secondary',
          'info',
          'success',
          'warning',
          'danger',
          'white',
          'black',
          'transparent',
        ].includes(value)
      },
    },
    name: { type: String, default: 'm-checkbox' },
  })
  defineEmits(['update:model-value'])

  const { instanceId } = useInstanceUniqId({
    componentName: 'MazCheckbox',
    instance,
    providedId: props.id,
  })
</script>

<style lang="postcss" scoped>
  .m-checkbox {
    transition: all 300ms ease-in-out;
    min-height: 1.75rem;

    @apply maz-cursor-pointer;

    [type='checkbox']:not(:checked),
    [type='checkbox']:checked {
      @apply maz-absolute;

      left: -9999px;
    }

    [type='checkbox']:not(:checked) + label,
    [type='checkbox']:checked + label {
      @apply maz-relative maz-m-0 maz-flex maz-cursor-pointer maz-select-none maz-items-center maz-pl-10 maz-leading-7;

      transition: all 300ms ease-in-out;
    }

    [type='checkbox'] + label::before {
      @apply maz-absolute maz-left-0 maz-rounded maz-border maz-border-solid maz-border-transparent maz-bg-transparent;

      content: '';
      width: 1.625rem;
      height: 1.625rem;
      background: transparent;
      transition: all 300ms ease-in-out;
    }

    [type='checkbox']:hover + label::before,
    [type='checkbox']:focus + label::before {
      @apply maz-absolute maz-border maz-border-solid maz-border-primary maz-bg-transparent;

      content: '';
    }

    [type='checkbox']:not(:checked) + label::before {
      @apply maz-border-color-light;
    }

    [type='checkbox']:not(:checked) + label::after,
    [type='checkbox']:checked + label::after {
      content: '';

      @apply maz-absolute;

      left: 0.438rem;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 0.125rem;
    }

    [type='checkbox']:not(:checked) + label::after {
      @apply maz-scale-0 maz-opacity-0;
    }

    [type='checkbox']:checked + label::after {
      @apply maz-scale-100 maz-opacity-100;
    }

    &--primary {
      [type='checkbox']:checked + label::before {
        @apply maz-border-primary;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-primary maz-text-primary;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem var(--maz-color-primary-alpha);

          @apply maz-border-primary-700;
        }

        + label::after {
          @apply maz-bg-primary-700;
        }
      }
    }

    &--secondary {
      [type='checkbox']:checked + label::before {
        @apply maz-border-secondary;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-secondary maz-text-secondary;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem var(--maz-color-secondary-alpha);

          @apply maz-border-secondary-700;
        }

        + label::after {
          @apply maz-bg-secondary-700;
        }
      }
    }

    &--info {
      [type='checkbox']:checked + label::before {
        @apply maz-border-info;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-info maz-text-info;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem var(--maz-color-info-alpha);

          @apply maz-border-info-700;
        }

        + label::after {
          @apply maz-bg-info-700;
        }
      }
    }

    &--danger {
      [type='checkbox']:checked + label::before {
        @apply maz-border-danger;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-danger maz-text-danger;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem var(--maz-color-danger-alpha);

          @apply maz-border-danger-700;
        }

        + label::after {
          @apply maz-bg-danger-700;
        }
      }
    }

    &--warning {
      [type='checkbox']:checked + label::before {
        @apply maz-border-warning;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-warning maz-text-warning;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem var(--maz-color-warning-alpha);

          @apply maz-border-warning-700;
        }

        + label::after {
          @apply maz-bg-warning-700;
        }
      }
    }

    &--success {
      [type='checkbox']:checked + label::before {
        @apply maz-border-success;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-success maz-text-success;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem var(--maz-color-success-alpha);

          @apply maz-border-success-700;
        }

        + label::after {
          @apply maz-bg-success-700;
        }
      }
    }

    &--white {
      [type='checkbox']:checked + label::before {
        @apply maz-border-white;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-white maz-text-white;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem hsl(216deg 12% 84% / 60%);

          @apply maz-border-gray-300;
        }

        + label::after {
          @apply maz-bg-gray-300;
        }
      }
    }

    &--black {
      [type='checkbox']:checked + label::before {
        @apply maz-border-black;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-black maz-text-black;
      }

      [type='checkbox']:focus,
      [type='checkbox']:hover {
        + label::before {
          box-shadow: 0 0 0 0.125rem hsl(0deg 0% 0% / 60%);

          @apply maz-border-gray-700;
        }

        + label::after {
          @apply maz-bg-gray-700;
        }
      }
    }
  }

  html.dark {
    .m-checkbox {
      [type='checkbox']:not(:checked) + label::before {
        @apply maz-border-color-lighter;
      }
    }
  }
</style>
