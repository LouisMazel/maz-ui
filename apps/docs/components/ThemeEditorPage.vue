<script setup lang="ts">
import type { ThemePreset } from '@maz-ui/themes'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { useToast } from 'maz-ui/composables'
import { computed, nextTick, reactive, ref, unref, watch, watchEffect } from 'vue'
import ColorPicker from './ColorPicker.vue'
import DemoAuthPage from './DemoAuthPage.vue'
import DemoDashboardPage from './DemoDashboardPage.vue'
import DemoProductPage from './DemoProductPage.vue'

const { updateTheme, isDark, toggleDarkMode, presetName, colorMode, preset: currentPreset } = useTheme()
const toast = useToast()

const currentTab = ref(1)
const editingMode = computed<'light' | 'dark'>(() => colorMode.value === 'dark' ? 'dark' : 'light')
const exportedCode = ref('')
const highlightedCode = ref('')
const showExportModal = ref(false)

const preset = computed(() => {
  return unref(currentPreset) ?? mazUi
})

function clonePreset(source: ThemePreset): ThemePreset {
  return {
    name: source.name,
    foundation: { ...source.foundation },
    scales: {
      spacing: source.scales.spacing,
      radius: { ...source.scales.radius },
      shadow: { ...source.scales.shadow },
    },
    components: source.components
      ? {
          btn: source.components.btn ? { ...source.components.btn } : undefined,
          container: source.components.container?.bg
            ? { bg: { ...source.components.container.bg } }
            : undefined,
          input: source.components.input?.bg
            ? { bg: { ...source.components.input.bg } }
            : undefined,
        }
      : undefined,
    colors: {
      light: { ...source.colors.light },
      dark: { ...source.colors.dark },
    },
  }
}

const themeData = reactive<ThemePreset>(clonePreset(preset.value))

const originalTheme = preset.value

const colorCategories = [
  {
    name: 'Base Colors',
    colors: ['surface', 'foreground', 'divider', 'muted', 'overlay', 'shadow'] as const,
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
    Object.assign(themeData, clonePreset(preset.value))
    isUpdatingFromPreset.value = false
  }
})

watch([themeData], async () => {
  if (!isUpdatingFromPreset.value) {
    await nextTick()
    await updateTheme(themeData)
  }
}, { deep: true })

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
  // Remove quotes from top-level keys and nested object keys (single-word keys only)
  .replace(/^(\s*)"(name|foundation|scales|components|colors|spacing|radius|shadow|btn|container|input|bg|light|dark)":/gm, '$1$2:')}`

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

type FoundationKey = keyof NonNullable<ThemePreset['foundation']>

interface FoundationInput {
  key: FoundationKey
  label: string
  placeholder: string
}

const foundationInputs: readonly FoundationInput[] = [
  { key: 'base-font-size', label: 'Base font size', placeholder: '14px' },
  { key: 'border-width', label: 'Border width', placeholder: '0.0625rem' },
  { key: 'font-family', label: 'Font family (sans)', placeholder: 'Manrope, sans-serif' },
  { key: 'font-display', label: 'Font display', placeholder: 'Manrope, sans-serif' },
  { key: 'font-mono', label: 'Font mono', placeholder: 'ui-monospace, SFMono-Regular, …' },
  { key: 'duration-fast', label: 'Duration fast', placeholder: '100ms' },
  { key: 'duration-normal', label: 'Duration normal', placeholder: '200ms' },
  { key: 'duration-slow', label: 'Duration slow', placeholder: '300ms' },
  { key: 'easing-out', label: 'Easing out', placeholder: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { key: 'easing-in', label: 'Easing in', placeholder: 'cubic-bezier(0.4, 0, 1, 1)' },
  { key: 'easing-in-out', label: 'Easing in-out', placeholder: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { key: 'disabled-opacity', label: 'Disabled opacity', placeholder: '0.5' },
  { key: 'disabled-cursor', label: 'Disabled cursor', placeholder: 'not-allowed' },
] as const

const radiusKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const
const shadowKeys = ['sm', 'md', 'lg', 'xl', 'elevation'] as const

const shadowPlaceholders: Record<typeof shadowKeys[number], string> = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  elevation: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
}

function ensureComponents() {
  if (!themeData.components) {
    themeData.components = {}
  }
  return themeData.components
}

const btnFontWeight = computed({
  get: () => themeData.components?.btn?.['font-weight'] ?? '',
  set: (value: string) => {
    const components = ensureComponents()
    components.btn = { ...(components.btn ?? {}), 'font-weight': value }
  },
})

function componentBgGetter(scope: 'container' | 'input', mode: 'light' | 'dark') {
  return computed({
    get: () => themeData.components?.[scope]?.bg?.[mode] ?? '',
    set: (value: string) => {
      const components = ensureComponents()
      const slot = components[scope] ?? {}
      slot.bg = { ...(slot.bg ?? {}), [mode]: value }
      components[scope] = slot
    },
  })
}

const containerBgLight = componentBgGetter('container', 'light')
const containerBgDark = componentBgGetter('container', 'dark')
const inputBgLight = componentBgGetter('input', 'light')
const inputBgDark = componentBgGetter('input', 'dark')

const currentColors = computed(() => themeData.colors[editingMode.value])

function formatColorName(colorName: string): string {
  return colorName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <div class="vp-raw theme-configurator">
    <div class="maz:grid maz:min-h-[80vh] maz:grid-cols-1 maz:gap-4 maz:lg:grid-cols-12">
      <!-- Editor Panel -->
      <div class="maz:space-y-6 maz:lg:col-span-4 maz:lg:border-e maz:lg:pr-4">
        <h2 class="maz:text-2xl maz:text-foreground">
          Editor
        </h2>

        <div class="maz:flex maz:flex-col maz:gap-2 maz:mob-l:flex-row">
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

        <MazContainer block title="Base preset">
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
        </MazContainer>

        <!-- Foundation Settings -->
        <MazContainer title="Foundation" block>
          <div class="maz:flex maz:flex-col maz:gap-3">
            <MazInput
              v-for="input in foundationInputs"
              :key="input.key"
              v-model="themeData.foundation[input.key]"
              :label="input.label"
              :placeholder="input.placeholder"
              size="sm"
              block
              debounce
            />
          </div>
        </MazContainer>

        <!-- Scales -->
        <MazContainer title="Scales" block>
          <div class="maz:flex maz:flex-col maz:gap-4">
            <MazInput
              v-model="themeData.scales.spacing"
              label="Spacing (base unit)"
              placeholder="0.25rem"
              size="sm"
              block
              debounce
            />

            <div class="maz:flex maz:flex-col maz:gap-2">
              <h4 class="maz:text-sm maz:font-semibold maz:text-foreground maz:m-0">
                Radius
              </h4>
              <MazInput
                v-for="key in radiusKeys"
                :key="`radius-${key}`"
                v-model="themeData.scales.radius[key]"
                :label="`radius.${key}`"
                size="sm"
                block
                debounce
              />
            </div>

            <div class="maz:flex maz:flex-col maz:gap-2">
              <h4 class="maz:text-sm maz:font-semibold maz:text-foreground maz:m-0">
                Shadow
              </h4>
              <MazInput
                v-for="key in shadowKeys"
                :key="`shadow-${key}`"
                v-model="themeData.scales.shadow[key]"
                :label="`shadow.${key}`"
                :placeholder="shadowPlaceholders[key]"
                size="sm"
                block
                debounce
              />
            </div>
          </div>
        </MazContainer>

        <!-- Components -->
        <MazContainer title="Components" block>
          <div class="maz:flex maz:flex-col maz:gap-4">
            <div class="maz:flex maz:flex-col maz:gap-2">
              <h4 class="maz:text-sm maz:font-semibold maz:text-foreground maz:m-0">
                MazBtn
              </h4>
              <MazInput
                v-model="btnFontWeight"
                label="font-weight"
                placeholder="500"
                size="sm"
                block
                debounce
              />
            </div>

            <div class="maz:flex maz:flex-col maz:gap-2">
              <h4 class="maz:text-sm maz:font-semibold maz:text-foreground maz:m-0">
                Container bg
              </h4>
              <MazInput
                v-model="containerBgLight"
                label="light"
                placeholder="var(--maz-surface)"
                size="sm"
                block
                debounce
              />
              <MazInput
                v-model="containerBgDark"
                label="dark"
                placeholder="var(--maz-surface)"
                size="sm"
                block
                debounce
              />
            </div>

            <div class="maz:flex maz:flex-col maz:gap-2">
              <h4 class="maz:text-sm maz:font-semibold maz:text-foreground maz:m-0">
                Input bg
              </h4>
              <MazInput
                v-model="inputBgLight"
                label="light"
                placeholder="var(--maz-surface)"
                size="sm"
                block
                debounce
              />
              <MazInput
                v-model="inputBgDark"
                label="dark"
                placeholder="var(--maz-surface-400)"
                size="sm"
                block
                debounce
              />
            </div>
          </div>
        </MazContainer>

        <!-- Colors Settings -->
        <MazContainer block>
          <template #title>
            <div class="maz:flex maz:w-full maz:items-center maz:justify-between">
              <h3 class="maz:text-base">
                Colors
              </h3>

              <div class="maz:flex maz:items-center maz:gap-2">
                <label for="dark-mode-switch" class="maz:cursor-pointer maz:text-sm">
                  Edit dark colors
                </label>
                <MazSwitch
                  id="dark-mode-switch"
                  :model-value="colorMode === 'dark'"
                  @update:model-value="toggleDarkMode"
                />
              </div>
            </div>
          </template>

          <div class="maz:space-y-6">
            <div
              v-for="category in colorCategories"
              :key="category.name"
              class="maz:space-y-4"
            >
              <h4 class="maz:border-b maz:pb-2 maz:text-sm maz:font-semibold maz:text-foreground">
                {{ category.name }}
              </h4>

              <div class="maz:grid maz:grid-cols-2 maz:gap-4">
                <ColorPicker
                  v-for="colorKey in category.colors"
                  :key="`${editingMode}-${colorKey}`"
                  v-model="currentColors[colorKey]"
                  :label="formatColorName(colorKey)"
                  class="maz:w-full"
                />
              </div>
            </div>
          </div>
        </MazContainer>
      </div>

      <!-- Preview Panel -->
      <div class="maz:lg:col-span-8">
        <div class="preview-wrapper maz:sticky maz:top-4">
          <div class="maz:mb-4 maz:flex maz:items-center maz:justify-between">
            <h2 class="maz:text-2xl maz:text-foreground">
              Preview
            </h2>
          </div>

          <MazTabs v-model="currentTab">
            <MazTabsBar
              :items="['Dashboard', 'Product', 'Authentication']"
              class="maz:mb-4"
            />

            <MazTabsContent>
              <MazTabsContentItem :tab="1">
                <MazContainer
                  bordered
                  :padding="false"
                  overflow-hidden
                  class="maz:max-h-[70vh] maz:w-full maz:overflow-y-auto"
                >
                  <DemoDashboardPage :delay="0" />
                </MazContainer>
              </MazTabsContentItem>

              <MazTabsContentItem :tab="2">
                <MazContainer
                  bordered
                  :padding="false"
                  overflow-hidden
                  class="maz:max-h-[70vh] maz:w-full maz:overflow-y-auto"
                >
                  <DemoProductPage />
                </MazContainer>
              </MazTabsContentItem>

              <MazTabsContentItem :tab="3">
                <MazContainer
                  bordered
                  :padding="false"
                  overflow-hidden
                  class="maz:max-h-[70vh] maz:w-full maz:overflow-y-auto"
                >
                  <DemoAuthPage />
                </MazContainer>
              </MazTabsContentItem>
            </MazTabsContent>
          </MazTabs>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <MazDialog v-model="showExportModal" scrollable title="Export Theme">
      <div class="maz:space-y-4">
        <p class="maz:text-muted">
          Copy the generated TypeScript code below to use your custom theme:
        </p>

        <div class="maz:overflow-y-auto maz:rounded-md">
          <div
            v-if="highlightedCode"
            class="shiki-wrapper"
            v-html="highlightedCode"
          />
          <div
            v-else
            class="maz:bg-contrast maz:p-4 maz:dark:bg-surface-300"
          >
            <pre class="maz:whitespace-pre-wrap maz:font-mono maz:text-xs maz:text-contrast-foreground maz:dark:text-foreground">{{ exportedCode }}</pre>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="maz:flex maz:gap-2">
          <MazBtn color="primary" @click="copyToClipboard(exportedCode)">
            Copy to Clipboard
          </MazBtn>
        </div>
      </template>
    </MazDialog>
  </div>
</template>

<style scoped>
@reference "../.vitepress/theme/main.css";
@media (max-width: 1024px) {
  .theme-configurator {
    @apply maz:space-y-8;
  }

  .theme-configurator .preview-wrapper {
    @apply maz:static;
  }
}
</style>

<style>
@reference "../.vitepress/theme/main.css";
/* Shiki code highlighting styles */
.shiki-wrapper {
  @apply maz:rounded-md maz:overflow-hidden maz:bg-contrast maz:dark:bg-surface-600;
}

.shiki-wrapper pre {
  @apply maz:p-4 maz:m-0 maz:text-xs maz:overflow-x-auto;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace !important;
}

.shiki-wrapper code {
  @apply maz:text-xs;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace !important;
}

/* Override shiki background to match theme */
.shiki-wrapper .shiki {
  background-color: transparent !important;
}
</style>
