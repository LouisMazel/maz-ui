<template>
  <div
    class="maz-textarea maz-flex maz-flex-col"
    :class="{
      '--is-disabled': disabled,
    }"
  >
    <label
      v-if="label || hint"
      ref="label"
      :for="instanceId"
      class="m-input-label"
      :class="[
        {
          'maz-text-danger-600': error,
          'maz-text-success-600': success,
          'maz-text-warning-600': warning,
        },
      ]"
    >
      {{ hint || label }}
      <sup v-if="required">*</sup>
    </label>

    <!-- eslint-disable vue/no-deprecated-html-element-is -->
    <textarea
      :id="instanceId"
      ref="TextareaElement"
      v-bind="$attrs"
      v-model="inputValue"
      :name="name"
      :disabled="disabled"
    />
    <!-- eslint-enable vue/no-deprecated-html-element-is -->
  </div>
</template>

<script lang="ts" setup>
  import { useInstanceUniqId } from '@package/helpers'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { getCurrentInstance } from 'vue'
  import { TextareaAutogrow } from './MazTextarea/textarea-autogrow'

  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined,
    },
    id: { type: String, default: undefined },
    name: { type: String, default: 'MazTextarea' },
    // placeholder: { type: String, default: undefined },
    label: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    warning: { type: Boolean, default: false },
    hint: { type: String, default: undefined },
  })

  const emits = defineEmits(['input'])

  const instance = getCurrentInstance()

  let textareaAutogrow: TextareaAutogrow | undefined

  const { instanceId } = useInstanceUniqId({
    componentName: 'MazInput',
    instance,
    providedId: props.id,
  })

  const TextareaElement = ref<HTMLTextAreaElement>()

  onMounted(() => {
    if (TextareaElement.value) {
      textareaAutogrow = new TextareaAutogrow(TextareaElement.value)
      textareaAutogrow.connect()
    }
  })

  onBeforeUnmount(() => {
    textareaAutogrow?.disconnect()
  })

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value: unknown) => emits('input', value),
  })
</script>

<style lang="postcss" scoped>
  .maz-textarea {
    @apply maz-flex maz-flex-col;

    textarea {
      @apply maz-min-h-[6.25rem] maz-w-full maz-resize-y maz-rounded-lg maz-border
        maz-border-gray-200 maz-bg-color maz-py-4 maz-px-4 maz-text-normal;
    }

    &.--is-disabled {
      textarea {
        @apply maz-cursor-not-allowed maz-border-gray-200 maz-bg-color-lighter maz-text-muted;
      }
    }
  }

  html.dark {
    & .maz-textarea {
      textarea {
        @apply maz-border-color-lighter maz-bg-color-light;
      }

      &.--is-disabled {
        textarea {
          @apply maz-border-color-lighter;
        }
      }
    }
  }
</style>
