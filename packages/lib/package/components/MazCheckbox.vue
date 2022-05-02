<template>
  <div class="m-checkbox" :class="[`m-checkbox--${color}`]">
    <input
      :id="id"
      :checked="modelValue"
      v-bind="$attrs"
      :name="name"
      type="checkbox"
      class="maz-mr-2"
      @change="$emit('update:model-value', ($event?.target as HTMLInputElement)?.checked)"
    />
    <label :for="id" class="maz-m-0 maz-flex maz-items-center">
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
  export type { Color } from './types'
</script>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import type { Color } from './types'

  defineProps({
    modelValue: { type: Boolean, required: true },
    id: { type: String, default: 'MazCheckbox' },
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
</script>

<style lang="postcss" scoped>
  .m-checkbox {
    transition: all 300ms ease-in-out;
    cursor: pointer;
    margin-left: 2px;
    min-height: 22px;

    [type='checkbox']:not(:checked),
    [type='checkbox']:checked {
      position: absolute;
      left: -9999px;
    }

    [type='checkbox']:not(:checked) + label,
    [type='checkbox']:checked + label {
      position: relative;
      padding-left: 30px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 300ms ease-in-out;
      user-select: none;
    }

    [type='checkbox'] + label::before {
      @apply maz-border maz-border-solid maz-border-transparent;

      content: '';
      position: absolute;
      left: 0;
      width: 22px;
      height: 22px;
      background: transparent;
      border-radius: 4px;
      transition: all 300ms ease-in-out;
    }

    [type='checkbox']:focus + label::before {
      @apply maz-rounded maz-border maz-border-solid maz-border-primary;

      content: '';
      position: absolute;
      left: 0;
      width: 22px;
      height: 22px;
      background: transparent;
      transition: all 300ms ease-in-out;
    }

    [type='checkbox']:not(:checked) + label::before {
      @apply maz-border-color-light;
    }

    [type='checkbox']:not(:checked) + label::after,
    [type='checkbox']:checked + label::after {
      content: '';
      position: absolute;
      left: 5px;
      width: 12px;
      height: 12px;
      transition: all 300ms ease-in-out;
      border-radius: 2px;
    }

    [type='checkbox']:not(:checked) + label::after {
      opacity: 0;
      transform: scale(0);
    }

    [type='checkbox']:checked + label::after {
      opacity: 1;
      transform: scale(1);
    }

    &--primary {
      [type='checkbox']:checked + label::before {
        @apply maz-border-primary;
      }

      [type='checkbox']:not(:checked) + label::after,
      [type='checkbox']:checked + label::after {
        @apply maz-bg-primary maz-text-primary;
      }

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem var(--maz-color-primary-alpha);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem var(--maz-color-secondary-alpha);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem var(--maz-color-info-alpha);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem var(--maz-color-danger-alpha);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem var(--maz-color-warning-alpha);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem var(--maz-color-success-alpha);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem rgb(209 213 219 / 60%);

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

      [type='checkbox']:focus {
        + label::before {
          box-shadow: 0 0 0 0.143rem rgb(0 0 0 / 60%);

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
