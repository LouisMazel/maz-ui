<script lang="ts" setup generic="T extends Record<string, unknown>">
import type {
  ErrorMessageValue,
} from '../composables/useFormBuilder'
import MazAlert from 'maz-ui/components/MazAlert'
import MazLink from 'maz-ui/components/MazLink'
import { computed, inject, nextTick, ref, watch } from 'vue'
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

export interface ErrorSummaryItem {
  fieldName: string
  message: string
  selector: string
}

const {
  errorSummary,
} = defineProps<FormErrorSummaryProps>()

const formBuilderState = inject(
  FORM_BUILDER_STATE_KEY,
  null,
)

const summaryElement = ref<HTMLElement | null>(null)

const isEnabled = computed(() => {
  return errorSummary !== undefined && errorSummary !== false
})

const errorItems = computed<ErrorSummaryItem[]>(() => {
  if (!formBuilderState?.value || !isEnabled.value) {
    return []
  }

  const items: ErrorSummaryItem[] = []
  const errorMessages = formBuilderState.value.errorMessages
  const fieldsStates = formBuilderState.value.fieldsStates

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
  return formBuilderState?.value?.isSubmitted ?? false
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
  <MazAlert
    v-if="showSummary"
    ref="summaryElement"
    aria-live="polite"
    tabindex="-1"
    color="destructive"
    variant="soft"
  >
    <template #title>
      <h2>
        {{ errorItems.length }} error{{ errorItems.length > 1 ? 's' : '' }} found
      </h2>
    </template>
    <ul>
      <li
        v-for="(error, index) in errorItems"
        :key="`${error.fieldName}-${index}`"
      >
        <MazLink
          type="button"
          color="inherit"
          :aria-label="`Go to field with error: ${error.message}`"
          @click="scrollToField(error.selector)"
          @keydown.enter="scrollToField(error.selector)"
          @keydown.space.prevent="scrollToField(error.selector)"
        >
          {{ error.fieldName }} - {{ error.message }}
        </MazLink>
      </li>
    </ul>
  </MazAlert>
</template>
