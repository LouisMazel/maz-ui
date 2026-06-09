<script lang="ts">
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize } from './types'

export type MazMarkdownEditorMode = 'write' | 'preview'

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
   * Show the formatting toolbar (bold, italic, list, link, code)
   * @default false
   */
  toolbar?: boolean
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
import { MazBold } from '@maz-ui/icons/lazy/MazBold'
import { MazCodeBracket } from '@maz-ui/icons/lazy/MazCodeBracket'
import { MazEye } from '@maz-ui/icons/lazy/MazEye'
import { MazItalic } from '@maz-ui/icons/lazy/MazItalic'
import { MazLinkIcon } from '@maz-ui/icons/lazy/MazLinkIcon'
import { MazListBullet } from '@maz-ui/icons/lazy/MazListBullet'
import { MazPencil } from '@maz-ui/icons/lazy/MazPencil'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, ref, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import MazBtn from './MazBtn.vue'

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
  /** Replace the toolbar content (only rendered when `toolbar` is enabled) */
  'toolbar'?: (props: {
    mode: MazMarkdownEditorMode
    wrapSelection: typeof wrapSelection
    prefixLines: typeof prefixLines
    insertLink: typeof insertLink
  }) => unknown
  /** Content displayed in the preview tab when there is nothing to render */
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
const previewHtml = ref('')
const isRendering = ref(false)

const toolbarLabels = computed(() => {
  const tb = translations?.toolbar
  return {
    bold: tb?.bold ?? t('markdownEditor.toolbar.bold'),
    italic: tb?.italic ?? t('markdownEditor.toolbar.italic'),
    list: tb?.list ?? t('markdownEditor.toolbar.list'),
    link: tb?.link ?? t('markdownEditor.toolbar.link'),
    code: tb?.code ?? t('markdownEditor.toolbar.code'),
  }
})

const tr = computed(() => ({
  write: translations?.write ?? t('markdownEditor.write'),
  preview: translations?.preview ?? t('markdownEditor.preview'),
  emptyPreview: translations?.emptyPreview ?? t('markdownEditor.emptyPreview'),
  toolbar: toolbarLabels.value,
}))

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

function wrapSelection(before: string, after = before) {
  const el = textareaEl.value
  if (!el || disabled || readonly)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end)
  const next = value.slice(0, start) + before + selected + after + value.slice(end)

  updateValue(next)

  nextTick(() => {
    el.focus()
    const cursor = start + before.length
    el.setSelectionRange(cursor, cursor + selected.length)
  })
}

function prefixLines(prefix: string) {
  const el = textareaEl.value
  if (!el || disabled || readonly)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const block = value.slice(lineStart, end) || ''
  const prefixed = block
    .split('\n')
    .map(line => prefix + line)
    .join('\n')
  const next = value.slice(0, lineStart) + prefixed + value.slice(end)

  updateValue(next)

  nextTick(() => {
    el.focus()
    el.setSelectionRange(lineStart, lineStart + prefixed.length)
  })
}

function insertLink() {
  const el = textareaEl.value
  if (!el || disabled || readonly)
    return

  const value = modelValue ?? ''
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end) || tr.value.toolbar.link.toLowerCase()
  const snippet = `[${selected}](url)`
  const next = value.slice(0, start) + snippet + value.slice(end)

  updateValue(next)

  nextTick(() => {
    el.focus()
    const urlStart = start + selected.length + 3
    el.setSelectionRange(urlStart, urlStart + 3)
  })
}

const toolbarActions = computed(() => [
  { key: 'bold', icon: MazBold, label: tr.value.toolbar.bold, action: () => wrapSelection('**') },
  { key: 'italic', icon: MazItalic, label: tr.value.toolbar.italic, action: () => wrapSelection('_') },
  { key: 'list', icon: MazListBullet, label: tr.value.toolbar.list, action: () => prefixLines('- ') },
  { key: 'link', icon: MazLinkIcon, label: tr.value.toolbar.link, action: insertLink },
  { key: 'code', icon: MazCodeBracket, label: tr.value.toolbar.code, action: () => wrapSelection('`') },
] as const)

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

watch(
  [() => modelValue, mode],
  ([, currentMode]) => {
    if (currentMode === 'preview')
      renderPreview()
  },
  { immediate: true },
)

defineExpose({
  /** The underlying textarea element */
  textarea: textareaEl,
  /** The current editor mode (write / preview) */
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
      <slot name="label">{{ topLabel ?? label }}</slot>
      <sup v-if="required">*</sup>
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
        class="m-markdown-editor__header maz:flex maz:items-center maz:justify-between maz:gap-2 maz:border-b maz:border-divider maz:px-2 maz:py-1.5 maz:dark:border-divider-400"
      >
        <div
          class="m-markdown-editor__tabs maz:flex maz:gap-1"
          role="tablist"
          :aria-label="name"
        >
          <MazBtn
            :id="`${instanceId}-tab-write`"
            size="xs"
            :color="mode === 'write' ? color : 'transparent'"
            :outlined="mode === 'write'"
            :start-icon="MazPencil"
            role="tab"
            type="button"
            :aria-selected="mode === 'write'"
            :aria-controls="writePanelId"
            :disabled="disabled"
            @click="setMode('write')"
          >
            {{ tr.write }}
          </MazBtn>
          <MazBtn
            :id="`${instanceId}-tab-preview`"
            size="xs"
            :color="mode === 'preview' ? color : 'transparent'"
            :outlined="mode === 'preview'"
            :start-icon="MazEye"
            role="tab"
            type="button"
            :aria-selected="mode === 'preview'"
            :aria-controls="previewPanelId"
            :disabled="disabled"
            @click="setMode('preview')"
          >
            {{ tr.preview }}
          </MazBtn>
        </div>

        <div
          v-if="toolbar && mode === 'write'"
          class="m-markdown-editor__toolbar maz:flex maz:flex-wrap maz:items-center maz:gap-0.5"
        >
          <slot
            name="toolbar"
            :mode="mode"
            :wrap-selection="wrapSelection"
            :prefix-lines="prefixLines"
            :insert-link="insertLink"
          >
            <MazBtn
              v-for="item in toolbarActions"
              :key="item.key"
              size="xs"
              color="transparent"
              type="button"
              :icon="item.icon"
              :aria-label="item.label"
              :title="item.label"
              :disabled="disabled || readonly"
              @click="item.action"
            />
          </slot>
        </div>
      </div>

      <div class="m-markdown-editor__content maz:relative">
        <textarea
          v-show="mode === 'write'"
          :id="instanceId"
          ref="textareaEl"
          v-bind="$attrs"
          v-model="inputValue"
          class="m-markdown-editor__textarea maz:w-full maz:resize-y maz:bg-transparent maz:px-4 maz:py-3 maz:font-mono maz:text-sm maz:outline-hidden"
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
        />

        <div
          v-show="mode === 'preview'"
          :id="previewPanelId"
          class="m-markdown-editor__preview maz:px-4 maz:py-3 maz:text-sm"
          role="tabpanel"
          :aria-labelledby="`${instanceId}-tab-preview`"
          :style="{ minHeight: `${rows * 1.5}rem` }"
        >
          <div v-if="previewHtml" class="m-markdown-editor__preview-content" v-html="previewHtml" />
          <p v-else-if="!isRendering" class="m-markdown-editor__preview-empty maz:text-muted maz:italic">
            <slot name="empty-preview">
              {{ tr.emptyPreview }}
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
