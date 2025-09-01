<script lang="ts" setup>
import type { FilterCurrencyOptions } from '@maz-ui/utils/helpers/formatCurrency'
import { MazBanknotes } from '@maz-ui/icons'
import { formatCurrency } from '@maz-ui/utils/helpers/formatCurrency'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MazInput from './MazInput.vue'

const props = withDefaults(defineProps<MazInputPriceProps>(), {
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

export interface MazInputPriceProps {
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
  typeof valueNumber.value === 'number' ? formatCurrency(valueNumber.value, props.locale, { ...props.currencyOptions, currency: props.currency }) : undefined,
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
  emitValues(internalValue.value)
}
function updateInternalValue(value?: string | number) {
  internalValue.value = getAdjustedPrice(value)
}
</script>

<template>
  <MazInput
    :model-value="displayPrice"
    class="maz-input-price m-reset-css"
    :block
    :error
    :success
    :warning
    :hint
    :left-icon="noIcon ? undefined : MazBanknotes"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @keydown.enter="emitValues(internalValue)"
    @update:model-value="updateInternalValue($event)"
  />
</template>
