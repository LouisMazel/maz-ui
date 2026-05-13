<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { VNode } from 'vue'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazClipboard } from '@maz-ui/icons/lazy/MazClipboard'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, useSlots, watch } from 'vue'
import { vTooltip } from '../directives/vTooltip'

export interface MazCodeHighlightProps {
  /** Source code to highlight */
  code?: string
  /** Language identifier for syntax highlighting (e.g. 'vue', 'ts', 'bash') */
  language?: string
  /** Override the shiki theme name. Defaults to github-light/github-dark based on current color mode */
  theme?: string
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
const highlightedHtml = ref('')
const isDark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
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
      highlightedHtml.value = `<pre><code>${escapeHtml(src)}</code></pre>`
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

onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onUnmounted(() => {
  observer?.disconnect()
  clearTimeout(copyResetTimer)
})

watch([resolvedCode, resolvedTheme], highlight, { immediate: true })
</script>

<template>
  <div class="m-code-highlight m-reset-css maz:group maz:relative" :class="{ '--no-rounded': !rounded }">
    <div class="m-code-highlight__content" v-html="highlightedHtml" />
    <span class="maz:absolute maz:top-2 maz:right-2 maz:rounded-sm maz:px-2 maz:py-1 maz:text-xs maz:text-muted" :class="{ 'maz:transition-opacity maz:group-hover:opacity-0': copyable }">{{ language }}</span>
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
    @apply maz:rounded-md maz:overflow-x-auto maz:p-4 maz:text-sm maz:font-mono;

    line-height: 1.6;
  }

  :deep(code) {
    @apply maz:font-mono;
  }

  &.--no-rounded :deep(pre.shiki) {
    @apply maz:rounded-none;
  }
}
</style>
