<template>
  <MazInput
    v-model="displayPrice"
    class="maz-input-price"
    v-bind="$attrs"
    @focus="isActive = true"
    @blur="isActive = false"
  >
    <template #left-icon>
      <slot v-if="!noIcon" name="left-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          class="maz-text-mute maz-ml-1 maz-h-6 maz-w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </slot>
    </template>
  </MazInput>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeMount, ref } from 'vue'
  import { currency as currencyFilter } from '../modules'
  import MazInput from './MazInput.vue'

  const props = defineProps({
    modelValue: { type: [Number, String], default: undefined },
    currency: { type: String, default: 'EUR' },
    locale: { type: String, default: 'fr-FR' },
    min: { type: Number, default: 0 },
    max: { type: Number, default: Number.POSITIVE_INFINITY },
    noIcon: { type: Boolean, default: false },
  })

  const emits = defineEmits(['update:model-value', 'formatted'])

  const isActive = ref(false)
  const valueString = computed<string>(() => {
    return getAdjustedPrice(props.modelValue).toString()
  })
  const valueNumber = computed<number>(() => {
    const value = typeof props.modelValue === 'string' ? Number(props.modelValue) : props.modelValue

    return getAdjustedPrice(value)
  })

  const priceFormatted = computed(() =>
    currencyFilter(valueNumber.value, props.locale, { currency: props.currency }),
  )

  const getAdjustedPrice = (value?: string | number) => {
    let newValue =
      typeof value === 'string'
        ? Number.parseFloat(
            // eslint-disable-next-line no-useless-escape
            value.replace(',', '.').replaceAll(/[^\d.]/g, ''),
          )
        : value
    if (!newValue || Number.isNaN(newValue)) newValue = 0
    if (newValue < props.min) newValue = props.min
    if (newValue > props.max) newValue = props.max

    return newValue
  }

  const displayPrice = computed({
    get: () => {
      if (isActive.value) return valueString.value
      if (typeof props.modelValue === 'number') return priceFormatted.value
      return undefined
    },
    set: (value) => {
      if (Number.isNaN(value)) {
        emitValues()
      } else {
        const adjustedPrice = getAdjustedPrice(value)
        emitValues(adjustedPrice)
      }
    },
  })

  const emitValues = async (newValue?: number) => {
    const adjustedPrice = typeof newValue === 'number' ? getAdjustedPrice(newValue) : undefined
    emits('update:model-value', adjustedPrice)

    await nextTick()
    emits('formatted', priceFormatted.value)
  }

  onBeforeMount(() => {
    emitValues(getAdjustedPrice(props.modelValue))
  })
</script>
