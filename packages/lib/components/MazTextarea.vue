<template>
  <div
    class="m-textarea"
    :class="[
      {
        '--is-disabled': disabled,
        '--has-label': hasLabelOrHint,
      },
      props.class,
    ]"
    :style="style"
  >
    <!-- eslint-disable vuejs-accessibility/label-has-for -->
    <label
      v-if="hasLabelOrHint"
      :for="instanceId"
      class="m-textarea__label"
      :class="[
        {
          'maz-text-danger-600': error,
          'maz-text-success-600': success,
          'maz-text-warning-600': warning,
          '--has-state': error || warning || success,
          '--should-up': shouldUp,
        },
      ]"
    >
      {{ hint || label }}
      <sup v-if="required">*</sup>
    </label>
    <!-- eslint-enable vuejs-accessibility/label-has-for -->

    <textarea
      :id="instanceId"
      ref="TextareaElement"
      v-bind="$attrs"
      v-model="inputValue"
      :placeholder="placeholder"
      :name="name"
      :disabled="disabled"
      :required="required"
      :class="[borderStyle]"
      v-on="{
        blur,
        focus,
        change,
      }"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    getCurrentInstance,
    type HTMLAttributes,
  } from 'vue'
  import { TextareaAutogrow } from './MazTextarea/textarea-autogrow'
  import type { Color } from './types'
  export type { Color }

  defineOptions({
    inheritAttrs: false,
  })

  export type Props = {
    style?: HTMLAttributes['style']
    class?: HTMLAttributes['class']
    modelValue?: string
    id?: string
    name?: string
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    error?: boolean
    success?: boolean
    warning?: boolean
    hint?: string
    color?: Color
  }

  const props = withDefaults(defineProps<Props>(), {
    style: undefined,
    class: undefined,
    modelValue: undefined,
    id: undefined,
    name: 'MazTextarea',
    label: undefined,
    placeholder: undefined,
    required: false,
    disabled: false,
    readonly: false,
    error: false,
    success: false,
    warning: false,
    hint: undefined,
    color: 'primary',
  })

  const emits = defineEmits(['input', 'focus', 'blur', 'change'])

  const instance = getCurrentInstance()

  let textareaAutogrow: TextareaAutogrow | undefined

  const instanceId = useInstanceUniqId({
    componentName: 'MazTextarea',
    instance,
    providedId: props.id,
  })

  const TextareaElement = ref<HTMLTextAreaElement>()
  const isFocused = ref(false)
  const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== '')

  onMounted(() => {
    if (TextareaElement.value) {
      textareaAutogrow = new TextareaAutogrow(TextareaElement.value)
    }
  })

  onBeforeUnmount(() => {
    textareaAutogrow?.disconnect()
  })

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value: unknown) => emits('input', value),
  })

  const focus = (event: Event) => {
    emits('focus', event)
    isFocused.value = true
  }

  const blur = (event: Event) => {
    emits('blur', event)
    isFocused.value = false
  }

  const change = (event: Event) => emits('change', event)

  const hasLabelOrHint = computed(() => props.label || props.hint)

  const shouldUp = computed(
    () => hasLabelOrHint.value && (isFocused.value || hasValue.value || !!props.placeholder),
  )

  const borderStyle = computed(() => {
    if (props.error) return 'maz-border-danger'
    if (props.success) return 'maz-border-success'
    if (props.warning) return 'maz-border-warning'
    if (isFocused.value) {
      if (props.color === 'black') return 'maz-border-black'
      if (props.color === 'danger') return 'maz-border-danger'
      if (props.color === 'info') return 'maz-border-info'
      if (props.color === 'primary') return 'maz-border-primary'
      if (props.color === 'secondary') return 'maz-border-secondary'
      if (props.color === 'success') return 'maz-border-success'
      if (props.color === 'warning') return 'maz-border-warning'
      if (props.color === 'white') return 'maz-border-white'
    }
    return '--default-border'
  })
</script>

<style lang="postcss" scoped>
  .m-textarea {
    @apply maz-relative maz-flex maz-flex-col;

    textarea {
      @apply maz-min-h-[6.25rem] maz-w-full maz-resize-y maz-rounded maz-border maz-border-solid maz-bg-color maz-p-4 maz-text-normal maz-outline-none;

      &.--default-border {
        @apply maz-border-gray-200;
      }
    }

    &.--has-label {
      textarea {
        @apply maz-pt-6;
      }
    }

    &.--is-disabled {
      textarea {
        @apply maz-cursor-not-allowed maz-border-gray-200 maz-bg-color-lighter maz-text-muted;
      }
    }

    &__label {
      @apply maz-pointer-events-none maz-absolute maz-block maz-w-max maz-origin-top-left maz-truncate;
      @apply maz-left-4 maz-top-3 maz-leading-6;
      @apply maz-flex maz-flex-center;

      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

      &.--should-up {
        transform: scale(0.8) translateY(-0.65rem);
      }

      &:not(.--has-state) {
        @apply maz-text-muted;
      }
    }
  }

  html.dark {
    & .m-textarea {
      textarea {
        @apply maz-bg-color-light;

        &.--default-border {
          @apply maz-border-color-lighter;
        }
      }

      &.--is-disabled {
        textarea {
          @apply maz-border-color-lighter;
        }
      }
    }
  }
</style>
