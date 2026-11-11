<script lang="ts" setup>
import type { ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { Ref, VNode } from 'vue'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazClipboard } from '@maz-ui/icons/lazy/MazClipboard'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, getCurrentInstance, inject, onMounted, onUnmounted, ref, useSlots, useTemplateRef, watch } from 'vue'
import { vTooltip } from '../directives/vTooltip'

export interface MazCodeHighlightProps {
  /** Source code to highlight */
  code?: string
  /** Language identifier for syntax highlighting (e.g. 'vue', 'ts', 'bash') */
  language?: string
  /** Override the shiki theme name. Takes priority over the theme chosen from the color mode (tokyo-night in dark, github-light in light) */
  theme?: string
  /**
   * Color mode of the block.
   * - `auto`: follows the closest `.dark` ancestor, then the `@maz-ui/themes` color mode when the theme plugin is installed, then the `dark` class of `<html>`
   * - `light` / `dark`: forces the mode of this block, whatever the app color mode
   * @default 'auto'
   */
  colorMode?: 'auto' | 'light' | 'dark'
  /**
   * Apply rounded corners on the highlighted code block.
   * @default true
   */
  rounded?: boolean
  /**
   * Show the copy-to-clipboard button on hover.
   * @default true
   */
  copyable?: boolean
  /**
   * Value copied to the clipboard. Falls back to the resolved code when omitted.
   * Useful when the displayed code differs from what should be copied (e.g. terminal prompt prefix).
   */
  copyValue?: string
  /**
   * Custom translations for the component. Override either key independently.
   * @type {Partial<MazUiTranslationsNestedSchema['codeHighlight']>}
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['codeHighlight']>
}

const {
  code,
  language = 'text',
  theme,
  colorMode = 'auto',
  rounded = true,
  copyable = true,
  copyValue,
  translations,
} = defineProps<MazCodeHighlightProps>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const { t } = useTranslations()

const copyLabel = computed(() => translations?.copyToClipboard ?? t('codeHighlight.copyToClipboard'))
const copiedLabel = computed(() => translations?.copiedToClipboard ?? t('codeHighlight.copiedToClipboard'))

const slots = useSlots()
const rootRef = useTemplateRef<HTMLElement>('rootRef')
const themeState = inject<Ref<ThemeState | undefined> | undefined>('mazThemeState', undefined)
  ?? getCurrentInstance()?.appContext.config.globalProperties.$mazThemeState as Ref<ThemeState | undefined> | undefined
const hasDarkAncestor = ref<boolean>()

function htmlHasDarkClass() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

const isDark = computed(() => {
  if (colorMode !== 'auto')
    return colorMode === 'dark'
  if (hasDarkAncestor.value)
    return true
  if (themeState?.value)
    return !!themeState.value.isDark
  return hasDarkAncestor.value ?? htmlHasDarkClass()
})
const copied = ref(false)
let copyResetTimer: ReturnType<typeof setTimeout> | undefined

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function plainHtml(value: string): string {
  return `<pre class="shiki"><code>${escapeHtml(value)}</code></pre>`
}

function extractSlotText(vnodes: VNode[]): string {
  return vnodes
    .map((v) => {
      if (typeof v.children === 'string')
        return v.children
      if (Array.isArray(v.children))
        return extractSlotText(v.children as VNode[])
      return ''
    })
    .join('')
}

const resolvedCode = computed(() => {
  if (code)
    return code
  try {
    const vnodes = slots.default?.()
    if (vnodes?.length)
      return extractSlotText(vnodes).trim()
  }
  catch {}
  return ''
})

const highlightedHtml = ref(resolvedCode.value
  ? plainHtml(resolvedCode.value)
  : '')

const resolvedTheme = computed(() => {
  if (theme)
    return theme
  return isDark.value ? 'tokyo-night' : 'github-light'
})

const resolvedCopyValue = computed(() => copyValue ?? resolvedCode.value)

let highlightSeq = 0

async function highlight() {
  const seq = ++highlightSeq
  const src = resolvedCode.value
  if (!src) {
    if (seq === highlightSeq)
      highlightedHtml.value = ''
    return
  }
  try {
    const { codeToHtml } = await import('shiki')
    const html = await codeToHtml(src, {
      lang: language,
      theme: resolvedTheme.value,
    })
    if (seq === highlightSeq)
      highlightedHtml.value = html
  }
  catch {
    if (seq === highlightSeq)
      highlightedHtml.value = plainHtml(src)
  }
}

async function copy() {
  const text = resolvedCopyValue.value
  if (!text || typeof navigator === 'undefined' || !navigator.clipboard)
    return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => {
      copied.value = false
    }, 1500)
  }
  catch {}
}

let observer: MutationObserver | undefined

function updateHasDarkAncestor() {
  hasDarkAncestor.value = !!rootRef.value?.closest('.dark')
}

onMounted(() => {
  updateHasDarkAncestor()
  observer = new MutationObserver(updateHasDarkAncestor)
  let node: HTMLElement | null = rootRef.value
  while (node) {
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['class'],
    })
    node = node.parentElement
  }
})

onUnmounted(() => {
  observer?.disconnect()
  clearTimeout(copyResetTimer)
})

watch([resolvedCode, resolvedTheme], highlight, { immediate: true })
</script>

<template>
  <div
    ref="rootRef"
    class="m-code-highlight m-reset-css maz:group maz:relative"
    :class="{ '--no-rounded': !rounded, 'dark': colorMode === 'dark', 'light': colorMode === 'light' }"
  >
    <div class="m-code-highlight__content" v-html="highlightedHtml" />
    <span class="maz:absolute maz:top-2 maz:right-2 maz:rounded-sm maz:px-2 maz:py-1 maz:text-caption" :class="{ 'maz:transition-opacity maz:group-hover:opacity-0': copyable }">{{ language }}</span>
    <MazBtn
      v-if="copyable && resolvedCopyValue"
      v-tooltip="{
        text: copied ? copiedLabel : copyLabel,
        color: 'surface',
      }"
      size="xs"
      color="transparent"
      outlined
      class="m-code-highlight__copy-btn maz:absolute maz:top-2 maz:right-2 maz:opacity-0 maz:transition-opacity maz:group-hover:opacity-100 maz:focus-visible:opacity-100"
      :aria-label="copied ? copiedLabel : copyLabel"
      :icon="copied ? MazCheck : MazClipboard"
      @click="copy"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-code-highlight {
  :deep(pre.shiki) {
    @apply maz:rounded-md maz:overflow-x-auto maz:scrollbar-themed maz:p-4 maz:type-code maz:text-sm;
  }

  :deep(code) {
    @apply maz:type-code;
  }

  &.--no-rounded :deep(pre.shiki) {
    @apply maz:rounded-none;
  }
}
</style>
