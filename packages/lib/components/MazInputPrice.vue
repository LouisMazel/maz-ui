<script lang="ts" setup>
import type { FilterCurrencyOptions } from '../modules/filters/currency'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import BanknotesIcon from '../icons/banknotes.svg'
import { currency as currencyFilter } from '../modules/filters/currency'
import MazInput from './MazInput.vue'

export interface Props {
  /** @model The value of the input */
  modelValue?: number
  /** The currency to use */
  currency?: string
  /** The locale to use */
  locale?: string
  /** The minimum value that the input can accept */
  min?: number
  /** The maximum value that the input can accept */
  max?: number
  /** The input will be displayed without icon */
  noIcon?: boolean
  /** The input will be displayed in full width */
  block?: boolean
  /** Will display the input in error state. */
  error?: boolean
  /** The hint text to display below the input. */
  hint?: string
  /** Will display the input in success state. */
  success?: boolean
  /** Will display the input in warning state. */
  warning?: boolean
  /** Options for the currency helper - [see](https://maz-ui.com/helpers/currency) */
  currencyOptions?: Omit<FilterCurrencyOptions, 'currency'>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  currency: 'EUR',
  locale: 'fr-FR',
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  noIcon: false,
})

const emits = defineEmits<{
  'update:model-value': [value: number | undefined]
  'input': [value: number | undefined]
  'formatted': [value: string | undefined]
  'blur': [value: Event]
  'focus': [value: Event]
}>()

const internalValue = ref<number | undefined>(getAdjustedPrice(props.modelValue))
watch(() => props.modelValue, updateInternalValue)

const isActive = ref(false)
const valueString = computed<string | undefined>(() => {
  return props.modelValue?.toString()
})
const valueNumber = computed<number | undefined>(() => {
  return props.modelValue
})

const priceFormatted = computed(() =>
  typeof valueNumber.value === 'number' ? currencyFilter(valueNumber.value, props.locale, { ...props.currencyOptions, currency: props.currency }) : undefined,
)

function getAdjustedPrice(value?: string | number) {
  const isNegative = typeof value === 'string' && value.startsWith('-')

  let newValue = typeof value === 'string'
    ? Number.parseFloat(value.replace(',', '.').replaceAll(/[^\d.]/g, ''))
    : value

  newValue = isNegative && newValue ? -newValue : newValue

  if (typeof newValue !== 'number' || Number.isNaN(newValue))
    newValue = undefined
  if (newValue && newValue < props.min)
    newValue = props.min
  if (newValue && newValue > props.max)
    newValue = props.max

  return newValue
}

const displayPrice = computed(() => {
  if (isActive.value)
    return valueString.value
  if (typeof props.modelValue === 'number')
    return priceFormatted.value

  return undefined
})

async function emitValues(newValue?: string | number) {
  const adjustedPrice = getAdjustedPrice(newValue)
  emits('update:model-value', adjustedPrice)

  await nextTick()
  emits('formatted', priceFormatted.value)
}

onMounted(() => {
  emitValues(props.modelValue)
})

function onBlur(event: Event) {
  isActive.value = false
  emitValues(internalValue.value)
  emits('blur', event)
}
function onFocus(event: Event) {
  isActive.value = true
  emits('focus', event)
}
function onInput() {
  emits('input', internalValue.value)
}
function updateInternalValue(value?: string | number) {
  internalValue.value = getAdjustedPrice(value)
}
</script>

<template>
  <MazInput
    :model-value="displayPrice"
    class="maz-input-price"
    :block
    :error
    :success
    :warning
    :hint
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @keydown.enter="emitValues(internalValue)"
    @update:model-value="updateInternalValue($event)"
  >
    <template #left-icon>
      <slot v-if="!noIcon" name="left-icon">
        <BanknotesIcon class="maz-text-xl" />
      </slot>
    </template>
  </MazInput>
</template>
