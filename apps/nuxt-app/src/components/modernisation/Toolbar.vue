<script lang="ts" setup>
const dir = defineModel<'ltr' | 'rtl'>('dir', { required: true })
const reduced = defineModel<boolean>('reduced', { required: true })

const { colorMode, isDark, setColorMode, toggleDarkMode, presetName, updateTheme } = useTheme()

const presets = ['maz-ui', 'ocean', 'pristine', 'obsidian', 'nova', 'folio', 'macos', 'windows', 'linux'] as const
const presetOptions = presets.map(value => ({ label: value, value }))
const density = ref('default')
</script>

<template>
  <div class="sticky top-0 z-30 border-b border-divider bg-surface/90 backdrop-blur">
    <div class="flex flex-wrap items-end gap-x-6 gap-y-3 py-3 padded-container">
      <div class="flex flex-col gap-1">
        <span class="text-caption">Color mode ({{ isDark ? 'dark' : 'light' }})</span>
        <div class="flex items-center gap-2">
          <MazSegmented
            :model-value="colorMode"
            :options="[
              { label: 'Auto', value: 'auto' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]"
            size="sm"
            aria-label="Color mode"
            @update:model-value="setColorMode($event)"
          />
          <MazBtn size="sm" color="secondary" @click="toggleDarkMode()">
            Toggle
          </MazBtn>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-caption">Direction</span>
        <MazSegmented
          v-model="dir"
          :options="[
            { label: 'LTR', value: 'ltr' },
            { label: 'RTL', value: 'rtl' },
          ]"
          size="sm"
          aria-label="Direction"
        />
      </div>

      <div class="flex flex-col gap-1">
        <MazSwitch v-model="reduced" size="sm" label="Reduced motion" />
        <span class="max-w-56 text-caption">Toggles <code class="text-code">m-motion-reduced</code> on html, like the <code class="text-code">motion</code> option</span>
      </div>

      <div class="w-44">
        <MazSelect
          :model-value="presetName"
          :options="presetOptions"
          label="Preset"
          size="sm"
          @update:model-value="updateTheme($event)"
        />
      </div>

      <div class="w-40">
        <MazSelect
          v-model="density"
          :options="[{ label: 'default', value: 'default' }, { label: 'compact', value: 'compact' }]"
          label="Density (soon)"
          size="sm"
          disabled
        />
      </div>
    </div>
  </div>
</template>
