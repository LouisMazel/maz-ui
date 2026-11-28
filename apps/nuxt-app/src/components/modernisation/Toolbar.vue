<script lang="ts" setup>
const dir = defineModel<'ltr' | 'rtl'>('dir', { required: true })
const reduced = defineModel<boolean>('reduced', { required: true })
const density = defineModel<'default' | 'compact'>('density', { required: true })

const { colorMode, isDark, setColorMode, toggleDarkMode, presetName, updateTheme } = useTheme()

const presets = ['maz-ui', 'ocean', 'pristine', 'obsidian', 'nova', 'folio', 'macos', 'windows', 'linux'] as const
const presetOptions = presets.map(value => ({ label: value, value }))
</script>

<template>
  <div class="sticky top-0 z-30 border-b border-divider bg-surface/90 backdrop-blur">
    <div class="flex flex-wrap items-end gap-x-6 gap-y-3 py-3 padded-container">
      <div class="flex flex-col gap-1">
        <span class="text-caption">Mode de couleur ({{ isDark ? 'sombre' : 'clair' }})</span>
        <div class="flex items-center gap-2">
          <MazSegmented
            :model-value="colorMode"
            :options="[
              { label: 'Auto', value: 'auto' },
              { label: 'Clair', value: 'light' },
              { label: 'Sombre', value: 'dark' },
            ]"
            size="sm"
            aria-label="Mode de couleur"
            @update:model-value="setColorMode($event)"
          />
          <MazBtn size="sm" color="secondary" @click="toggleDarkMode()">
            Basculer
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
        <MazSwitch v-model="reduced" size="sm" label="Animations réduites" />
        <span class="max-w-56 text-caption">Ajoute <code class="text-code">m-motion-reduced</code> sur html, comme l'option <code class="text-code">motion</code></span>
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
          :options="[{ label: 'défaut', value: 'default' }, { label: 'compact', value: 'compact' }]"
          label="Densité"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>
