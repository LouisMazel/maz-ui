<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useClipboard } from '../composables/useClipboard.ts'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import MazCodeFrameButtons from './MazCodeHighlight/MazCodeFrameButtons.vue'
import { loadShiki } from './MazCodeHighlight/shiki.ts'
import { useCodeColorMode } from './MazCodeHighlight/useCodeColorMode.ts'
import { useFollowScroll } from './MazCodeHighlight/useFollowScroll.ts'

export type MazLogStreamLineType = 'default' | 'muted' | 'error' | 'warning' | 'success' | 'info'

export type MazLogStreamLabelColor = 'muted' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive'

export interface MazLogStreamLine {
  /** Stable key of the line. Defaults to its rank in `lines`. */
  id?: string | number
  /** Text of the line */
  text: string
  /**
   * Color of the line: `muted` for what is secondary (a tool, a status), `error` for a failure.
   * @values `'default' | 'muted' | 'error' | 'warning' | 'success' | 'info'`
   * @default 'default'
   */
  type?: MazLogStreamLineType
  /** Short text on the left of the line (a source, a kind: `read`, `stderr`, `build`), aligned for every line */
  label?: string
  /**
   * Color of the label
   * @values `'muted' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive'`
   * @default 'muted'
   */
  labelColor?: MazLogStreamLabelColor
  /** The text is rendered by the `markdown` slot instead of as plain text */
  markdown?: boolean
}

export interface MazLogStreamProps {
  /** Lines of the log: a string is a plain line, an object sets its type, label or markdown */
  lines?: (string | MazLogStreamLine)[]
  /**
   * Follow the stream: the block stays scrolled to the bottom as lines are appended, until the user scrolls up;
   * scrolling back to the bottom follows again.
   * @default true
   */
  follow?: boolean
  /**
   * Maximum height of the block (any CSS length, e.g. `20rem`): the log scrolls inside the block.
   */
  maxHeight?: string
  /**
   * Keeps only the last lines of the log in the DOM (the older ones stay in the copied text). Use it for logs that grow
   * without end.
   */
  maxLines?: number
  /**
   * Wrap long lines instead of scrolling horizontally.
   * @default true
   */
  wrap?: boolean
  /**
   * Show the copy-to-clipboard button on hover.
   * @default true
   */
  copyable?: boolean
  /**
   * Value copied to the clipboard. Defaults to the text of every line (with its label in front).
   */
  copyValue?: string
  /**
   * Color mode of the block.
   * - `auto`: follows the closest `.dark` ancestor, then the `@maz-ui/themes` color mode when the theme plugin is installed, then the `dark` class of `<html>`
   * - `light` / `dark`: forces the mode of this block, whatever the app color mode
   * @default 'auto'
   */
  colorMode?: 'auto' | 'light' | 'dark'
  /**
   * Apply rounded corners on the block.
   * @default true
   */
  rounded?: boolean
  /**
   * Size of the text (and of the padding around it).
   * Can be set for the whole app with `defaults.MazLogStream.size` or `defaults.global.size` of the MazUi plugin.
   * @default 'md'
   */
  size?: MazSize
  /**
   * Custom translations for the buttons. They are the ones of MazCodeHighlight.
   * @type {Partial<MazUiTranslationsNestedSchema['codeHighlight']>}
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['codeHighlight']>
}

const {
  lines = [],
  maxLines,
  copyValue,
  maxHeight,
  translations,
  follow = true,
} = defineProps<MazLogStreamProps>()

defineSlots<{
  /** Renders the text of the lines with `markdown: true` (e.g. with MazMarkdown). Without it, the text shows as is. */
  markdown?: (props: { line: MazLogStreamLine, text: string, index: number }) => unknown
  /** Shown when there is no line yet */
  empty?: () => unknown
}>()

const { colorMode, rounded, copyable, size, wrap } = useGlobalConfig<{
  colorMode: NonNullable<MazLogStreamProps['colorMode']>
  rounded: boolean
  copyable: boolean
  size: NonNullable<MazLogStreamProps['size']>
  wrap: boolean
}>('MazLogStream', {
  colorMode: 'auto',
  rounded: true,
  copyable: true,
  size: 'md',
  wrap: true,
})

const { t } = useTranslations()
const { copy: copyText, copied } = useClipboard()

const copyLabel = computed(() => translations?.copyToClipboard ?? t('codeHighlight.copyToClipboard'))
const copiedLabel = computed(() => translations?.copiedToClipboard ?? t('codeHighlight.copiedToClipboard'))
const scrollToBottomLabel = computed(() => translations?.scrollToBottom ?? t('codeHighlight.scrollToBottom'))

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const { isDark } = useCodeColorMode(() => rootRef.value, () => colorMode.value)
const { lightTheme, darkTheme, theme } = useGlobalConfig<{
  theme: string | undefined
  lightTheme: string
  darkTheme: string
}>('MazCodeHighlight', {
  theme: undefined,
  lightTheme: 'github-light',
  darkTheme: 'tokyo-night',
})
const resolvedTheme = computed(() => theme.value ?? (isDark.value ? darkTheme.value : lightTheme.value))
const themeColors = ref<{ bg: string, fg: string }>()

watch(resolvedTheme, async (name, _, onCleanup) => {
  let stale = false
  onCleanup(() => {
    stale = true
  })

  let colors: { bg: string, fg: string } | undefined
  try {
    const { codeToTokens } = await loadShiki()
    const { bg, fg } = await codeToTokens(' ', { lang: 'text', theme: name } as Parameters<typeof codeToTokens>[1])
    colors = bg && fg ? { bg, fg } : undefined
  }
  catch {
    colors = undefined
  }

  if (!stale)
    themeColors.value = colors
}, { immediate: true })

const rootStyle = computed(() => ({
  ...(maxHeight ? { '--m-log-stream-max-height': maxHeight } : {}),
  ...(themeColors.value ? { '--m-log-stream-bg': themeColors.value.bg, '--m-log-stream-fg': themeColors.value.fg } : {}),
}))

const scrollerRef = useTemplateRef<HTMLElement>('scrollerRef')

const { awayFromBottom, element, onScroll, scrollToBottom, sync } = useFollowScroll(() => scrollerRef.value ?? undefined, () => follow)

const hiddenCount = computed(() => maxLines && lines.length > maxLines
  ? lines.length - maxLines
  : 0)
const visibleLines = computed(() => hiddenCount.value > 0
  ? lines.slice(hiddenCount.value)
  : lines)

const LINE_TYPE_CLASSES: Record<MazLogStreamLineType, string> = {
  default: '',
  muted: 'maz:opacity-60',
  error: 'maz:text-destructive',
  warning: 'maz:text-warning',
  success: 'maz:text-success',
  info: 'maz:text-info',
}

const LABEL_COLOR_CLASSES: Record<MazLogStreamLabelColor, string> = {
  muted: 'maz:opacity-60',
  primary: 'maz:text-primary',
  secondary: 'maz:text-secondary',
  accent: 'maz:text-accent',
  info: 'maz:text-info',
  success: 'maz:text-success',
  warning: 'maz:text-warning',
  destructive: 'maz:text-destructive',
}

function textOf(line: string | MazLogStreamLine) {
  return typeof line === 'string'
    ? line
    : line.text
}

function typeOf(line: string | MazLogStreamLine) {
  return typeof line === 'string'
    ? undefined
    : line.type
}

function labelOf(line: string | MazLogStreamLine) {
  return typeof line === 'string'
    ? undefined
    : line.label
}

function labelColorOf(line: string | MazLogStreamLine) {
  return typeof line === 'string'
    ? undefined
    : line.labelColor
}

function isMarkdown(line: string | MazLogStreamLine) {
  return typeof line !== 'string' && !!line.markdown
}

function objectOf(line: string | MazLogStreamLine): MazLogStreamLine {
  return typeof line === 'string'
    ? { text: line }
    : line
}

function keyOf(line: string | MazLogStreamLine, index: number) {
  return typeof line === 'string'
    ? hiddenCount.value + index
    : line.id ?? hiddenCount.value + index
}

async function copy() {
  const text = copyValue ?? lines.map((line) => {
    const label = labelOf(line)
    return label
      ? `${label} ${textOf(line)}`
      : textOf(line)
  }).join('\n')

  if (text)
    await copyText(text)
}

watch(() => [visibleLines.value.length, visibleLines.value.length > 0 && textOf(visibleLines.value.at(-1)!)], async () => {
  await nextTick()
  sync(true)
}, { flush: 'post' })

onMounted(() => sync(false))

defineExpose({
  /** Scrolls the block to its last line and follows the next ones again (with `follow`). */
  scrollToBottom,
})
</script>

<template>
  <div
    ref="rootRef"
    class="m-log-stream m-reset-css maz:group maz:relative"
    :class="[`--size-${size}`, { '--no-rounded': !rounded, '--wrap': wrap, 'dark': colorMode === 'dark', 'light': colorMode === 'light', '--dark': isDark }]"
    :style="rootStyle"
  >
    <div
      ref="scrollerRef"
      class="m-log-stream__content"
      role="log"
      tabindex="0"
      @scroll.passive="onScroll"
    >
      <div
        v-for="(line, index) in visibleLines"
        :key="keyOf(line, index)"
        v-memo="[line, textOf(line), typeOf(line), labelOf(line), labelColorOf(line), isMarkdown(line), hiddenCount]"
        class="m-log-stream__line"
        :class="LINE_TYPE_CLASSES[typeOf(line) ?? 'default']"
      >
        <span v-if="labelOf(line)" class="m-log-stream__label" :class="LABEL_COLOR_CLASSES[labelColorOf(line) ?? 'muted']">{{ labelOf(line) }}</span>
        <div class="m-log-stream__text">
          <slot v-if="isMarkdown(line)" name="markdown" :line="objectOf(line)" :text="textOf(line)" :index="hiddenCount + index">
            {{ textOf(line) }}
          </slot>
          <template v-else>
            {{ textOf(line) }}
          </template>
        </div>
      </div>
      <div v-if="visibleLines.length === 0" class="maz:opacity-60">
        <slot name="empty" />
      </div>
    </div>
    <MazCodeFrameButtons
      :copyable="copyable && lines.length > 0"
      :copied
      :copy-label
      :copied-label
      :scroll-to-bottom-label
      :target="element"
      :away-from-bottom
      prefix="m-log-stream"
      @copy="copy"
      @scroll-to-bottom="scrollToBottom"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-log-stream {
  --m-log-stream-bg: var(--maz-log-stream-light-bg, #fff);
  --m-log-stream-fg: var(--maz-log-stream-light-fg, #24292e);

  &.--no-rounded .m-log-stream__content {
    @apply maz:rounded-none;
  }
}

.m-log-stream.--dark,
.m-log-stream.dark {
  --m-log-stream-bg: var(--maz-log-stream-dark-bg, #1a1b26);
  --m-log-stream-fg: var(--maz-log-stream-dark-fg, #a9b1d6);
}

.m-log-stream.light:not(.--dark) {
  --m-log-stream-bg: var(--maz-log-stream-light-bg, #fff);
  --m-log-stream-fg: var(--maz-log-stream-light-fg, #24292e);
}

.m-log-stream__content {
  @apply maz:flex maz:flex-col maz:gap-0.5 maz:rounded-md maz:overflow-auto maz:scrollbar-themed maz:p-4 maz:type-code maz:text-sm;

  max-block-size: var(--m-log-stream-max-height, none);
  background-color: var(--m-log-stream-bg);
  color: var(--m-log-stream-fg);
}

.m-log-stream__line {
  @apply maz:flex maz:items-baseline maz:gap-2 maz:min-w-max;
}

.m-log-stream__label {
  @apply maz:w-16 maz:shrink-0;
}

.m-log-stream__text {
  @apply maz:min-w-0 maz:whitespace-pre;
}

.m-log-stream.--wrap {
  .m-log-stream__line {
    @apply maz:min-w-0;
  }

  .m-log-stream__text {
    @apply maz:break-all maz:whitespace-pre-wrap;
  }
}

.m-log-stream.--size-mini .m-log-stream__content {
  @apply maz:p-2 maz:text-[0.6875rem];
}

.m-log-stream.--size-xs .m-log-stream__content {
  @apply maz:p-2.5 maz:text-xs;
}

.m-log-stream.--size-sm .m-log-stream__content {
  @apply maz:p-3 maz:text-[0.8125rem];
}

.m-log-stream.--size-lg .m-log-stream__content {
  @apply maz:p-5 maz:text-base;
}

.m-log-stream.--size-xl .m-log-stream__content {
  @apply maz:p-6 maz:text-lg;
}
</style>
