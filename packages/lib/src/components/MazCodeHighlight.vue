<script lang="ts" setup>
import type { VNode } from 'vue'
import { computed, onMounted, onUnmounted, ref, useSlots, watch } from 'vue'

export interface MazCodeHighlightProps {
  /** Source code to highlight */
  code?: string
  /** Language identifier for syntax highlighting (e.g. 'vue', 'ts', 'bash') */
  language?: string
  /** Override the shiki theme name. Defaults to github-light/github-dark based on current color mode */
  theme?: string
}

const {
  code,
  language = 'text',
  theme,
} = defineProps<MazCodeHighlightProps>()

const slots = useSlots()
const highlightedHtml = ref('')
const isDark = ref(false)

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
  return isDark.value ? 'github-dark' : 'github-light'
})

async function highlight() {
  const src = resolvedCode.value
  if (!src) {
    highlightedHtml.value = ''
    return
  }
  try {
    const { codeToHtml } = await import('shiki')
    highlightedHtml.value = await codeToHtml(src, {
      lang: language,
      theme: resolvedTheme.value,
    })
  }
  catch {
    highlightedHtml.value = `<pre><code>${src}</code></pre>`
  }
}

let observer: MutationObserver | undefined

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')

  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  highlight()
})

onUnmounted(() => {
  observer?.disconnect()
})

watch([resolvedCode, resolvedTheme], highlight)
</script>

<template>
  <div class="m-code-highlight m-reset-css" v-html="highlightedHtml" />
</template>

<style scoped>
.m-code-highlight {
  :deep(pre.shiki) {
    @apply maz-rounded maz-overflow-x-auto maz-p-4 maz-text-sm;

    font-family: 'Fira Code', 'Fira Mono', 'Cascadia Code', Menlo, Monaco, Consolas, monospace;
    line-height: 1.6;
  }

  :deep(code) {
    font-family: inherit;
  }
}
</style>
