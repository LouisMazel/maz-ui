<script lang="ts" setup>
import { useTheme } from '@maz-ui/themes/src/index.js'
import MazRadioButtons from 'maz-ui/components/MazRadioButtons'

const { colorMode, updateTheme, presetName } = useTheme()
</script>

<template>
  <MazDropdown
    id="dropdown"
    color="transparent"
    prefer-position="bottom-end"
  >
    <span class="maz-capitalize">
      {{ colorMode }}
    </span>

    <template #dropdown>
      <div class="maz-flex maz-max-w-60 maz-flex-col maz-gap-4">
        <MazRadioButtons
          v-model="colorMode"
          :options="[
            { label: 'Auto', value: 'auto' },
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ]"
        />

        <p>
          Theme
        </p>

        <MazRadioButtons
          :model-value="presetName"
          :options="[
            { label: 'Maz-UI', value: 'maz-ui' },
            { label: 'Ocean', value: 'ocean' },
            { label: 'Obsidian', value: 'obsidian' },
            { label: 'Pristine', value: 'pristine' },
          ]"
          @update:model-value="updateTheme($event)"
        />
      </div>
    </template>
  </MazDropdown>
</template>
