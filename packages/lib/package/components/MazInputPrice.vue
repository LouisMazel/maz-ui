<template>
  <MazInput
    v-model="displayPrice"
    class="maz-input-price"
    v-bind="$attrs"
    left-icon="cash"
    @focus="isActive = true"
    @blur="isActive = false"
  />
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeMount, ref } from 'vue'
  import { currency } from '../filters'
  import MazInput from './MazInput.vue'

  const props = defineProps({
    modelValue: { type: [Number, String], default: undefined },
    currency: { type: String, default: 'EUR' },
    locale: { type: String, default: 'fr-FR' },
    min: { type: Number, default: 0 },
    max: { type: Number, default: Infinity },
  })

  const emits = defineEmits(['update:model-value', 'formatted'])

  const isActive = ref(false)
  const valueString = computed<string>(() => {
    return typeof props.modelValue === 'number'
      ? getAdjustedPrice(props.modelValue).toString()
      : getAdjustedPrice(props.modelValue).toString()
  })
  const valueNumber = computed<number>(() => {
    const value =
      typeof props.modelValue === 'string'
        ? Number(props.modelValue)
        : props.modelValue

    return getAdjustedPrice(value)
  })

  const priceFormatted = computed(() =>
    currency(valueNumber.value, props.locale, { currency: props.currency }),
  )

  const getAdjustedPrice = (value?: string | number) => {
    let newValue =
      typeof value === 'string'
        ? parseFloat(
            // eslint-disable-next-line no-useless-escape
            value.replace(',', '.').replace(/[^\d\.]/g, ''),
          )
        : value
    if (!newValue || isNaN(newValue)) newValue = 0
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
        emitValues(undefined)
      } else {
        const adjustedPrice = getAdjustedPrice(value)
        emitValues(adjustedPrice)
      }
    },
  })

  const emitValues = async (newValue?: number) => {
    const adjustedPrice =
      typeof newValue === 'number' ? getAdjustedPrice(newValue) : undefined
    emits('update:model-value', adjustedPrice)

    await nextTick()
    emits('formatted', priceFormatted.value)
  }

  onBeforeMount(() => {
    emitValues(getAdjustedPrice(props.modelValue))
  })
</script>
