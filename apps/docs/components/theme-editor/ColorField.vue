<script lang="ts" setup>
import type { EditorPath } from './useThemeEditor'
import { computed } from 'vue'
import EditorField from './EditorField.vue'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const { label, path, hint } = defineProps<{
  label: string
  path: EditorPath
  hint?: string
}>()

const editor = useThemeEditor()

const SWATCH_ROLES = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'destructive',
  'surface',
  'foreground',
] as const

/** Plain colors use the picker, CSS expressions (`var()`, `light-dark()`, `color-mix()`) stay a text field */
const PLAIN_COLOR = /^(?:#|rgba?\(|hsla?\(|oklch\(|oklab\(|transparent$)/i

const value = computed(() => editor.get(path))

const isPlainColor = computed(() => !value.value || PLAIN_COLOR.test(value.value.trim()))

const swatches = computed(() => {
  const colors = editor.draft.value.colors[editor.mode.value] as unknown as Record<string, string>

  return [
    ...new Set(SWATCH_ROLES.map(role => colors[role]).filter((color): color is string => !!color && PLAIN_COLOR.test(color))),
  ]
})
</script>

<template>
  <EditorField :label :paths="[path]" :hint>
    <MazColorPicker
      v-if="isPlainColor"
      :model-value="value"
      format="oklch"
      :swatches
      :aria-label="label"
      size="sm"
      block
      @update:model-value="editor.set(path, $event)"
    />
    <div v-else class="maz:flex maz:items-center maz:gap-2">
      <span
        v-bind="{ [PREVIEW_ATTRIBUTE]: '' }"
        class="maz:size-9 maz:shrink-0 maz:rounded-md maz:border maz:border-divider maz:shadow-[inset_0_0_0_0.071429rem_rgb(0_0_0/0.12)]"
        :style="{ background: value }"
        aria-hidden="true"
      />
      <MazInput
        :model-value="value"
        :aria-label="label"
        size="sm"
        block
        debounce
        input-classes="maz:font-mono maz:text-xs"
        @update:model-value="editor.set(path, $event)"
      />
    </div>
  </EditorField>
</template>
