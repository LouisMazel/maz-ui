<script lang="ts" setup>
import { MazSwatch } from '@maz-ui/icons/raw/MazSwatch'
import { useTheme } from '@maz-ui/themes/composables/useTheme'

const { presetName, updateTheme } = useTheme()

const presets = [
  { label: 'Maz UI', value: 'maz-ui' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Obsidian', value: 'obsidian' },
  { label: 'Pristine', value: 'pristine' },
  { label: 'Nova', value: 'nova' },
]
</script>

<template>
  <MazDropdown
    color="transparent"
    transition="scale-fade"
    prefer-position="bottom-end"
    aria-label="Switch theme preset"
    :icon="{
      icon: MazSwatch,
      size: 'md',
    }"
    size="sm"
  >
    <template #dropdown>
      <div class="theme-switcher__panel maz:flex maz:min-w-44 maz:flex-col maz:gap-2 maz:p-1">
        <p class="maz:px-2 maz:pt-1 maz:text-xs maz:font-semibold maz:tracking-wide maz:text-muted maz:uppercase">
          Theme preset
        </p>

        <MazRadioButtons
          size="sm"
          :model-value="presetName"
          orientation="vertical"
          :options="presets"
          @update:model-value="updateTheme($event)"
        />
      </div>
    </template>
  </MazDropdown>
</template>
