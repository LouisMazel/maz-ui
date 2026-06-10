<script lang="ts">
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { Component, HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize } from './types'

export type MazMarkdownEditorMode = 'write' | 'preview' | 'split'

export type MazMarkdownEditorToolbarAction
  = | 'heading'
    | 'bold'
    | 'italic'
    | 'strikethrough'
    | 'quote'
    | 'code'
    | 'codeBlock'
    | 'link'
    | 'image'
    | 'bulletList'
    | 'orderedList'
    | 'checkList'
    | 'table'

export interface MazMarkdownEditorProps {
  /** Style attribute of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribute of the component root element */
  class?: HTMLAttributes['class']
  /** @model The markdown value of the editor */
  modelValue?: string
  /** The id of the textarea */
  id?: string
  /** The name of the textarea */
  name?: string
  /** Static label displayed above the editor */
  label?: string
  /** The placeholder of the textarea */
  placeholder?: string
  /** If the editor is required */
  required?: boolean
  /** If the editor is disabled */
  disabled?: boolean
  /** If the editor is readonly */
  readonly?: boolean
  /** If the editor has an error */
  error?: boolean
  /** If the editor has a success */
  success?: boolean
  /** If the editor has a warning */
  warning?: boolean
  /** The color of the editor */
  color?: MazColor
  /**
   * Size radius of the component's border
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * Static label displayed above the editor. Unlike a floating label, this remains fixed
   */
  topLabel?: string
  /**
   * Helper text displayed below the editor to provide additional context or validation feedback
   * @example "Markdown is supported"
   */
  assistiveText?: string
  /**
   * Show the formatting toolbar. Pass `true` for the full toolbar, or an ordered array of
   * action keys to display only a subset (and control their order).
   * @type {boolean | MazMarkdownEditorToolbarAction[]}
   * @default false
   */
  toolbar?: boolean | MazMarkdownEditorToolbarAction[]
  /**
   * Display line numbers in a gutter on the left of the editor
   * @default false
   */
  lineNumbers?: boolean
  /**
   * Enable keyboard shortcuts for the toolbar actions (e.g. Cmd/Ctrl+B for bold).
   * @default true
   */
  shortcuts?: boolean
  /**
   * Sanitize the rendered preview HTML with DOMPurify
   * @default true
   */
  sanitize?: boolean
  /**
   * Custom markdown renderer. Receives the raw markdown and returns an HTML string (sync or async).
   * Falls back to `marked` when omitted. The result is still sanitized when `sanitize` is enabled.
   */
  renderFunction?: (markdown: string) => string | Promise<string>
  /**
   * Options forwarded to `marked` when using the default renderer
   */
  markedOptions?: Record<string, unknown>
  /**
   * Minimum number of visible rows of the editor textarea
   * @default 6
   */
  rows?: number
  /**
   * Custom translations for the component. Override any key independently.
   * @type {DeepPartial<MazUiTranslationsNestedSchema['markdownEditor']>}
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['markdownEditor']>
}
</script>

<script lang="ts" setup>
import type { MazDropdownMenuItem } from './MazDropdown.vue'
import { MazBold } from '@maz-ui/icons/lazy/MazBold'
import { MazChatBubbleBottomCenterText } from '@maz-ui/icons/lazy/MazChatBubbleBottomCenterText'
import { MazCheckCircle } from '@maz-ui/icons/lazy/MazCheckCircle'
import { MazCodeBracket } from '@maz-ui/icons/lazy/MazCodeBracket'
import { MazCodeBracketSquare } from '@maz-ui/icons/lazy/MazCodeBracketSquare'
import { MazEye } from '@maz-ui/icons/lazy/MazEye'
import { MazHashtag } from '@maz-ui/icons/lazy/MazHashtag'
import { MazItalic } from '@maz-ui/icons/lazy/MazItalic'
import { MazLinkIcon } from '@maz-ui/icons/lazy/MazLinkIcon'
import { MazListBullet } from '@maz-ui/icons/lazy/MazListBullet'
import { MazNumberedList } from '@maz-ui/icons/lazy/MazNumberedList'
import { MazPencil } from '@maz-ui/icons/lazy/MazPencil'
import { MazPhoto } from '@maz-ui/icons/lazy/MazPhoto'
import { MazStrikethrough } from '@maz-ui/icons/lazy/MazStrikethrough'
import { MazTableCells } from '@maz-ui/icons/lazy/MazTableCells'
import { MazViewColumns } from '@maz-ui/icons/lazy/MazViewColumns'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, ref, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import MazBtn from './MazBtn.vue'
import MazBtnGroup from './MazBtnGroup.vue'
import MazDropdown from './MazDropdown.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  modelValue,
  id,
  name = 'MazMarkdownEditor',
  label,
  placeholder,
  required = false,
  disabled = false,
  readonly = false,
  error = false,
  success = false,
  warning = false,
  color = 'primary',
  topLabel,
  assistiveText,
  toolbar = false,
  lineNumbers = false,
  shortcuts = true,
  sanitize = true,
  renderFunction,
  markedOptions,
  rows = 6,
  translations,
} = defineProps<MazMarkdownEditorProps>()

const emits = defineEmits<{
  /**
   * Emitted when the markdown value changes
   * @property {string | undefined} value - The markdown value
   */
  (event: 'update:model-value', value?: string): void
  /**
   * Emitted when the markdown value changes
   * @property {string | undefined} value - The markdown value
   */
  (event: 'input', value?: string): void
  /**
   * Emitted when the textarea is focused
   * @property {FocusEvent} event - The focus event
   */
  (event: 'focus', value: FocusEvent): void
  /**
   * Emitted when the textarea is blurred
   * @property {FocusEvent} event - The blur event
   */
  (event: 'blur', value: FocusEvent): void
  /**
   * Emitted when the textarea value changes
   * @property {Event} event - The change event
   */
  (event: 'change', value: Event): void
}>()

defineSlots<{
  /** Replace the static label above the editor */
  'label'?: () => unknown
  /** Replace the toolbar content (only rendered when the toolbar is enabled and not in preview mode) */
  'toolbar'?: (props: {
    /** The current editor mode */
    mode: MazMarkdownEditorMode
    /** Wrap the current selection with the given markers */
    wrapSelection: typeof wrapSelection
    /** Prefix every selected line with the given string */
    prefixLines: typeof prefixLines
    /** Apply a heading of the given level to the selected lines */
    applyHeading: typeof applyHeading
    /** Insert a markdown link at the selection */
    insertLink: typeof insertLink
    /** Insert a markdown image at the selection */
    insertImage: typeof insertImage
    /** Insert a fenced code block at the selection */
    insertCodeBlock: typeof insertCodeBlock
    /** Insert a markdown table at the selection */
    insertTable: typeof insertTable
  }) => unknown
  /** Content displayed in the preview pane when there is nothing to render */
  'empty-preview'?: () => unknown
}>()

const mode = defineModel<MazMarkdownEditorMode>('mode', { default: 'write' })

const { roundedSize } = useGlobalConfig<{ roundedSize: MazRoundedSize }>('MazMarkdownEditor', { roundedSize: 'md' })

const { t } = useTranslations()

const instanceId = useInstanceUniqId({
  componentName: 'MazMarkdownEditor',
  providedId: id,
})

const textareaEl = ref<HTMLTextAreaElement>()
const gutterEl = ref<HTMLElement>()
const previewHtml = ref('')
const isRendering = ref(false)

/* eslint-disable complexity */
const labels = computed(() => ({
  write: translations?.write ?? t('markdownEditor.write'),
  preview: translations?.preview ?? t('markdownEditor.preview'),
  split: translations?.split ?? t('markdownEditor.split'),
  emptyPreview: translations?.emptyPreview ?? t('markdownEditor.emptyPreview'),
  toolbar: {
    heading: translations?.toolbar?.heading ?? t('markdownEditor.toolbar.heading'),
    bold: translations?.toolbar?.bold ?? t('markdownEditor.toolbar.bold'),
    italic: translations?.toolbar?.italic ?? t('markdownEditor.toolbar.italic'),
    strikethrough: translations?.toolbar?.strikethrough ?? t('markdownEditor.toolbar.strikethrough'),
    quote: translations?.toolbar?.quote ?? t('markdownEditor.toolbar.quote'),
    code: translations?.toolbar?.code ?? t('markdownEditor.toolbar.code'),
    codeBlock: translations?.toolbar?.codeBlock ?? t('markdownEditor.toolbar.codeBlock'),
    link: translations?.toolbar?.link ?? t('markdownEditor.toolbar.link'),
    image: translations?.toolbar?.image ?? t('markdownEditor.toolbar.image'),
    bulletList: translations?.toolbar?.bulletList ?? t('markdownEditor.toolbar.bulletList'),
    orderedList: translations?.toolbar?.orderedList ?? t('markdownEditor.toolbar.orderedList'),
    checkList: translations?.toolbar?.checkList ?? t('markdownEditor.toolbar.checkList'),
    table: translations?.toolbar?.table ?? t('markdownEditor.toolbar.table'),
  },
  headings: {
    h1: translations?.headings?.h1 ?? t('markdownEditor.headings.h1'),
    h2: translations?.headings?.h2 ?? t('markdownEditor.headings.h2'),
    h3: translations?.headings?.h3 ?? t('markdownEditor.headings.h3'),
  },
}))
/* eslint-enable complexity */

const inputValue = computed({
  get: () => modelValue,
  set: value => updateValue(value),
})

function updateValue(value?: string) {
  emits('update:model-value', value)
  emits('input', value)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

let renderSeq = 0

async function parseToHtml(source: string): Promise<string> {
  if (renderFunction)
    return renderFunction(source)

  const { marked } = await import('marked')
  return marked.parse(source, { gfm: true, breaks: true, ...markedOptions })
}

async function sanitizeHtml(html: string, source: string): Promise<string> {
  if (!sanitize)
    return html

  try {
    const { default: DOMPurify } = await import('dompurify')
    return DOMPurify.sanitize(html)
  }
  catch {
    return `<pre>${escapeHtml(source)}</pre>`
  }
}

async function renderPreview() {
  const seq = ++renderSeq
  const source = modelValue ?? ''

  if (!source.trim() || typeof globalThis.window === 'undefined') {
    if (seq === renderSeq)
      previewHtml.value = ''
    return
  }

  isRendering.value = true

  try {
    const html = await sanitizeHtml(await parseToHtml(source), source)
    if (seq === renderSeq)
      previewHtml.value = html
  }
  catch {
    if (seq === renderSeq)
      previewHtml.value = `<pre>${escapeHtml(source)}</pre>`
  }
  finally {
    if (seq === renderSeq)
      isRendering.value = false
  }
}

function setMode(value: MazMarkdownEditorMode) {
  if (disabled)
    return
  mode.value = value
}

function tryExecInsert(el: HTMLTextAreaElement, text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function')
    return false

  try {
    return document.execCommand('insertText', false, text)
  }
  catch {
    return false
  }
}

function replaceRange(rangeStart: number, rangeEnd: number, text: string, caretStart: number, caretEnd = caretStart) {
  const el = textareaEl.value
  if (!el || disabled || readonly)
    return

  el.focus()
  el.setSelectionRange(rangeStart, rangeEnd)

  if (!tryExecInsert(el, text)) {
    const value = modelValue ?? ''
    updateValue(value.slice(0, rangeStart) + text + value.slice(rangeEnd))
  }

  nextTick(() => {
    el.focus()
    el.setSelectionRange(caretStart, caretEnd)
  })
}

function wrapSelection(before: string, after = before) {
  const el = textareaEl.value
  if (!el)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end)
  const caret = start + before.length

  replaceRange(start, end, `${before}${selected}${after}`, caret, caret + selected.length)
}

function prefixLines(prefix: string) {
  const el = textareaEl.value
  if (!el)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const block = value.slice(lineStart, end)
  const prefixed = block.split('\n').map(line => prefix + line).join('\n')

  replaceRange(lineStart, end, prefixed, lineStart, lineStart + prefixed.length)
}

function applyHeading(level: number) {
  prefixLines(`${'#'.repeat(level)} `)
}

function insertLink() {
  const el = textareaEl.value
  if (!el)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end) || labels.value.toolbar.link.toLowerCase()
  const urlStart = start + selected.length + 3

  replaceRange(start, end, `[${selected}](url)`, urlStart, urlStart + 3)
}

function insertImage() {
  const el = textareaEl.value
  if (!el)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end) || 'alt'
  const urlStart = start + selected.length + 4

  replaceRange(start, end, `![${selected}](url)`, urlStart, urlStart + 3)
}

function insertCodeBlock() {
  const el = textareaEl.value
  if (!el)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end)
  const caret = start + 4

  replaceRange(start, end, `\`\`\`\n${selected}\n\`\`\``, caret, caret + selected.length)
}

function insertTable() {
  const el = textareaEl.value
  if (!el)
    return

  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const snippet = '| Header | Header |\n| --- | --- |\n| Cell | Cell |\n'

  replaceRange(start, end, snippet, start + snippet.length)
}

const SIMPLE_ACTIONS: Record<Exclude<MazMarkdownEditorToolbarAction, 'heading'>, { icon: Component, run: () => void }> = {
  bold: { icon: MazBold, run: () => wrapSelection('**') },
  italic: { icon: MazItalic, run: () => wrapSelection('_') },
  strikethrough: { icon: MazStrikethrough, run: () => wrapSelection('~~') },
  quote: { icon: MazChatBubbleBottomCenterText, run: () => prefixLines('> ') },
  code: { icon: MazCodeBracket, run: () => wrapSelection('`') },
  codeBlock: { icon: MazCodeBracketSquare, run: insertCodeBlock },
  link: { icon: MazLinkIcon, run: insertLink },
  image: { icon: MazPhoto, run: insertImage },
  bulletList: { icon: MazListBullet, run: () => prefixLines('- ') },
  orderedList: { icon: MazNumberedList, run: () => prefixLines('1. ') },
  checkList: { icon: MazCheckCircle, run: () => prefixLines('- [ ] ') },
  table: { icon: MazTableCells, run: insertTable },
}

interface EditorShortcut {
  action: MazMarkdownEditorToolbarAction
  key?: string
  code?: string
  shift: boolean
  alt: boolean
  token: string
  run: () => void
}

const SHORTCUT_BINDINGS: EditorShortcut[] = [
  { action: 'bold', key: 'b', shift: false, alt: false, token: 'B', run: SIMPLE_ACTIONS.bold.run },
  { action: 'italic', key: 'i', shift: false, alt: false, token: 'I', run: SIMPLE_ACTIONS.italic.run },
  { action: 'link', key: 'k', shift: false, alt: false, token: 'K', run: SIMPLE_ACTIONS.link.run },
  { action: 'code', key: 'e', shift: false, alt: false, token: 'E', run: SIMPLE_ACTIONS.code.run },
  { action: 'codeBlock', key: 'e', shift: true, alt: false, token: 'E', run: SIMPLE_ACTIONS.codeBlock.run },
  { action: 'strikethrough', key: 'x', shift: true, alt: false, token: 'X', run: SIMPLE_ACTIONS.strikethrough.run },
  { action: 'quote', code: 'Period', shift: true, alt: false, token: '.', run: SIMPLE_ACTIONS.quote.run },
  { action: 'bulletList', code: 'Digit8', shift: true, alt: false, token: '8', run: SIMPLE_ACTIONS.bulletList.run },
  { action: 'orderedList', code: 'Digit7', shift: true, alt: false, token: '7', run: SIMPLE_ACTIONS.orderedList.run },
  { action: 'checkList', key: 'l', shift: true, alt: false, token: 'L', run: SIMPLE_ACTIONS.checkList.run },
  { action: 'heading', code: 'Digit1', shift: false, alt: true, token: '1', run: () => applyHeading(1) },
  { action: 'heading', code: 'Digit2', shift: false, alt: true, token: '2', run: () => applyHeading(2) },
  { action: 'heading', code: 'Digit3', shift: false, alt: true, token: '3', run: () => applyHeading(3) },
]

const isApplePlatform = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '')

function formatShortcut(binding: EditorShortcut): string {
  const mod = isApplePlatform ? '⌘' : 'Ctrl+'
  const alt = binding.alt ? (isApplePlatform ? '⌥' : 'Alt+') : ''
  const shift = binding.shift ? (isApplePlatform ? '⇧' : 'Shift+') : ''
  return `${mod}${alt}${shift}${binding.token}`
}

const shortcutHints = computed(() => {
  const hints = {} as Partial<Record<MazMarkdownEditorToolbarAction, string>>
  if (!shortcuts)
    return hints
  for (const binding of SHORTCUT_BINDINGS) {
    if (!hints[binding.action])
      hints[binding.action] = formatShortcut(binding)
  }
  return hints
})

interface ListPattern {
  re: RegExp
  marker: (match: RegExpMatchArray) => string
  content: (match: RegExpMatchArray) => string
}

const LIST_PATTERNS: ListPattern[] = [
  { re: /^(\s*)([-*+]) \[[ x]\] (.*)$/i, marker: m => `${m[1]}${m[2]} [ ] `, content: m => m[3] },
  { re: /^(\s*)([-*+]) (.*)$/, marker: m => `${m[1]}${m[2]} `, content: m => m[3] },
  { re: /^(\s*)(\d+)([.)]) (.*)$/, marker: m => `${m[1]}${Number(m[2]) + 1}${m[3]} `, content: m => m[4] },
]

function handleListContinuation(): boolean {
  const el = textareaEl.value
  if (!el || el.selectionStart !== el.selectionEnd)
    return false

  const value = modelValue ?? ''
  const caret = el.selectionStart ?? 0
  const lineStart = value.lastIndexOf('\n', caret - 1) + 1
  const lineBreak = value.indexOf('\n', caret)
  const lineEnd = lineBreak === -1 ? value.length : lineBreak
  const line = value.slice(lineStart, lineEnd)

  for (const pattern of LIST_PATTERNS) {
    const match = line.match(pattern.re)
    if (!match)
      continue

    if (pattern.content(match).trim() === '') {
      replaceRange(lineStart, lineEnd, '', lineStart)
    }
    else {
      const marker = pattern.marker(match)
      replaceRange(caret, caret, `\n${marker}`, caret + marker.length + 1)
    }
    return true
  }

  return false
}

function handleKeydown(event: KeyboardEvent) {
  if (disabled || readonly)
    return

  if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
    if (handleListContinuation())
      event.preventDefault()
    return
  }

  if (!shortcuts || !(event.metaKey || event.ctrlKey))
    return

  const match = SHORTCUT_BINDINGS.find(binding =>
    binding.shift === event.shiftKey
    && binding.alt === event.altKey
    && (binding.code ? event.code === binding.code : event.key.toLowerCase() === binding.key),
  )

  if (match) {
    event.preventDefault()
    match.run()
  }
}

const DEFAULT_TOOLBAR_ACTIONS: MazMarkdownEditorToolbarAction[] = [
  'heading',
  'bold',
  'italic',
  'strikethrough',
  'quote',
  'code',
  'codeBlock',
  'link',
  'image',
  'bulletList',
  'orderedList',
  'checkList',
  'table',
]

const resolvedToolbarActions = computed<MazMarkdownEditorToolbarAction[]>(() => {
  if (toolbar === true)
    return DEFAULT_TOOLBAR_ACTIONS
  if (Array.isArray(toolbar))
    return toolbar.filter(key => key === 'heading' || key in SIMPLE_ACTIONS)
  return []
})

const toolbarButtons = computed(() => resolvedToolbarActions.value.map((key) => {
  if (key === 'heading')
    return { key, isHeading: true as const, label: labels.value.toolbar.heading, title: labels.value.toolbar.heading }

  const label = labels.value.toolbar[key]
  const hint = shortcutHints.value[key]

  return {
    key,
    isHeading: false as const,
    icon: SIMPLE_ACTIONS[key].icon,
    label,
    title: hint ? `${label} (${hint})` : label,
    run: SIMPLE_ACTIONS[key].run,
  }
}))

const headingItems = computed<MazDropdownMenuItem[]>(() => [
  { label: labels.value.headings.h1, onClick: () => applyHeading(1) },
  { label: labels.value.headings.h2, onClick: () => applyHeading(2) },
  { label: labels.value.headings.h3, onClick: () => applyHeading(3) },
])

const showToolbar = computed(() => resolvedToolbarActions.value.length > 0 && mode.value !== 'preview')

const lineCount = computed(() => (modelValue ?? '').split('\n').length)

function syncGutterScroll() {
  if (gutterEl.value && textareaEl.value)
    gutterEl.value.scrollTop = textareaEl.value.scrollTop
}

function handleFocus(event: FocusEvent) {
  emits('focus', event)
}

function handleBlur(event: FocusEvent) {
  emits('blur', event)
}

function handleChange(event: Event) {
  emits('change', event)
}

const borderStyle = computed(() => {
  if (error)
    return 'maz:border-destructive'
  if (success)
    return 'maz:border-success'
  if (warning)
    return 'maz:border-warning'
  return 'maz:border-divider maz:dark:border-divider-400'
})

const stateLabelColor = computed(() => ({
  'maz:text-destructive-600': error,
  'maz:text-success-600': success,
  'maz:text-warning-600': warning,
}))

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-xl',
} as const

const writePanelId = computed(() => `${instanceId.value}-write`)
const previewPanelId = computed(() => `${instanceId.value}-preview`)

const tabItems = computed(() => [
  {
    'id': `${instanceId.value}-tab-write`,
    'color': 'transparent' as const,
    'outlined': true,
    'active': mode.value === 'write',
    'startIcon': MazPencil,
    'size': 'xs' as const,
    'role': 'tab',
    'aria-controls': writePanelId.value,
    'aria-selected': mode.value === 'write',
    disabled,
    'text': labels.value.write,
    'onClick': () => setMode('write'),
  },
  {
    'id': `${instanceId.value}-tab-preview`,
    'color': 'transparent' as const,
    'outlined': true,
    'active': mode.value === 'preview',
    'startIcon': MazEye,
    'size': 'xs' as const,
    'role': 'tab',
    'aria-controls': previewPanelId.value,
    'aria-selected': mode.value === 'preview',
    disabled,
    'text': labels.value.preview,
    'onClick': () => setMode('preview'),
  },
  {
    'id': `${instanceId.value}-tab-split`,
    'color': 'transparent' as const,
    'outlined': true,
    'active': mode.value === 'split',
    'startIcon': MazViewColumns,
    'size': 'xs' as const,
    'role': 'tab',
    'aria-controls': `${writePanelId.value} ${previewPanelId.value}`,
    'aria-selected': mode.value === 'split',
    disabled,
    'text': labels.value.split,
    'onClick': () => setMode('split'),
  },
])

watch(
  [() => modelValue, mode],
  ([, currentMode]) => {
    if (currentMode !== 'write')
      renderPreview()
  },
  { immediate: true },
)

defineExpose({
  /** The underlying textarea element */
  textarea: textareaEl,
  /** The current editor mode (write / preview / split) */
  mode,
  /** Programmatically re-render the markdown preview */
  renderPreview,
  /** Focus the editor textarea */
  focus: () => textareaEl.value?.focus(),
})
</script>

<template>
  <div
    class="m-markdown-editor m-reset-css maz:flex maz:flex-col maz:gap-2"
    :class="classProp"
    :style
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
      v-if="topLabel || label || $slots.label"
      :for="instanceId"
      class="m-markdown-editor__top-label maz:w-max"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
      :class="stateLabelColor"
    >
      <!--
        @slot label - Replace the static label displayed above the editor
      -->
      <slot name="label">{{ topLabel ?? label }}</slot>
    </label>

    <div
      class="m-markdown-editor__box maz:flex maz:flex-col maz:overflow-hidden maz:text-foreground"
      :class="[
        borderStyle,
        ROUNDED_CLASS[roundedSize],
        `--${color}`,
        {
          '--is-disabled maz:disabled-cursor maz:border-divider maz:bg-surface-600 maz:text-muted maz:dark:border-divider-400 maz:dark:bg-surface-400': disabled,
          'maz:border maz:border-solid maz:bg-input': !disabled,
        },
      ]"
    >
      <div
        class="m-markdown-editor__header maz:flex maz:items-center maz:justify-between maz:gap-2 maz:border-b maz:bg-container maz:px-2 maz:py-1.5"
      >
        <div
          class="m-markdown-editor__tabs maz:flex maz:gap-1"
          role="tablist"
          :aria-label="name"
        >
          <MazBtnGroup size="sm" :items="tabItems" />
        </div>

        <div
          v-if="showToolbar"
          class="m-markdown-editor__toolbar maz:flex maz:flex-wrap maz:items-center maz:gap-0.5"
        >
          <!--
            @slot toolbar - Replace the toolbar content (only rendered when the toolbar is enabled and not in preview mode)
              @binding {MazMarkdownEditorMode} mode - The current editor mode
              @binding {Function} wrap-selection - Wrap the current selection with the given markers
              @binding {Function} prefix-lines - Prefix every selected line with the given string
              @binding {Function} apply-heading - Apply a heading of the given level to the selected lines
              @binding {Function} insert-link - Insert a markdown link at the selection
              @binding {Function} insert-image - Insert a markdown image at the selection
              @binding {Function} insert-code-block - Insert a fenced code block at the selection
              @binding {Function} insert-table - Insert a markdown table at the selection
          -->
          <slot
            name="toolbar"
            :mode="mode"
            :wrap-selection="wrapSelection"
            :prefix-lines="prefixLines"
            :apply-heading="applyHeading"
            :insert-link="insertLink"
            :insert-image="insertImage"
            :insert-code-block="insertCodeBlock"
            :insert-table="insertTable"
          >
            <template v-for="item in toolbarButtons" :key="item.key">
              <MazDropdown
                v-if="item.isHeading"
                :items="headingItems"
                trigger="adaptive"
                close-on-click
                transition="scale-pop"
                size="xs"
              >
                <template #trigger="{ toggle }">
                  <MazBtn
                    size="xs"
                    color="transparent"
                    type="button"
                    :icon="MazHashtag"
                    :aria-label="item.label"
                    :title="item.title"
                    :disabled="disabled || readonly"
                    data-action="heading"
                    @click="toggle"
                  />
                </template>
              </MazDropdown>
              <MazBtn
                v-else
                size="xs"
                color="transparent"
                type="button"
                :icon="item.icon"
                :aria-label="item.label"
                :title="item.title"
                :disabled="disabled || readonly"
                :data-action="item.key"
                @click="item.run()"
              />
            </template>
          </slot>
        </div>
      </div>

      <div
        class="m-markdown-editor__content maz:flex maz:flex-col"
        :class="{ 'maz:tab-s:flex-row': mode === 'split' }"
      >
        <div
          v-show="mode !== 'preview'"
          class="m-markdown-editor__editor maz:flex maz:min-w-0 maz:flex-1"
        >
          <div
            v-if="lineNumbers"
            ref="gutterEl"
            class="m-markdown-editor__gutter maz:overflow-hidden maz:border-r maz:border-divider maz:py-3 maz:pr-2 maz:pl-3 maz:text-right maz:font-mono maz:text-sm maz:text-muted maz:select-none maz:dark:border-divider-400"
            aria-hidden="true"
          >
            <span v-for="n in lineCount" :key="n" class="maz:block">{{ n }}</span>
          </div>
          <textarea
            :id="instanceId"
            ref="textareaEl"
            v-bind="$attrs"
            v-model="inputValue"
            class="m-markdown-editor__textarea maz:min-w-0 maz:flex-1 maz:resize-y maz:bg-transparent maz:px-4 maz:py-3 maz:font-mono maz:text-sm maz:outline-hidden"
            :name
            :rows
            :placeholder
            :disabled
            :readonly
            :required
            role="tabpanel"
            :aria-labelledby="`${instanceId}-tab-write`"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
            @scroll="syncGutterScroll"
            @keydown="handleKeydown"
          />
        </div>

        <div
          v-show="mode !== 'write'"
          :id="previewPanelId"
          class="m-markdown-editor__preview maz:min-w-0 maz:flex-1 maz:px-4 maz:py-3 maz:text-sm"
          :class="{ '--split maz:border-t maz:border-divider maz:tab-s:border-t-0 maz:tab-s:border-l maz:dark:border-divider-400': mode === 'split' }"
          role="tabpanel"
          :aria-labelledby="`${instanceId}-tab-preview`"
          :style="{ minHeight: `${rows * 1.5}rem` }"
        >
          <div v-if="previewHtml" class="m-markdown-editor__preview-content" v-html="previewHtml" />
          <p v-else-if="!isRendering" class="m-markdown-editor__preview-empty maz:text-muted maz:italic">
            <!--
              @slot empty-preview - Content displayed in the preview pane when there is nothing to render
            -->
            <slot name="empty-preview">
              {{ labels.emptyPreview }}
            </slot>
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="assistiveText"
      class="m-markdown-editor__bottom-text maz:-mt-1 maz:text-sm"
      :class="{
        'maz:text-destructive-600': error,
        'maz:text-success-600': success,
        'maz:text-warning-600': warning,
        'maz:text-muted': !error && !success && !warning,
      }"
    >
      {{ assistiveText }}
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-markdown-editor {
  &__box {
    transition: border-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

  &__box.--primary:focus-within {
    @apply maz:border-primary;
  }

  &__box.--secondary:focus-within {
    @apply maz:border-secondary;
  }

  &__box.--accent:focus-within {
    @apply maz:border-accent;
  }

  &__box.--info:focus-within {
    @apply maz:border-info;
  }

  &__box.--success:focus-within {
    @apply maz:border-success;
  }

  &__box.--warning:focus-within {
    @apply maz:border-warning;
  }

  &__box.--destructive:focus-within {
    @apply maz:border-destructive;
  }

  &__box.--contrast:focus-within {
    @apply maz:border-contrast;
  }

  &__box.--is-disabled * {
    @apply maz:disabled-cursor maz:text-muted;
  }

  &__gutter {
    line-height: 1.6;
  }

  &__textarea {
    field-sizing: content;
    line-height: 1.6;
  }

  &__preview-content {
    line-height: 1.6;

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
      @apply maz:font-semibold maz:mt-4 maz:mb-2 maz:first:mt-0;
    }

    :deep(h1) {
      @apply maz:text-2xl;
    }

    :deep(h2) {
      @apply maz:text-xl;
    }

    :deep(h3) {
      @apply maz:text-lg;
    }

    :deep(p) {
      @apply maz:my-2;
    }

    :deep(ul),
    :deep(ol) {
      @apply maz:my-2 maz:pl-6;
    }

    :deep(ul) {
      @apply maz:list-disc;
    }

    :deep(ol) {
      @apply maz:list-decimal;
    }

    :deep(a) {
      @apply maz:text-primary maz:underline;
    }

    :deep(blockquote) {
      @apply maz:border-l-4 maz:border-divider maz:pl-4 maz:text-muted maz:italic;
    }

    :deep(code) {
      @apply maz:rounded-xs maz:bg-surface-600 maz:px-1 maz:py-0.5 maz:font-mono maz:text-xs maz:dark:bg-surface-400;
    }

    :deep(pre) {
      @apply maz:my-2 maz:overflow-x-auto maz:rounded-md maz:bg-surface-600 maz:p-3 maz:dark:bg-surface-400;
    }

    :deep(pre code) {
      @apply maz:bg-transparent maz:p-0;
    }

    :deep(table) {
      @apply maz:my-2 maz:w-full maz:border-collapse;
    }

    :deep(th),
    :deep(td) {
      @apply maz:border maz:border-divider maz:px-2 maz:py-1 maz:dark:border-divider-400;
    }

    :deep(img) {
      @apply maz:max-w-full;
    }
  }
}
</style>
