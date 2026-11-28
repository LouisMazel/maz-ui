<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { GrammarState, ThemedToken, TokensResult } from 'shiki/core'
import type { VNode } from 'vue'
import type { MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, nextTick, onMounted, ref, useSlots, useTemplateRef, watch } from 'vue'
import { useClipboard } from '../composables/useClipboard.ts'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { escapeHtml } from '../utils/escapeHtml.ts'
import { tokensHtml } from './MazCodeHighlight/html.ts'
import MazCodeFrameButtons from './MazCodeHighlight/MazCodeFrameButtons.vue'
import { loadShiki } from './MazCodeHighlight/shiki.ts'
import { useCodeColorMode } from './MazCodeHighlight/useCodeColorMode.ts'
import { useFollowScroll } from './MazCodeHighlight/useFollowScroll.ts'

export interface MazCodeHighlightProps {
  /** Source code to highlight */
  code?: string
  /** Language identifier for syntax highlighting (e.g. 'vue', 'ts', 'bash') */
  language?: string
  /**
   * Shiki theme of the block whatever the color mode: takes priority over `lightTheme` and `darkTheme`.
   */
  theme?: string
  /**
   * Shiki theme used in light mode. Can be set for the whole app with `defaults.MazCodeHighlight.lightTheme` of the
   * MazUi plugin.
   * @default 'github-light'
   */
  lightTheme?: string
  /**
   * Shiki theme used in dark mode. Can be set for the whole app with `defaults.MazCodeHighlight.darkTheme` of the
   * MazUi plugin.
   * @default 'tokyo-night'
   */
  darkTheme?: string
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
   * Can be set for the whole app with `defaults.MazCodeHighlight.size` or `defaults.global.size` of the MazUi plugin.
   * @default 'md'
   */
  size?: MazSize
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
   * Previous version of the code: shows the changes from `diff` to `code` instead of the code alone. Added and removed
   * lines are highlighted with the numbers of the old and the new text, the unchanged lines are folded (see
   * `diffContext`) and the counts of added and removed lines show next to the language. The diff code is only loaded
   * when this prop is set. The copy button still copies `code`.
   */
  diff?: string
  /**
   * With `diff`: unchanged lines kept around each change, the others are folded into a button that shows them.
   * `Infinity` folds nothing.
   * @default 3
   */
  diffContext?: number
  /**
   * With `diff`: ignore the whitespace differences (indentation, trailing spaces) when comparing lines.
   * @default false
   */
  diffIgnoreWhitespace?: boolean
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
  copyValue,
  translations,
  maxHeight,
  follow = false,
  diff,
  diffContext = 3,
  diffIgnoreWhitespace = false,
} = defineProps<MazCodeHighlightProps>()

const { theme, lightTheme, darkTheme, colorMode, rounded, copyable, size, wrap, hideLanguage } = useGlobalConfig<{
  theme: string | undefined
  lightTheme: string
  darkTheme: string
  colorMode: NonNullable<MazCodeHighlightProps['colorMode']>
  rounded: boolean
  copyable: boolean
  size: NonNullable<MazCodeHighlightProps['size']>
  wrap: boolean
  hideLanguage: boolean
}>('MazCodeHighlight', {
  theme: undefined,
  lightTheme: 'github-light',
  darkTheme: 'tokyo-night',
  colorMode: 'auto',
  rounded: true,
  copyable: true,
  size: 'md',
  wrap: false,
  hideLanguage: false,
})

const { t } = useTranslations()

const MazCodeHighlightDiff = defineAsyncComponent(() => import('./MazCodeHighlight/MazCodeHighlightDiff.vue'))

const isDiff = computed(() => diff !== undefined)

const copyLabel = computed(() => translations?.copyToClipboard ?? t('codeHighlight.copyToClipboard'))
const copiedLabel = computed(() => translations?.copiedToClipboard ?? t('codeHighlight.copiedToClipboard'))
const scrollToBottomLabel = computed(() => translations?.scrollToBottom ?? t('codeHighlight.scrollToBottom'))

const slots = useSlots()
const rootRef = useTemplateRef<HTMLElement>('rootRef')
const { isDark } = useCodeColorMode(() => rootRef.value, () => colorMode.value)
const { copy: copyText, copied } = useClipboard()

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

const highlightedHtml = ref(resolvedCode.value && !isDiff.value
  ? plainHtml(resolvedCode.value)
  : '')

const resolvedTheme = computed(() => {
  if (theme.value)
    return theme.value
  return isDark.value ? darkTheme.value : lightTheme.value
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

function lineHtml(tokens: ThemedToken[] = []): string {
  return `<span class="line">${tokensHtml(tokens)}</span>`
}

function preOpen(result: TokensResult): string {
  const style = result.rootStyle || `background-color:${result.bg ?? ''};color:${result.fg ?? ''}`
  return `<pre class="shiki ${escapeHtml(result.themeName ?? '')}" style="${escapeHtml(style)}" tabindex="0">`
}

async function highlightStream(src: string): Promise<string> {
  const { codeToTokens } = await loadShiki()
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
  if (isDiff.value)
    return
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
    const { codeToHtml } = await loadShiki()
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

  if (text)
    await copyText(text)
}

const contentRef = useTemplateRef<HTMLElement>('contentRef')
function codeElement() {
  return contentRef.value?.querySelector<HTMLElement>('pre') ?? undefined
}

const { awayFromBottom, element: preElement, onScroll, scrollToBottom, sync: syncCodeElement } = useFollowScroll(codeElement, () => follow)

watch(highlightedHtml, async () => {
  await nextTick()
  syncCodeElement(true)
})

defineExpose({
  /** Scrolls the block to its last line and follows the next ones again (with `follow`). */
  scrollToBottom,
})

onMounted(() => syncCodeElement(false))

watch([resolvedCode, resolvedTheme, isDiff], highlight, { immediate: true })
</script>

<template>
  <div
    ref="rootRef"
    class="m-code-highlight m-reset-css maz:group maz:relative"
    :class="[`--size-${size}`, { '--no-rounded': !rounded, '--wrap': wrap, 'dark': colorMode === 'dark', 'light': colorMode === 'light' }]"
    :style="maxHeight ? { '--m-code-highlight-max-height': maxHeight } : undefined"
  >
    <div v-if="isDiff" ref="contentRef" class="m-code-highlight__content" @scroll.capture="onScroll">
      <MazCodeHighlightDiff
        :code="resolvedCode"
        :diff="diff!"
        :language
        :theme="resolvedTheme"
        :context="diffContext"
        :ignore-whitespace="diffIgnoreWhitespace"
        :wrap
        :translations
        :hide-language="hideLanguage"
        :copyable
        @ready="syncCodeElement(false)"
      />
    </div>
    <div v-else ref="contentRef" class="m-code-highlight__content" @scroll.capture="onScroll" v-html="highlightedHtml" />
    <span v-if="!hideLanguage && !isDiff" class="maz:absolute maz:top-2 maz:right-2 maz:rounded-sm maz:px-2 maz:py-1 maz:text-caption" :class="{ 'maz:transition-opacity maz:group-hover:opacity-0': copyable }">{{ language }}</span>
    <MazCodeFrameButtons
      :copyable="copyable && !!resolvedCopyValue"
      :copied
      :copy-label
      :copied-label
      :scroll-to-bottom-label
      :target="preElement"
      :away-from-bottom
      prefix="m-code-highlight"
      @copy="copy"
      @scroll-to-bottom="scrollToBottom"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-code-highlight {
  --m-code-highlight-pad: calc(var(--maz-space, 0.25rem) * 4);

  :deep(pre.shiki) {
    @apply maz:rounded-md maz:overflow-auto maz:scrollbar-themed maz:type-code maz:text-sm;

    box-sizing: border-box;
    padding: var(--m-code-highlight-pad);
    min-block-size: calc(var(--maz-control-height-xs, 2rem) + 1rem);
    max-block-size: var(--m-code-highlight-max-height, none);
  }

  &.--size-mini {
    --m-code-highlight-pad: calc(var(--maz-space, 0.25rem) * 2);
  }

  &.--size-mini :deep(pre.shiki) {
    @apply maz:text-[0.6875rem];
  }

  &.--size-xs {
    --m-code-highlight-pad: calc(var(--maz-space, 0.25rem) * 2.5);
  }

  &.--size-xs :deep(pre.shiki) {
    @apply maz:text-xs;
  }

  &.--size-sm {
    --m-code-highlight-pad: calc(var(--maz-space, 0.25rem) * 3);
  }

  &.--size-sm :deep(pre.shiki) {
    @apply maz:text-[0.8125rem];
  }

  &.--size-lg {
    --m-code-highlight-pad: calc(var(--maz-space, 0.25rem) * 5);
  }

  &.--size-lg :deep(pre.shiki) {
    @apply maz:text-base;
  }

  &.--size-xl {
    --m-code-highlight-pad: calc(var(--maz-space, 0.25rem) * 6);
  }

  &.--size-xl :deep(pre.shiki) {
    @apply maz:text-lg;
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
