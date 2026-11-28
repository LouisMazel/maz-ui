<script lang="ts" setup>
import { MazPencil } from '@maz-ui/icons/static/MazPencil'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'
import MazIcon from './MazIcon.vue'
import MazRollingText from './MazRollingText.vue'

export interface MazInlineEditProps {
  /**
   * The text
   * @model
   */
  modelValue?: string
  /**
   * Shown (muted) when the text is empty, and in the empty field
   */
  placeholder?: string
  /**
   * Checks the text before it is saved: return `true` when it is valid, or the error message (shown under the field).
   * The text is not saved until it is valid
   * @example (value) => value.length > 2 || 'At least 3 characters'
   */
  validate?: (value: string) => true | string
  /**
   * HTML tag of the displayed text, to keep the right level of heading
   * @default 'span'
   * @example 'h1'
   */
  tag?: string
  /**
   * Leaving the field (blur) saves the text. When `false`, it restores the old text
   * @default true
   */
  submitOnBlur?: boolean
  /**
   * Accessible name of the field
   * @default Translated `Edit`
   */
  label?: string
  /**
   * Disables the editing
   * @default false
   */
  disabled?: boolean
}

export interface MazInlineEditEmits {
  /**
   * Emitted with the new text when it is saved
   */
  (event: 'update:model-value', value: string): void
  /**
   * Emitted with the new text when it is saved (Enter, or blur with `submitOnBlur`)
   */
  (event: 'submit', value: string): void
  /**
   * Emitted when the editing is cancelled (Escape, or blur without `submitOnBlur`)
   */
  (event: 'cancel'): void
}

const {
  modelValue = '',
  placeholder,
  validate,
  tag = 'span',
  submitOnBlur = true,
  label,
  disabled = false,
} = defineProps<MazInlineEditProps>()

const emit = defineEmits<MazInlineEditEmits>()

const SAVED_DURATION = 1400

const { t } = useTranslations()
const instanceId = useInstanceUniqId({ componentName: 'MazInlineEdit' })

const input = useTemplateRef<HTMLInputElement>('input')
const display = useTemplateRef<HTMLButtonElement>('display')

const editing = ref(false)
const draft = ref(modelValue)
const shown = ref(modelValue)
const snap = ref(false)
const error = ref<string>()
const saved = ref(false)
let savedTimer: ReturnType<typeof setTimeout> | undefined

watch(() => modelValue, (value) => {
  if (!editing.value)
    shown.value = value
})

onBeforeUnmount(() => clearTimeout(savedTimer))

const editLabel = computed(() => label || t('inlineEdit.edit'))
const errorId = computed(() => `${instanceId.value}-error`)
const sizerText = computed(() => draft.value || placeholder || '')
const displayText = computed(() => shown.value || placeholder || '')

async function start() {
  if (disabled || editing.value)
    return

  clearTimeout(savedTimer)
  saved.value = false
  draft.value = modelValue
  error.value = undefined
  editing.value = true
  await nextTick()
  input.value?.focus()
  input.value?.select()
}

async function finish(focusBack: boolean) {
  editing.value = false

  if (focusBack) {
    await nextTick()
    display.value?.focus()
  }
}

async function submit(focusBack = true) {
  const value = draft.value
  const result = validate ? validate(value) : true

  if (result !== true) {
    error.value = result
    input.value?.focus()
    return false
  }

  error.value = undefined
  const changed = value !== modelValue
  shown.value = value
  await finish(focusBack)

  if (changed)
    emit('update:model-value', value)
  emit('submit', value)

  saved.value = true
  savedTimer = setTimeout(() => {
    saved.value = false
  }, SAVED_DURATION)

  return true
}

async function cancel(focusBack = true) {
  if (!editing.value)
    return

  snap.value = true
  shown.value = draft.value
  await nextTick()
  snap.value = false
  error.value = undefined
  shown.value = modelValue
  await finish(focusBack)
  emit('cancel')
}

async function onBlur() {
  if (!editing.value)
    return

  if (!submitOnBlur) {
    await cancel(false)
    return
  }

  if (!(await submit(false)))
    await cancel(false)
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault()
    submit()
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    cancel()
  }
}

function onDisplayKeydown(event: KeyboardEvent) {
  if (event.key === 'F2') {
    event.preventDefault()
    start()
  }
}

function onInput() {
  if (error.value)
    error.value = undefined
}
</script>

<template>
  <component :is="tag" class="m-inline-edit m-reset-css" :class="{ '--editing': editing, '--disabled': disabled }">
    <span class="m-inline-edit__grid">
      <button
        ref="display"
        type="button"
        class="m-inline-edit__display"
        :class="{ '--empty': !shown, '--hidden': editing }"
        :disabled
        :tabindex="editing ? -1 : undefined"
        :aria-hidden="editing || undefined"
        @click="start"
        @keydown="onDisplayKeydown"
      >
        <MazRollingText :value="displayText" :animated="!snap" class="m-inline-edit__text" />
        <span class="maz:sr-only">, {{ editLabel }}</span>
      </button>

      <template v-if="editing">
        <span class="m-inline-edit__sizer" aria-hidden="true">{{ sizerText }}</span>
        <input
          ref="input"
          v-model="draft"
          type="text"
          class="m-inline-edit__input"
          :placeholder
          :aria-label="editLabel"
          :aria-invalid="!!error || undefined"
          :aria-describedby="error ? errorId : undefined"
          @keydown="onInputKeydown"
          @input="onInput"
          @blur="onBlur"
        >
      </template>
    </span>

    <MazIcon v-if="!editing && !saved && !disabled" :icon="MazPencil" class="m-inline-edit__hint" aria-hidden="true" />
    <MazDrawnIcon v-if="saved && !editing" name="check" class="m-inline-edit__saved" />

    <span v-if="error" :id="errorId" class="m-inline-edit__error" role="alert">{{ error }}</span>
  </component>
</template>

<style scoped>
.m-inline-edit {
  position: relative;
  display: inline-block;
  max-inline-size: 100%;
  vertical-align: bottom;
}

.m-inline-edit__grid {
  display: inline-grid;
  margin-inline: -0.25em;
  max-inline-size: 100%;
}

.m-inline-edit__grid > * {
  grid-area: 1 / 1;
}

.m-inline-edit__display,
.m-inline-edit__input {
  box-sizing: border-box;
  min-inline-size: 0;
  margin: 0;
  padding-block: 0;
  padding-inline: 0.25em;
  border: 0;
  border-radius: 0.25em;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-align: start;
}

.m-inline-edit__display {
  cursor: text;
  outline: var(--maz-focus-ring-width, 2px) solid transparent;
  outline-offset: 1px;
  transition:
    background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    outline-color calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-inline-edit__display:hover:not(:disabled) {
  background-color: color-mix(in oklab, var(--maz-foreground) 7%, transparent);
}

.m-inline-edit__display:focus-visible {
  outline-color: var(--maz-focus-ring-color, var(--maz-primary));
}

.m-inline-edit__display:disabled {
  cursor: default;
}

.m-inline-edit__display.--empty {
  color: var(--maz-muted, color-mix(in oklab, var(--maz-foreground) 55%, transparent));
}

.m-inline-edit__display.--hidden {
  visibility: hidden;
}

.m-inline-edit__text {
  white-space: pre;
}

.m-inline-edit__sizer {
  padding-block: 0;
  padding-inline: 0.25em;
  visibility: hidden;
  white-space: pre;
  pointer-events: none;
}

.m-inline-edit__input {
  inline-size: 0;
  min-inline-size: 100%;
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
  outline-offset: 1px;
  background-color: var(--maz-input-bg, var(--maz-container, transparent));
}

.m-inline-edit__input[aria-invalid='true'] {
  outline-color: var(--maz-destructive);
}

.m-inline-edit__input::placeholder {
  color: var(--maz-muted, color-mix(in oklab, var(--maz-foreground) 55%, transparent));
}

.m-inline-edit__hint,
.m-inline-edit__saved {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 100%;
  translate: 0 -50%;
  margin-inline-start: 0.2em;
  font-size: max(0.8em, 1.125rem);
  pointer-events: none;
}

.m-inline-edit__hint {
  color: color-mix(in oklab, var(--maz-foreground) 65%, transparent);
  opacity: 0;
  transition: opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-inline-edit:hover .m-inline-edit__hint,
.m-inline-edit:focus-within .m-inline-edit__hint {
  opacity: 1;
}

.m-inline-edit__saved {
  color: var(--maz-success);
}

.m-inline-edit__error {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: -0.25em;
  margin-block-start: 0.375rem;
  padding-inline: 0.25em;
  color: var(--maz-destructive);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.25;
  white-space: nowrap;
}
</style>
