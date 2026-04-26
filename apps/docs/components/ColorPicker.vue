<script setup lang="ts">
import type { CSSColor } from '@maz-ui/themes'
import { colorToHex, formatAsOklch, parseColorAsOklch } from '@maz-ui/themes/utils/color-parser'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: CSSColor
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: CSSColor]
}>()

const colorInput = ref<HTMLInputElement>()

const hexValue = computed(() => colorToHex(props.modelValue))

function handleColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  const oklch = formatAsOklch(parseColorAsOklch(target.value))
  emit('update:modelValue', oklch)
}

watch(() => props.modelValue, () => {
  if (colorInput.value) {
    colorInput.value.value = hexValue.value
  }
}, { immediate: true })
</script>

<template>
  <div class="color-picker">
    <label v-if="label" for="input-color">
      {{ label }}
    </label>

    <input
      id="input-color"
      ref="colorInput"
      type="color"
      :value="hexValue"
      :disabled="disabled"
      @change="handleColorChange"
    >
  </div>
</template>

<style scoped>
@reference "../.vitepress/theme/main.css";
.color-picker {
  @apply maz:inline-flex maz:flex-col maz:gap-1;

  label {
    @apply maz:text-sm maz:font-medium maz:text-foreground maz:truncate;
  }

  input[type='color'] {
    -webkit-appearance: none;
    appearance: none;
    background: none;
    cursor: pointer;

    @apply maz:h-10 maz:w-full maz:cursor-pointer maz:overflow-hidden maz:rounded maz:border maz:border-solid maz:border-divider maz:disabled:cursor-not-allowed maz:disabled:opacity-50;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
    }

    &::-moz-color-swatch {
      border: none;
    }
  }
}
</style>
