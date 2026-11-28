<script lang="ts">
import type { MarkedOptions } from 'marked'
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types.ts'

export type MazMarkdownColor = 'inherit' | 'foreground' | 'muted' | Exclude<MazColor, 'contrast' | 'transparent'>

export interface MazMarkdownProps {
  /** Style attribute of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribute of the component root element */
  class?: HTMLAttributes['class']
  /** The markdown to render */
  content?: string
  /**
   * Size of the text, the titles and the code blocks (`mini` renders as `xs` and `xl` as `lg`).
   * Can be set for the whole app with `defaults.MazMarkdown.size` or `defaults.global.size` of the MazUi plugin.
   * @default 'md'
   */
  size?: MazSize
  /**
   * Color of the text (titles, paragraphs, lists); links keep the primary color. `inherit` takes the color of the parent
   * (a dark block, a colored banner).
   * @default 'foreground'
   */
  color?: MazMarkdownColor
  /**
   * Render a single line of inline markdown (bold, italic, code, links) in a `span`, without paragraphs, titles or
   * lists.
   * @default false
   */
  inline?: boolean
  /**
   * Sanitize the rendered HTML with DOMPurify. With SSR, the sanitized content is rendered on the client; disable it
   * for a trusted content to render it on the server.
   * @default true
   */
  sanitize?: boolean
  /**
   * Render the fenced code blocks with MazCodeHighlight (syntax highlighting and copy button, needs `shiki`). Ignored
   * with `renderFunction` and `inline`. The blocks nested in a list or a quote stay a plain `pre`.
   * @default true
   */
  highlight?: boolean
  /**
   * Open the absolute links (`http://`, `https://`, `//`) in a new tab with `rel="noopener noreferrer"`.
   * @default true
   */
  externalLinks?: boolean
  /**
   * Let the browser follow the internal links (relative and `#anchor` links). Set it to `false` in a desktop app (Tauri,
   * Electron) so that they are never followed inside the WebView: the navigation is prevented and `link-click` is still
   * emitted for the app to route itself.
   * Can be set for the whole app with `defaults.MazMarkdown.followInternalLinks` of the MazUi plugin.
   * @default true
   */
  followInternalLinks?: boolean
  /**
   * Add an `id` to the titles (slug of their text, `-1`, `-2`... for duplicates) so that `#anchor` links reach them.
   * @default false
   */
  headingAnchors?: boolean
  /**
   * Custom renderer: receives the markdown and returns HTML (sync or async). Falls back to `marked` when omitted. The
   * result is still sanitized when `sanitize` is enabled.
   */
  renderFunction?: (markdown: string) => string | Promise<string>
  /**
   * Options forwarded to `marked` when using the default renderer (`gfm` and `breaks` are enabled by default)
   * @type {import('marked').MarkedOptions}
   */
  markedOptions?: MarkedOptions | Record<string, unknown>
}

export interface MazMarkdownExposed {
  /** Render the markdown again */
  render: () => void | Promise<void>
}
</script>

<script lang="ts" setup>
import type { MazMarkdownPart } from './MazMarkdown/render.ts'
import { computed, defineAsyncComponent, onMounted, onServerPrefetch, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useExternalLinks } from '../utils/externalLinks.ts'
import { renderMarkdown } from './MazMarkdown/render.ts'

const {
  content,
  inline = false,
  renderFunction,
  markedOptions,
  headingAnchors = false,
} = defineProps<MazMarkdownProps>()

const emits = defineEmits<{
  /**
   * Emitted when a link of the content is clicked, before the browser follows it: call `event.preventDefault()` to handle
   * it yourself (an in-app router, the system browser of a desktop app).
   * @property {MouseEvent} event - The click event
   * @property {string} href - The `href` of the link
   */
  'link-click': [event: MouseEvent, href: string]
}>()

defineSlots<{
  /** Content displayed when there is no markdown to render */
  empty?: () => unknown
}>()

const { size, color, sanitize, highlight, externalLinks, followInternalLinks } = useGlobalConfig<{
  size: MazSize
  color: MazMarkdownColor
  sanitize: boolean
  highlight: boolean
  externalLinks: boolean
  followInternalLinks: boolean
}>('MazMarkdown', {
  size: 'md',
  color: 'foreground',
  sanitize: true,
  highlight: true,
  externalLinks: true,
  followInternalLinks: true,
})

const MazCodeHighlight = defineAsyncComponent(() => import('./MazCodeHighlight.vue'))

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const parts = shallowRef<MazMarkdownPart[]>([])
const isMounted = ref(false)

const SIZE_CLASSES: Record<MazSize, string> = {
  mini: 'maz:rich-text-xs',
  xs: 'maz:rich-text-xs',
  sm: 'maz:rich-text-sm',
  md: '',
  lg: 'maz:rich-text-lg',
  xl: 'maz:rich-text-lg',
}

const INLINE_SIZE_CLASSES: Record<MazSize, string> = {
  mini: 'maz:text-xs!',
  xs: 'maz:text-xs!',
  sm: 'maz:text-sm!',
  md: '',
  lg: 'maz:text-lg!',
  xl: 'maz:text-lg!',
}

const COLOR_CLASSES: Record<MazMarkdownColor, string> = {
  inherit: 'maz:text-inherit! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-inherit!',
  foreground: 'maz:text-foreground! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-foreground!',
  muted: 'maz:text-muted! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-muted!',
  primary: 'maz:text-primary! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-primary!',
  secondary: 'maz:text-secondary! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-secondary!',
  accent: 'maz:text-accent! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-accent!',
  info: 'maz:text-info! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-info!',
  success: 'maz:text-success! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-success!',
  warning: 'maz:text-warning! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-warning!',
  destructive: 'maz:text-destructive! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-destructive!',
  neutral: 'maz:text-neutral-foreground! maz:[&_:where(h1,h2,h3,h4,h5,h6)]:text-neutral-foreground!',
}

const rootClasses = computed(() => [
  color.value in COLOR_CLASSES ? COLOR_CLASSES[color.value] : COLOR_CLASSES.foreground,
  inline
    ? ['--inline maz:rich-text', INLINE_SIZE_CLASSES[size.value]]
    : ['maz:rich-text maz:[--maz-rich-text-max-width:none]', SIZE_CLASSES[size.value]],
])

let renderSequence = 0
let pendingRender: Promise<void> | undefined

function render(): void | Promise<void> {
  const sequence = ++renderSequence
  const source = content ?? ''

  if (!source.trim()) {
    parts.value = []
    return
  }

  if (sanitize.value && !isMounted.value)
    return

  const result = renderMarkdown(source, {
    sanitize: sanitize.value,
    highlight: highlight.value,
    inline,
    headingAnchors,
    externalLinks: externalLinks.value,
    renderFunction,
    markedOptions,
  })

  if (Array.isArray(result)) {
    parts.value = result
    return
  }

  pendingRender = result.then((value) => {
    if (sequence === renderSequence)
      parts.value = value
  })
  return pendingRender
}

const ABSOLUTE_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

const { onLinkClick: openExternalLink } = useExternalLinks()

function onLinkClick(event: MouseEvent) {
  const link = event.target instanceof Element ? event.target.closest('a') : null
  const href = link?.getAttribute('href')

  if (link && href && rootRef.value?.contains(link)) {
    emits('link-click', event, href)
    const target = link.getAttribute('target') ?? undefined
    openExternalLink(event, href, target)

    if (!followInternalLinks.value && !event.defaultPrevented && target !== '_blank' && !ABSOLUTE_LINK_REGEX.test(href))
      event.preventDefault()
  }
}

watch(
  [() => content, () => renderFunction, () => markedOptions, () => inline, () => headingAnchors, sanitize, highlight, externalLinks, isMounted],
  render,
  { immediate: true },
)

onServerPrefetch(() => pendingRender)

onMounted(() => {
  isMounted.value = true
})

defineExpose<MazMarkdownExposed>({ render })
</script>

<template>
  <!-- The delegated click only serves the links, which are keyboard accessible themselves -->
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -->
  <component
    :is="inline ? 'span' : 'div'"
    v-if="parts.length > 0"
    ref="rootRef"
    class="m-markdown"
    :class="[rootClasses, $props.class]"
    :style="$props.style"
    @click="onLinkClick"
  >
    <template v-for="(part, index) in parts" :key="index">
      <MazCodeHighlight
        v-if="part.kind === 'code'"
        class="m-markdown__code maz:mb-[1.25em] maz:last:mb-0"
        :code="part.code"
        :language="part.language"
        :hide-language="!part.language"
        :size="size"
        wrap
      />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-else-if="inline" class="m-markdown__inline" v-html="part.html" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-else class="m-markdown__html maz:not-last:mb-[1.25em] maz:*:first:mt-0 maz:*:last:mb-0" v-html="part.html" />
    </template>
  </component>
  <!--
    @slot empty - Content displayed when there is no markdown to render
  -->
  <slot v-else name="empty" />
</template>

<style scoped>
.m-markdown.--inline {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  max-inline-size: none;
}
</style>
