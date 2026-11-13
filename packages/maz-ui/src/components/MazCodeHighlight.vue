<script lang="ts" setup>
import type { ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { GrammarState, ThemedToken, TokensResult } from 'shiki'
import type { Ref, VNode } from 'vue'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazClipboard } from '@maz-ui/icons/lazy/MazClipboard'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, getCurrentInstance, inject, nextTick, onMounted, onUnmounted, ref, useSlots, useTemplateRef, watch } from 'vue'
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
  /**
   * Size of the code text (and of the padding around it).
   * @default 'md'
   */
  size?: 'mini' | 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Maximum height of the block (any CSS length, e.g. `20rem`): longer code scrolls inside the block.
   */
  maxHeight?: string
  /**
   * Follow streamed code (logs, build output): the block stays scrolled to the bottom as code is appended, until the
   * user scrolls up; scrolling back to the bottom follows again. Appended lines are highlighted alone, not the whole
   * code again. Use it with `maxHeight`.
   * @default false
   */
  follow?: boolean
  /**
   * Wrap long lines instead of scrolling horizontally.
   * @default false
   */
  wrap?: boolean
  /**
   * Hide the language badge.
   * @default false
   */
  hideLanguage?: boolean
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
  size = 'md',
  maxHeight,
  follow = false,
  wrap = false,
  hideLanguage = false,
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

/**
 * Streamed highlighting (`follow`): the complete lines already highlighted, kept with the grammar state at their end,
 * so that appended code only tokenizes its new lines. Reset when the code is not an extension of the previous one, or
 * when the language or the theme changes.
 */
interface HighlightStream {
  key: string
  /** Code of the committed lines, ending with a line break. */
  code: string
  lines: string[]
  state?: GrammarState
  pre: string
}
let stream: HighlightStream | undefined

function tokenStyle(token: ThemedToken): string {
  if (token.htmlStyle)
    return Object.entries(token.htmlStyle).map(([key, value]) => `${key}:${value}`).join(';')
  const style: string[] = []
  if (token.color)
    style.push(`color:${token.color}`)
  if (token.bgColor)
    style.push(`background-color:${token.bgColor}`)
  const fontStyle = token.fontStyle ?? 0
  if (fontStyle & 1)
    style.push('font-style:italic')
  if (fontStyle & 2)
    style.push('font-weight:bold')
  const decorations = [
    fontStyle & 4
      ? 'underline'
      : '',
    fontStyle & 8
      ? 'line-through'
      : '',
  ].filter(Boolean)
  if (decorations.length > 0)
    style.push(`text-decoration:${decorations.join(' ')}`)
  return style.join(';')
}

function lineHtml(tokens: ThemedToken[] = []): string {
  const content = tokens.map(token => `<span style="${escapeHtml(tokenStyle(token))}">${escapeHtml(token.content)}</span>`).join('')
  return `<span class="line">${content}</span>`
}

function preOpen(result: TokensResult): string {
  const style = result.rootStyle || `background-color:${result.bg ?? ''};color:${result.fg ?? ''}`
  return `<pre class="shiki ${escapeHtml(result.themeName ?? '')}" style="${escapeHtml(style)}" tabindex="0">`
}

async function highlightStream(src: string): Promise<string> {
  const { codeToTokens } = await import('shiki')
  const options = { lang: language, theme: resolvedTheme.value }
  const key = `${language}|${resolvedTheme.value}`
  if (!stream || stream.key !== key || !src.startsWith(stream.code))
    stream = { key, code: '', lines: [], pre: '' }
  const current = stream
  const rest = src.slice(current.code.length)
  const cut = rest.lastIndexOf('\n')
  if (cut >= 0) {
    const complete = rest.slice(0, cut)
    const result = await codeToTokens(complete, { ...options, grammarState: current.state } as Parameters<typeof codeToTokens>[1])
    current.lines.push(...result.tokens.map(lineHtml))
    current.state = result.grammarState
    current.code += `${complete}\n`
    current.pre = preOpen(result)
  }
  const tail = rest.slice(cut + 1)
  const lines = [...current.lines]
  if (tail) {
    const result = await codeToTokens(tail, { ...options, grammarState: current.state } as Parameters<typeof codeToTokens>[1])
    lines.push(lineHtml(result.tokens[0]))
    current.pre ||= preOpen(result)
  }
  return `${current.pre}<code>${lines.join('\n')}</code></pre>`
}

let highlightSeq = 0
/** Streamed highlights run one after the other (they extend the same state); a pending one reads the latest code. */
let streamTask: Promise<void> | undefined
let streamQueued = false

function highlight() {
  if (!follow)
    return highlightFull()
  if (streamQueued)
    return streamTask
  streamQueued = true
  streamTask = (streamTask ?? Promise.resolve()).then(async () => {
    streamQueued = false
    const src = resolvedCode.value
    if (!src) {
      stream = undefined
      highlightedHtml.value = ''
      return
    }
    try {
      highlightedHtml.value = await highlightStream(src)
    }
    catch {
      stream = undefined
      highlightedHtml.value = plainHtml(src)
    }
  })
  return streamTask
}

async function highlightFull() {
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

const contentRef = useTemplateRef<HTMLElement>('contentRef')
/** Scroll of the code block, restored after each render (the `pre` is replaced), followed at the bottom with `follow`. */
const scroll = { top: 0, left: 0, atBottom: true }

function codeElement() {
  return contentRef.value?.querySelector<HTMLElement>('pre') ?? undefined
}

function onScroll(event: Event) {
  const element = event.target as HTMLElement
  if (element.tagName !== 'PRE')
    return
  scroll.top = element.scrollTop
  scroll.left = element.scrollLeft
  scroll.atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= 4
}

/** Scrolls the block to its last line and follows the next ones again (with `follow`). */
function scrollToBottom() {
  const element = codeElement()
  if (!element)
    return
  element.scrollTop = element.scrollHeight
  scroll.atBottom = true
}

watch(highlightedHtml, async () => {
  await nextTick()
  const element = codeElement()
  if (!element)
    return
  if (follow && scroll.atBottom) {
    scrollToBottom()
    return
  }
  element.scrollTop = scroll.top
  element.scrollLeft = scroll.left
})

defineExpose({
  /** Scrolls the block to its last line and follows the next ones again (with `follow`). */
  scrollToBottom,
})

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
    :class="[`--size-${size}`, { '--no-rounded': !rounded, '--wrap': wrap, 'dark': colorMode === 'dark', 'light': colorMode === 'light' }]"
    :style="maxHeight ? { '--m-code-highlight-max-height': maxHeight } : undefined"
  >
    <div ref="contentRef" class="m-code-highlight__content" @scroll.capture="onScroll" v-html="highlightedHtml" />
    <span v-if="!hideLanguage" class="maz:absolute maz:top-2 maz:right-2 maz:rounded-sm maz:px-2 maz:py-1 maz:text-caption" :class="{ 'maz:transition-opacity maz:group-hover:opacity-0': copyable }">{{ language }}</span>
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
    @apply maz:rounded-md maz:overflow-auto maz:scrollbar-themed maz:p-4 maz:type-code maz:text-sm;

    max-block-size: var(--m-code-highlight-max-height, none);
  }

  &.--size-mini :deep(pre.shiki) {
    @apply maz:p-2 maz:text-[0.6875rem];
  }

  &.--size-xs :deep(pre.shiki) {
    @apply maz:p-2.5 maz:text-xs;
  }

  &.--size-sm :deep(pre.shiki) {
    @apply maz:p-3 maz:text-[0.8125rem];
  }

  &.--size-lg :deep(pre.shiki) {
    @apply maz:p-5 maz:text-base;
  }

  &.--wrap :deep(pre.shiki) {
    @apply maz:break-all maz:whitespace-pre-wrap;
  }

  :deep(code) {
    @apply maz:type-code;
  }

  &.--no-rounded :deep(pre.shiki) {
    @apply maz:rounded-none;
  }
}
</style>
