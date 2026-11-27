<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style,
  id,
  modelValue,
  saved = false,
  label,
  topLabel,
  assistiveText,
  placeholder,
  replaceLabel,
  clearLabel,
  cancelLabel,
  savedText,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  size = 'md',
  roundedSize = 'md',
  color = 'primary',
  block,
} = defineProps<MazInputSecretProps>()

const emits = defineEmits<{
  /**
   * The new secret is typed. Never emitted for the saved secret: it is not known by the component
   * @property {string} value - the typed secret
   */
  'update:model-value': [value?: string]
  /** The user asks to delete the saved secret: update `saved` when it is done */
  'clear': [value: void]
  /** The user starts replacing the saved secret */
  'replace': [value: void]
  /** The user gives up replacing the saved secret, `model-value` is reset to an empty string */
  'cancel': [value: void]
}>()

export interface MazInputSecretProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the input */
  id?: string
  /** @model The new secret typed by the user (empty while the saved secret is untouched) */
  modelValue?: string
  /** A secret is already saved: it is displayed masked, with the replace and clear actions, and never read back */
  saved?: boolean
  /** The label of the field */
  label?: string
  /** Static label displayed above the field */
  topLabel?: string
  /** Text displayed below the field (help, error message) */
  assistiveText?: string
  /** The placeholder of the input when no secret is saved */
  placeholder?: string
  /**
   * The text of the replace button
   * @default 'inputSecret.replace' (translations)
   */
  replaceLabel?: string
  /**
   * The text of the clear button
   * @default 'inputSecret.clear' (translations)
   */
  clearLabel?: string
  /**
   * The text of the cancel button, shown while replacing the saved secret
   * @default 'inputSecret.cancel' (translations)
   */
  cancelLabel?: string
  /**
   * The text read by the screen readers on the masked field
   * @default 'inputSecret.savedDescription' (translations)
   */
  savedText?: string
  /** Disable the field and the buttons */
  disabled?: boolean
  /** Display the field with error style */
  error?: boolean
  /** Display the field with success style */
  success?: boolean
  /** Display the field with warning style */
  warning?: boolean
  /**
   * The size of the field and of the buttons
   * @default 'md'
   */
  size?: MazSize
  /**
   * The rounded size of the field
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * The color of the focused field and of the buttons
   * @default 'primary'
   */
  color?: MazColor
  /** The component will be displayed in full width */
  block?: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const MASK = '•'.repeat(12)

const { t } = useTranslations()

const instanceId = useInstanceUniqId({
  componentName: 'MazInputSecret',
  providedId: id,
})

const replacing = ref(false)

const isMasked = computed(() => saved && !replacing.value)

const replaceLabelValue = computed(() => replaceLabel || t('inputSecret.replace'))
const clearLabelValue = computed(() => clearLabel || t('inputSecret.clear'))
const cancelLabelValue = computed(() => cancelLabel || t('inputSecret.cancel'))
const savedTextValue = computed(() => savedText || t('inputSecret.savedDescription'))
const savedTextId = computed(() => `${instanceId.value}-saved`)

watch(() => saved, () => {
  replacing.value = false
})

function startReplace() {
  replacing.value = true
  emits('replace')
}

function cancelReplace() {
  replacing.value = false
  emits('update:model-value', '')
  emits('cancel')
}
</script>

<template>
  <div
    class="m-input-secret m-reset-css maz:inline-flex maz:items-start maz:gap-2 maz:align-top"
    :class="[classProp, { '--block': block, 'maz:w-full': block, '--saved': isMasked }]"
    :style
  >
    <MazInput
      v-if="isMasked"
      :id="instanceId"
      v-bind="$attrs"
      class="maz:min-w-0 maz:flex-1"
      :model-value="MASK"
      type="text"
      :label
      :top-label
      :assistive-text
      :size
      :color
      :rounded-size
      :aria-describedby="savedTextId"
      :disabled
      :error
      :success
      :warning
      autocomplete="off"
      readonly
      block
    />
    <MazInput
      v-else
      :id="instanceId"
      v-bind="$attrs"
      class="maz:min-w-0 maz:flex-1"
      :model-value="modelValue"
      type="password"
      :label
      :top-label
      :assistive-text
      :placeholder
      :size
      :color
      :rounded-size
      :disabled
      :error
      :success
      :warning
      :auto-focus="replacing"
      autocomplete="new-password"
      block
      @update:model-value="$emit('update:model-value', $event as string | undefined)"
    />

    <span v-if="isMasked" :id="savedTextId" class="maz:sr-only">{{ savedTextValue }}</span>

    <div
      v-if="saved"
      class="m-input-secret__actions maz:flex maz:flex-none maz:gap-2"
      :class="{ 'maz:mt-6': topLabel }"
    >
      <template v-if="isMasked">
        <MazBtn
          class="m-input-secret__replace"
          :color
          :size
          outlined
          :disabled
          @click="startReplace"
        >
          {{ replaceLabelValue }}
        </MazBtn>
        <MazBtn
          class="m-input-secret__clear"
          color="destructive"
          :size
          outlined
          :disabled
          @click="$emit('clear')"
        >
          {{ clearLabelValue }}
        </MazBtn>
      </template>
      <MazBtn
        v-else
        class="m-input-secret__cancel"
        color="transparent"
        :size
        :disabled
        @click="cancelReplace"
      >
        {{ cancelLabelValue }}
      </MazBtn>
    </div>
  </div>
</template>
