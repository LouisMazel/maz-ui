<script lang="ts" setup>
import type { EditorPath } from './useThemeEditor'
import { MazArrowUturnLeft } from '@maz-ui/icons/raw/MazArrowUturnLeft'
import { vTooltip } from 'maz-ui/directives/vTooltip'
import { computed } from 'vue'
import { useThemeEditor } from './useThemeEditor'

const { label, paths, hint, value } = defineProps<{
  label: string
  paths: readonly EditorPath[]
  hint?: string
  /** Value shown next to the label (slider fields) */
  value?: string
}>()

const editor = useThemeEditor()

const modified = computed(() => paths.some(path => editor.isModified(path)))

function reset() {
  for (const path of paths) editor.resetPath(path)
}
</script>

<template>
  <div class="maz:flex maz:min-w-0 maz:flex-col maz:gap-1.5">
    <div class="maz:flex maz:min-h-6 maz:items-center maz:gap-2">
      <span v-if="modified" class="maz:size-1.5 maz:shrink-0 maz:rounded-full maz:bg-primary" aria-hidden="true" />
      <span class="maz:truncate maz:text-label maz:text-foreground">{{ label }}</span>
      <span v-if="modified" class="maz:sr-only">(modified)</span>
      <span v-if="value" class="maz:font-mono maz:text-xs maz:text-muted">{{ value }}</span>
      <MazBtn
        v-if="modified"
        v-tooltip="{ text: `Back to ${editor.base.value.label}`, position: 'top' }"
        size="mini"
        color="transparent"
        :icon="MazArrowUturnLeft"
        class="maz:ms-auto"
        :aria-label="`Reset ${label} to the value of ${editor.base.value.label}`"
        @click="reset"
      />
    </div>
    <slot />
    <p v-if="hint" class="maz:m-0 maz:text-caption">
      {{ hint }}
    </p>
  </div>
</template>
