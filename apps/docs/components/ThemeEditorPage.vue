<script setup lang="ts">
import type { ThemePreset } from '@maz-ui/themes'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { useToast } from 'maz-ui/composables'
// Import dynamique pour ne pas ralentir le démarrage
// import { codeToHtml } from 'shiki'
import { computed, nextTick, reactive, ref, unref, watch, watchEffect } from 'vue'
import ColorPicker from './ColorPicker.vue'
import DemoAuthPage from './DemoAuthPage.vue'
import DemoDashboardPage from './DemoDashboardPage.vue'
import DemoProductPage from './DemoProductPage.vue'

const { updateTheme, isDark, toggleDarkMode, presetName, colorMode, currentPreset } = useTheme()
const toast = useToast()

const currentTab = ref(1)
const editingMode = computed<'light' | 'dark'>(() => colorMode.value === 'dark' ? 'dark' : 'light')
const exportedCode = ref('')
const highlightedCode = ref('')
const showExportModal = ref(false)
const isTransitioning = ref(false)

const preset = computed(() => {
  return unref(currentPreset) ?? mazUi
})

const themeData = reactive<ThemePreset>({
  name: preset.value.name,
  foundation: { ...preset.value.foundation },
  colors: {
    light: { ...preset.value.colors.light },
    dark: { ...preset.value.colors.dark },
  },
})

const originalTheme = preset.value

const colorCategories = [
  {
    name: 'Base Colors',
    colors: ['background', 'foreground', 'border', 'muted', 'overlay', 'shadow'] as const,
  },
  {
    name: 'Colors',
    colors: ['primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'accent', 'accent-foreground', 'success', 'success-foreground', 'warning', 'warning-foreground', 'destructive', 'destructive-foreground', 'info', 'info-foreground', 'contrast', 'contrast-foreground'] as const,
  },
]

const isUpdatingFromPreset = ref(false)

watchEffect(() => {
  if (!isUpdatingFromPreset.value && preset.value && preset.value.name !== themeData.name) {
    isUpdatingFromPreset.value = true
    Object.assign(themeData, {
      name: preset.value.name,
      foundation: { ...preset.value.foundation },
      colors: {
        light: { ...preset.value.colors.light },
        dark: { ...preset.value.colors.dark },
      },
    })
    isUpdatingFromPreset.value = false
  }
})

watch([themeData], async () => {
  if (!isUpdatingFromPreset.value) {
    await nextTick()
    await updateTheme(themeData)
  }
}, { deep: true })

function handleThemeModeToggle() {
  isTransitioning.value = true
  toggleDarkMode()

  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

function resetTheme() {
  updateTheme(originalTheme)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    showExportModal.value = false
  })

  toast.success('Theme copied to clipboard', {
    position: 'top',
  })
}

async function exportTheme() {
  const themeCode = `import type { ThemePreset } from '@maz-ui/themes'

export const customTheme: ThemePreset = ${JSON.stringify(themeData, null, 2)
  // Escape single quotes within string values
  .replace(/: "([^"]*)"/g, (match, value) => {
    const escapedValue = value.replace(/'/g, '\\\'')
    return `: '${escapedValue}'`
  })
  // Remove quotes from top-level keys and nested object keys
  .replace(/^(\s*)"(name|foundation|colors)":/gm, '$1$2:')
  .replace(/^(\s*)"(light|dark)":/gm, '$1$2:')}`

  exportedCode.value = themeCode

  try {
    // Import dynamique de Shiki
    const { codeToHtml } = await import('shiki')
    const html = await codeToHtml(themeCode, {
      lang: 'typescript',
      theme: isDark.value ? 'tokyo-night' : 'github-dark',
    })
    highlightedCode.value = html
  }
  catch (error) {
    console.error('Failed to highlight code:', error)
    highlightedCode.value = ''
  }

  showExportModal.value = true
}

const foundationInputs = computed(() => [
  {
    key: 'base-font-size',
    label: 'Base Font Size',
    type: 'text',
    placeholder: '14px',
  },
  {
    key: 'font-family',
    label: 'Font Family',
    type: 'text',
    placeholder: 'Manrope, sans-serif',
  },
  {
    key: 'radius',
    label: 'Border Radius',
    type: 'text',
    placeholder: '0.7rem',
  },
  {
    key: 'border-width',
    label: 'Border Width',
    type: 'text',
    placeholder: '0.0625rem',
  },
])

const currentColors = computed(() => themeData.colors[editingMode.value])

function formatColorName(colorName: string): string {
  return colorName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <div class="vp-raw theme-configurator" :class="{ 'no-transitions': isTransitioning }">
    <div class="maz-grid maz-min-h-[80vh] maz-grid-cols-1 maz-gap-4 lg:maz-grid-cols-12">
      <!-- Editor Panel -->
      <div class="maz-space-y-6 lg:maz-col-span-4 lg:maz-border-r lg:maz-pr-4">
        <h2 class="maz-text-2xl maz-text-foreground">
          Editor
        </h2>

        <div class="maz-flex maz-flex-col maz-gap-2 mob-l:maz-flex-row">
          <MazBtn
            size="md"
            block
            color="secondary"
            @click="resetTheme"
          >
            Reset theme
          </MazBtn>
          <MazBtn
            size="md"
            block
            color="primary"
            @click="exportTheme"
          >
            Export theme
          </MazBtn>
        </div>

        <MazCard block title="Base preset">
          <MazRadioButtons
            :model-value="presetName"
            size="sm"
            :options="[
              {
                label: 'Maz-UI',
                value: 'maz-ui',
              },
              {
                label: 'Pristine',
                value: 'pristine',
              },
              {
                label: 'Ocean',
                value: 'ocean',
              }, {
                label: 'Obsidian',
                value: 'obsidian',
              }]"
            @update:model-value="updateTheme($event)"
          />
        </MazCard>

        <!-- Foundation Settings -->
        <MazCard title="Foundation" block>
          <div
            class="maz-flex maz-flex-col maz-gap-3"
          >
            <template
              v-for="input in foundationInputs"
              :key="input.key"
            >
              <MazInput
                v-model="themeData.foundation[input.key as keyof typeof themeData.foundation]"
                :label="input.label"
                :placeholder="input.placeholder"
                size="sm"
                block
                debounce
              />
            </template>
          </div>
        </MazCard>

        <!-- Colors Settings -->
        <MazCard block>
          <template #title>
            <div class="maz-flex maz-w-full maz-items-center maz-justify-between">
              <h3 class="maz-text-base">
                Colors
              </h3>

              <div class="maz-flex maz-items-center maz-gap-2">
                <label for="dark-mode-switch" class="maz-cursor-pointer maz-text-sm">
                  Edit dark colors
                </label>
                <MazSwitch
                  id="dark-mode-switch"
                  :model-value="colorMode === 'dark'"
                  @update:model-value="handleThemeModeToggle()"
                />
              </div>
            </div>
          </template>

          <div class="maz-space-y-6">
            <div
              v-for="category in colorCategories"
              :key="category.name"
              class="maz-space-y-4"
            >
              <h4 class="maz-border-border maz-border-b maz-pb-2 maz-text-sm maz-font-semibold maz-text-foreground">
                {{ category.name }}
              </h4>

              <div class="maz-grid maz-grid-cols-2 maz-gap-4">
                <ColorPicker
                  v-for="colorKey in category.colors"
                  :key="`${editingMode}-${colorKey}`"
                  v-model="currentColors[colorKey]"
                  :label="formatColorName(colorKey)"
                  class="maz-w-full"
                />
              </div>
            </div>
          </div>
        </MazCard>
      </div>

      <!-- Preview Panel -->
      <div class="lg:maz-col-span-8">
        <div class="maz-sticky maz-top-4">
          <div class="maz-mb-4 maz-flex maz-items-center maz-justify-between">
            <h2 class="maz-text-2xl maz-text-foreground">
              Preview
            </h2>
          </div>

          <MazTabs v-model="currentTab">
            <MazTabsBar
              :items="['Dashboard', 'Product', 'Authentication']"
              class="maz-mb-4"
            />

            <MazTabsContent>
              <MazTabsContentItem :tab="1">
                <MazCard
                  bordered
                  :padding="false"
                  overflow-hidden
                  class="maz-max-h-[70vh] maz-w-full maz-overflow-y-auto"
                >
                  <DemoDashboardPage :delay="0" />
                </MazCard>
              </MazTabsContentItem>

              <MazTabsContentItem :tab="2">
                <MazCard
                  bordered
                  :padding="false"
                  overflow-hidden
                  class="maz-max-h-[70vh] maz-w-full maz-overflow-y-auto"
                >
                  <DemoProductPage />
                </MazCard>
              </MazTabsContentItem>

              <MazTabsContentItem :tab="3">
                <MazCard
                  bordered
                  :padding="false"
                  overflow-hidden
                  class="maz-max-h-[70vh] maz-w-full maz-overflow-y-auto"
                >
                  <DemoAuthPage />
                </MazCard>
              </MazTabsContentItem>
            </MazTabsContent>
          </MazTabs>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <MazDialog v-model="showExportModal" scrollable title="Export Theme">
      <div class="maz-space-y-4">
        <p class="maz-text-muted">
          Copy the generated TypeScript code below to use your custom theme:
        </p>

        <div class="maz-overflow-y-auto maz-rounded-md">
          <div
            v-if="highlightedCode"
            class="shiki-wrapper"
            v-html="highlightedCode"
          />
          <div
            v-else
            class="maz-bg-contrast maz-p-4 dark:maz-bg-surface-300"
          >
            <pre class="maz-whitespace-pre-wrap maz-font-mono maz-text-xs maz-text-contrast-foreground dark:maz-text-foreground">{{ exportedCode }}</pre>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="maz-flex maz-gap-2">
          <MazBtn color="primary" @click="copyToClipboard(exportedCode)">
            Copy to Clipboard
          </MazBtn>
        </div>
      </template>
    </MazDialog>
  </div>
</template>

<style lang="postcss" scoped>
@media (max-width: 1024px) {
  .theme-configurator {
    @apply maz-space-y-8;
  }

  .theme-configurator .maz-sticky {
    @apply maz-static;
  }
}
</style>

<style lang="postcss">
/* Global styles to disable only color-related transitions during theme mode switch */
.no-transitions *,
.no-transitions *::before,
.no-transitions *::after {
  transition-property: transform, opacity, scale, rotate, translate !important;
}

/* Shiki code highlighting styles */
.shiki-wrapper {
  @apply maz-rounded-md maz-overflow-hidden maz-bg-contrast dark:maz-bg-surface-600;
}

.shiki-wrapper pre {
  @apply maz-p-4 maz-m-0 maz-text-xs maz-overflow-x-auto;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace !important;
}

.shiki-wrapper code {
  @apply maz-text-xs;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace !important;
}

/* Override shiki background to match theme */
.shiki-wrapper .shiki {
  background-color: transparent !important;
}
</style>
