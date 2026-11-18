<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import EffectiveColors from '../EffectiveColors.vue'
import PreviewComponents from './previews/PreviewComponents.vue'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const applyToSite = defineModel<boolean>('applyToSite', { default: false })

const editor = useThemeEditor()

const PREVIEWS = [
  { label: 'Components', value: 'components', url: 'components' },
  { label: 'Dashboard', value: 'dashboard', url: 'dashboard' },
  { label: 'Shop', value: 'shop', url: 'products/studio-wireless' },
  { label: 'Sign in', value: 'sign-in', url: 'sign-in' },
  { label: 'Article', value: 'article', url: 'blog/a-theme-is-a-promise' },
  { label: 'Contrast', value: 'contrast', url: 'contrast' },
] as const

type PreviewName = (typeof PREVIEWS)[number]['value']

const COMPONENTS = {
  'components': PreviewComponents,
  'dashboard': defineAsyncComponent(() => import('./previews/PreviewDashboard.vue')),
  'shop': defineAsyncComponent(() => import('./previews/PreviewShop.vue')),
  'sign-in': defineAsyncComponent(() => import('./previews/PreviewSignIn.vue')),
  'article': defineAsyncComponent(() => import('./previews/PreviewArticle.vue')),
} as const

const current = ref<PreviewName>('components')

const url = computed(() => `your-app.com/${PREVIEWS.find(item => item.value === current.value)?.url}`)
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-x-4 maz:gap-y-2">
      <MazTabsBar
        v-model="current"
        :items="PREVIEWS.map(({ label, value }) => ({ label, value }))"
        standalone
        size="sm"
        class="maz:min-w-0"
        aria-label="Page of the preview"
      />
      <MazSwitch v-model="applyToSite" label="Apply to the whole site" class="maz:ms-auto" />
    </div>

    <MazWindowMockup variant="browser" :url hide-url-copy class="maz:shadow-elevation">
      <div
        v-bind="{ [PREVIEW_ATTRIBUTE]: '' }"
        class="theme-preview maz:h-[min(48rem,calc(100dvh-10rem))] maz:overflow-y-auto maz:bg-surface maz:font-sans maz:text-foreground"
      >
        <div v-if="current === 'contrast'" class="maz:p-[clamp(1rem,3vw,2rem)]">
          <EffectiveColors :preset="editor.draft.value" />
        </div>
        <component :is="COMPONENTS[current]" v-else />
      </div>
    </MazWindowMockup>
    <p class="maz:m-0 maz:text-caption">
      Dialogs, toasts and menus open above the page and keep the theme of the docs, unless you apply the theme to the whole site.
    </p>
  </div>
</template>

<style scoped>
.theme-preview {
  font-size: var(--maz-base-font-size);
  transition:
    background-color var(--maz-motion-normal) var(--maz-easing-in-out),
    color var(--maz-motion-normal) var(--maz-easing-in-out);
}
</style>
