<script setup lang="ts">
import type { ThemePreset } from '@maz-ui/themes'
import type { SavedTheme } from './theme-editor/useThemeEditor'
import { MazArrowDown } from '@maz-ui/icons/raw/MazArrowDown'
import { MazArrowPath } from '@maz-ui/icons/raw/MazArrowPath'
import { MazShare } from '@maz-ui/icons/raw/MazShare'
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { useDialog } from 'maz-ui/composables/useDialog'
import { useToast } from 'maz-ui/composables/useToast'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PanelColors from './theme-editor/PanelColors.vue'
import PanelComponents from './theme-editor/PanelComponents.vue'
import PanelMotion from './theme-editor/PanelMotion.vue'
import PanelShape from './theme-editor/PanelShape.vue'
import PanelTypography from './theme-editor/PanelTypography.vue'
import PresetGallery from './theme-editor/PresetGallery.vue'
import { findEditorPreset } from './theme-editor/presets'
import { getScopedThemeCss } from './theme-editor/scoped-css'
import { clonePlain } from './theme-editor/serialize'
import ThemeExport from './theme-editor/ThemeExport.vue'
import ThemePreview from './theme-editor/ThemePreview.vue'
import { decodeTheme, encodeTheme, provideThemeEditor } from './theme-editor/useThemeEditor'
import './home/home.css'

const STORAGE_KEY = 'maz-ui:theme-editor'
const HASH_KEY = 'theme='

const theme = useTheme()
const toast = useToast()
const dialog = useDialog()

const editor = provideThemeEditor(theme.presetName.value ?? 'maz-ui')

const PANELS = [
  { label: 'Colors', value: 'colors' },
  { label: 'Type', value: 'typography' },
  { label: 'Shape', value: 'shape' },
  { label: 'Motion', value: 'motion' },
  { label: 'Components', value: 'components' },
] as const

const PANEL_COMPONENTS = {
  colors: PanelColors,
  typography: PanelTypography,
  shape: PanelShape,
  motion: PanelMotion,
  components: PanelComponents,
} as const

const panel = ref<(typeof PANELS)[number]['value']>('colors')

let lastCss = ''
const scopedCss = computed(() => {
  try {
    lastCss = getScopedThemeCss(editor.draft.value)
  }
  catch {}

  return lastCss
})

const ScopedTheme = defineComponent(() => () => h('style', { innerHTML: scopedCss.value }))

function selectPreset(name: string) {
  if (name === editor.baseName.value)
    return

  if (editor.changeCount.value === 0) {
    editor.selectBase(name)
    return
  }

  const count = editor.changeCount.value
  dialog.open({
    title: `Switch to ${findEditorPreset(name).label}?`,
    message: `You changed ${count} value${count > 1
      ? 's'
      : ''}. Keep them on top of the new preset, or start from it again.`,
    acceptText: 'Keep my changes',
    rejectText: 'Discard them',
    onAccept: () => editor.selectBase(name, clonePlain(editor.overrides.value)),
    onReject: () => editor.selectBase(name),
  })
}

function resetAll() {
  editor.reset()
  toast.info(`Back to ${editor.base.value.label}`, { position: 'bottom-right' })
}

async function share() {
  const url = `${location.origin}${location.pathname}#${HASH_KEY}${encodeTheme(editor.save())}`
  history.replaceState(null, '', url)
  try {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied: it opens the editor with this theme', { position: 'bottom-right' })
  }
  catch {
    toast.info('Copy the link from the address bar', { position: 'bottom-right' })
  }
}

function readSaved(): SavedTheme | undefined {
  const hash = location.hash.slice(1)
  if (hash.startsWith(HASH_KEY))
    return decodeTheme(hash.slice(HASH_KEY.length))

  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    return stored
      ? JSON.parse(stored) as SavedTheme
      : undefined
  }
  catch {
    return undefined
  }
}

const persist = debounce(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.save()))
  }
  catch {}
}, 400)

const applyToSite = ref(false)
let siteTheme: ThemePreset | undefined

const applyDraft = debounce(() => {
  if (applyToSite.value)
    theme.updateTheme(clonePlain(editor.draft.value))
}, 150)

watch(applyToSite, (apply) => {
  if (apply) {
    siteTheme ??= clonePlain(theme.preset.value)
    applyDraft()
  }
  else if (siteTheme) {
    theme.updateTheme(clonePlain(siteTheme))
  }
})

watch(editor.draft, () => {
  persist()
  applyDraft()
}, { deep: true })

watch(editor.themeName, persist)

watch(editor.mode, (mode) => {
  if (theme.colorMode.value !== mode)
    theme.setColorMode(mode)
})

watch(theme.isDark, (dark) => {
  editor.mode.value = dark ? 'dark' : 'light'
})

onMounted(() => {
  editor.mode.value = theme.isDark.value ? 'dark' : 'light'
  const saved = readSaved()
  if (saved)
    editor.load(saved)
})

onBeforeUnmount(() => {
  if (applyToSite.value && siteTheme)
    theme.updateTheme(siteTheme)
})
</script>

<template>
  <div class="theme-editor vp-raw maz:bg-surface maz:font-sans maz:text-foreground">
    <ScopedTheme />

    <div class="maz:mx-auto maz:flex maz:max-w-[100rem] maz:flex-col maz:gap-[clamp(4rem,8vw,7rem)] maz:px-[clamp(1.25rem,4vw,4rem)] maz:pt-[clamp(3rem,7vw,6rem)] maz:pb-[clamp(4rem,8vw,7rem)]">
      <header class="maz:grid maz:gap-8 maz:lap-s:grid-cols-[minmax(0,1fr)_auto] maz:lap-s:items-end">
        <div>
          <p class="home-eyebrow">
            Theme editor
          </p>
          <h1 class="home-display maz:mt-3 maz:mb-6 maz:max-w-[14ch] maz:text-[clamp(2.75rem,6.4vw,5.5rem)] maz:font-extrabold">
            Make <span class="maz:whitespace-nowrap">Maz-UI</span> yours
          </h1>
          <p class="home-lead maz:m-0">
            Start from a preset, shape the colors, the type, the radius and the motion, and watch real components follow. Then copy the few lines that make it your theme.
          </p>
        </div>

        <div class="maz:flex maz:flex-col maz:gap-3 maz:lap-s:items-end">
          <p class="maz:m-0 maz:flex maz:items-center maz:gap-2 maz:font-mono maz:text-xs maz:text-muted">
            Based on <strong class="maz:font-semibold maz:text-foreground">{{ editor.base.value.label }}</strong>
            <MazBadge :color="editor.changeCount.value > 0 ? 'primary' : 'surface'" size="sm" :pastel="editor.changeCount.value > 0" :outlined="editor.changeCount.value === 0">
              {{ editor.changeCount.value }} change{{ editor.changeCount.value === 1 ? '' : 's' }}
            </MazBadge>
          </p>
          <div class="maz:flex maz:flex-wrap maz:gap-2">
            <MazBtn href="#export" :end-icon="MazArrowDown">
              Get the code
            </MazBtn>
            <MazBtn color="surface" outlined :start-icon="MazShare" @click="share">
              Share
            </MazBtn>
            <MazBtn color="surface" outlined :start-icon="MazArrowPath" :disabled="editor.changeCount.value === 0" @click="resetAll">
              Reset
            </MazBtn>
          </div>
        </div>
      </header>

      <section aria-labelledby="step-preset">
        <div class="step-label">
          <span class="maz:font-semibold maz:text-primary">01</span>
          <span>Start from a preset</span>
        </div>
        <h2 id="step-preset" class="step-title home-display">
          Pick the closest identity
        </h2>
        <p class="maz:m-0 maz:mb-8 maz:max-w-2xl maz:text-body maz:text-muted">
          Every preset is a complete theme: colors for both modes, fonts, radius, shadows and type scale. Your changes apply on top of it.
        </p>
        <PresetGallery @select="selectPreset" />
      </section>

      <section aria-labelledby="step-edit">
        <div class="step-label">
          <span class="maz:font-semibold maz:text-primary">02</span>
          <span>Shape it</span>
        </div>
        <h2 id="step-edit" class="step-title home-display">
          Tune it, watch it live
        </h2>
        <p class="maz:m-0 maz:mb-8 maz:max-w-2xl maz:text-body maz:text-muted">
          The preview renders your theme only, the rest of the page keeps the theme of the docs. A dot marks the values you changed, its arrow brings back the value of the preset.
        </p>

        <div class="maz:grid maz:gap-6 maz:lap-s:grid-cols-[minmax(22rem,28rem)_minmax(0,1fr)] maz:lap-s:items-start">
          <div class="editor-panel maz:flex maz:min-w-0 maz:flex-col maz:overflow-hidden maz:rounded-xl maz:border maz:border-divider maz:bg-container">
            <MazTabsBar
              v-model="panel"
              :items="PANELS.map(({ label, value }) => ({ label, value }))"
              standalone
              size="xs"
              block
              :bordered="false"
              class="maz:shrink-0 maz:border-b maz:border-divider maz:p-2"
              aria-label="Part of the theme to edit"
            />
            <div class="maz:min-h-0 maz:flex-1 maz:overflow-y-auto maz:p-5">
              <KeepAlive>
                <component :is="PANEL_COMPONENTS[panel]" />
              </KeepAlive>
            </div>
          </div>

          <div class="maz:min-w-0 maz:lap-s:sticky maz:lap-s:top-[calc(var(--vp-nav-height,4rem)+1.5rem)]">
            <ThemePreview v-model:apply-to-site="applyToSite" />
          </div>
        </div>
      </section>

      <section id="export" aria-labelledby="step-export" class="maz:scroll-mt-[calc(var(--vp-nav-height,4rem)+1.5rem)]">
        <div class="step-label">
          <span class="maz:font-semibold maz:text-primary">03</span>
          <span>Ship it</span>
        </div>
        <h2 id="step-export" class="step-title home-display">
          Copy your theme
        </h2>
        <p class="maz:m-0 maz:mb-8 maz:max-w-2xl maz:text-body maz:text-muted">
          Your draft is saved in this browser. See the <a href="/ecosystem/themes" class="maz:text-primary">themes guide</a> for every option of a preset.
        </p>
        <ThemeExport />
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "../.vitepress/theme/main.css";

.step-label {
  @apply maz:mb-6 maz:flex maz:items-baseline maz:gap-3 maz:border-b maz:border-divider maz:pb-4 maz:font-mono maz:text-xs maz:tracking-[0.08em] maz:text-foreground maz:uppercase;
}

.step-title {
  @apply maz:m-0 maz:mb-3 maz:text-[clamp(2rem,4.5vw,3.25rem)] maz:font-bold;
}

@media (min-width: 1024px) {
  .editor-panel {
    max-height: calc(100dvh - var(--vp-nav-height, 4rem) - 3rem);
    position: sticky;
    top: calc(var(--vp-nav-height, 4rem) + 1.5rem);
  }
}
</style>

<style>
.VPHome:has(.theme-editor) {
  margin-block-end: 0 !important;
  padding-block-end: 0 !important;
}
</style>
