<script lang="ts" setup>
import type { ExportFormat } from './serialize'
import { computed, ref } from 'vue'
import { exportCode } from './serialize'
import { useThemeEditor } from './useThemeEditor'

const editor = useThemeEditor()

const FORMATS = [
  {
    label: 'Vue',
    value: 'vue',
    filename: 'main.ts',
    description: 'Pass the base preset and your changes to the MazUi plugin.',
  },
  {
    label: 'Nuxt',
    value: 'nuxt',
    filename: 'nuxt.config.ts',
    description: 'Set them in the options of the @maz-ui/nuxt module.',
  },
  {
    label: 'Preset file',
    value: 'preset',
    filename: 'theme.ts',
    description: 'A reusable preset to share between apps, then pass it as preset.',
  },
] as const

const format = ref<ExportFormat>('vue')

const current = computed(() => FORMATS.find(item => item.value === format.value)!)

const code = computed(() => exportCode({
  format: format.value,
  base: editor.base.value,
  overrides: editor.overrides.value,
  name: editor.themeName.value,
}))
</script>

<template>
  <div class="maz:grid maz:gap-8 maz:lap-s:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] maz:lap-s:items-start">
    <div class="maz:flex maz:flex-col maz:gap-5">
      <MazTabsBar
        v-model="format"
        :items="FORMATS.map(({ label, value }) => ({ label, value }))"
        standalone
        size="sm"
        aria-label="Export format"
      />
      <p class="maz:m-0 maz:text-body maz:text-muted">
        {{ current.description }}
      </p>
      <MazInput
        v-if="format === 'preset'"
        v-model="editor.themeName.value"
        label="Theme name"
        size="sm"
        block
        debounce
      />
      <ul class="maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-2 maz:p-0 maz:text-body-sm maz:text-muted">
        <li>Only your changes are exported: the rest comes from <strong class="maz:text-foreground">{{ editor.base.value.label }}</strong>.</li>
        <li>The theme switches between light and dark by itself.</li>
        <li>
          Fonts are not loaded by Maz-UI: add them to your app.
        </li>
      </ul>
      <p v-if="editor.changeCount.value === 0" class="maz:m-0 maz:text-caption">
        No change yet: the preset alone is enough, <code class="maz:text-code">preset: '{{ editor.base.value.preset.name }}'</code>.
      </p>
    </div>
    <MazWindowMockup variant="editor" :filename="current.filename" :code language="ts" class="maz:min-w-0" />
  </div>
</template>
