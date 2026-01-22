<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { ComputedRef, Ref } from 'vue'
import type {
  ErrorMessageValue,
  FieldsValidationStates,
} from '../composables/useFormBuilder'
import { computed, inject, nextTick, ref, useId, watch } from 'vue'
import { FORM_BUILDER_STATE_KEY } from '../utils/constants'

export interface ErrorSummaryOptions {
  position?: 'top' | 'bottom'
  selector?: string
}

export interface FormErrorSummaryProps {
  errorSummary?: ErrorSummaryOptions | boolean
}

export interface ErrorSummarySlotProps {
  errors: Partial<Record<string, unknown>>
  errorMessages: Partial<Record<string, ErrorMessageValue>>
  errorCount: number
  isSubmitted: boolean
}

interface FormBuilderStateContext<T extends Record<string, unknown>> {
  isValid: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  isDirty: ComputedRef<boolean>
  errors: ComputedRef<Partial<Record<keyof T, unknown>>>
  errorMessages: ComputedRef<Partial<Record<keyof T, ErrorMessageValue>>>
  fieldsStates: Ref<FieldsValidationStates<T>>
}

interface ErrorItem {
  fieldName: string
  message: string
  selector: string
}

const props = withDefaults(defineProps<FormErrorSummaryProps>(), {
  errorSummary: undefined,
})

const formBuilderState = inject<ComputedRef<FormBuilderStateContext<T>> | null>(
  FORM_BUILDER_STATE_KEY,
  null,
)

const summaryElement = ref<HTMLElement | null>(null)

const summaryUniqueId = useId()
const headingId = computed(() => `${summaryUniqueId}-heading`)
const listId = computed(() => `${summaryUniqueId}-list`)

const isEnabled = computed(() => {
  return props.errorSummary !== undefined && props.errorSummary !== false
})

const errorItems = computed<ErrorItem[]>(() => {
  if (!formBuilderState?.value || !isEnabled.value) {
    return []
  }

  const items: ErrorItem[] = []
  const errorMessages = formBuilderState.value.errorMessages.value
  const fieldsStates = formBuilderState.value.fieldsStates.value

  for (const fieldName in fieldsStates) {
    const state = fieldsStates[fieldName as keyof T]
    if (!state?.error) {
      continue
    }

    const message = errorMessages[fieldName as keyof T]
    if (!message) {
      continue
    }

    const messages = Array.isArray(message) ? message : [message]
    for (const msg of messages) {
      items.push({
        fieldName,
        message: msg,
        selector: `[data-field-name="${fieldName}"]`,
      })
    }
  }

  return items
})

const hasErrors = computed(() => {
  return errorItems.value.length > 0
})

const isSubmitted = computed(() => {
  return formBuilderState?.value?.isSubmitted.value ?? false
})

const showSummary = computed(() => {
  return isEnabled.value && hasErrors.value && isSubmitted.value
})

function scrollToField(selector: string): void {
  const element = document.querySelector(selector)
    ?? document.querySelector(`[data-field-name="${selector.replace('[data-field-name="', '').replace('"]', '')}"]`)
    ?? document.querySelector(`.maz-form-field:has([name="${selector.replace('[data-field-name="', '').replace('"]', '')}"])`)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = element.querySelector('input, textarea, select, [tabindex]:not([tabindex="-1"])')
    if (input instanceof HTMLElement) {
      input.focus()
    }
  }
}

function scrollToSummary(): void {
  nextTick(() => {
    if (summaryElement.value) {
      summaryElement.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

watch(
  () => [isSubmitted.value, hasErrors.value],
  ([submitted, errors]) => {
    if (submitted && errors && isEnabled.value) {
      scrollToSummary()
    }
  },
)

defineExpose({
  scrollToSummary,
  scrollToField,
  errorItems,
  hasErrors,
})
</script>

<template>
  <div
    v-if="showSummary"
    ref="summaryElement"
    class="maz-form-error-summary"
    role="alert"
    aria-live="polite"
    :aria-labelledby="headingId"
    :aria-describedby="listId"
    tabindex="-1"
  >
    <div class="maz-form-error-summary__header">
      <span class="maz-form-error-summary__icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <h2
        :id="headingId"
        class="maz-form-error-summary__title"
      >
        {{ errorItems.length }} error{{ errorItems.length > 1 ? 's' : '' }} found
      </h2>
    </div>
    <ul
      :id="listId"
      class="maz-form-error-summary__list"
    >
      <li
        v-for="(error, index) in errorItems"
        :key="`${error.fieldName}-${index}`"
        class="maz-form-error-summary__item"
      >
        <button
          type="button"
          class="maz-form-error-summary__link"
          :aria-label="`Go to field with error: ${error.message}`"
          @click="scrollToField(error.selector)"
          @keydown.enter="scrollToField(error.selector)"
          @keydown.space.prevent="scrollToField(error.selector)"
        >
          {{ error.message }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.maz-form-error-summary {
  background-color: var(--maz-color-danger-50, #fef2f2);
  border: 1px solid var(--maz-color-danger-200, #fecaca);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.maz-form-error-summary__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.maz-form-error-summary__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--maz-color-danger, #dc2626);
}

.maz-form-error-summary__icon svg {
  width: 100%;
  height: 100%;
}

.maz-form-error-summary__title {
  font-weight: 600;
  color: var(--maz-color-danger-800, #991b1b);
  font-size: 0.875rem;
}

.maz-form-error-summary__list {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-left: 1.75rem;
}

.maz-form-error-summary__item {
  margin-bottom: 0.25rem;
}

.maz-form-error-summary__item:last-child {
  margin-bottom: 0;
}

.maz-form-error-summary__link {
  background: none;
  border: none;
  padding: 0;
  color: var(--maz-color-danger-700, #b91c1c);
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
  text-align: left;
}

.maz-form-error-summary__link:hover {
  color: var(--maz-color-danger-900, #7f1d1d);
}

.maz-form-error-summary__link:focus {
  outline: 2px solid var(--maz-color-danger-500, #ef4444);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Dark mode support */
:root.dark .maz-form-error-summary,
.dark .maz-form-error-summary {
  background-color: var(--maz-color-danger-950, #450a0a);
  border-color: var(--maz-color-danger-800, #991b1b);
}

:root.dark .maz-form-error-summary__title,
.dark .maz-form-error-summary__title {
  color: var(--maz-color-danger-200, #fecaca);
}

:root.dark .maz-form-error-summary__link,
.dark .maz-form-error-summary__link {
  color: var(--maz-color-danger-300, #fca5a5);
}

:root.dark .maz-form-error-summary__link:hover,
.dark .maz-form-error-summary__link:hover {
  color: var(--maz-color-danger-100, #fee2e2);
}
</style>
