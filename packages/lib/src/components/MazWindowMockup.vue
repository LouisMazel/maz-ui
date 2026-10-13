<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazLinkIcon } from '@maz-ui/icons/lazy/MazLinkIcon'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, onUnmounted, ref } from 'vue'
import { vTooltip } from '../directives/vTooltip'

export type MazWindowMockupVariant = 'browser' | 'terminal' | 'editor'

export interface MazWindowMockupProps {
  /**
   * Stable id used to scope the empty-state SVG pattern. Auto-generated if not provided.
   */
  id?: string
  /**
   * Window style variant
   * @values 'browser' | 'terminal' | 'editor'
   * @default 'browser'
   */
  variant?: MazWindowMockupVariant
  /**
   * URL to display in the browser address bar (browser variant only)
   * @default 'localhost'
   */
  url?: string
  /**
   * Filename to display in the editor tab (editor variant only)
   * @default 'index.vue'
   */
  filename?: string
  /**
   * Title to display in the terminal title bar (terminal variant only)
   * @default 'zsh'
   */
  title?: string
  /**
   * Minimum height of the content area as a CSS value (e.g. '200px')
   */
  minHeight?: string
  /**
   * Source code to display using MazCodeHighlight. Takes priority over the default slot.
   */
  code?: string
  /**
   * Language identifier for syntax highlighting (e.g. 'vue', 'ts', 'bash')
   */
  language?: string
  /**
   * Label displayed inside the empty-state placeholder when no code and no slot content are provided.
   */
  label?: string
  /**
   * Whether to hide the terminal prompt prefix (no-op on non-terminal variants)
   * @default false
   */
  hidePrompt?: boolean
  /**
   * Prefix to display before the code in the terminal (terminal variant only)
   * @default '$'
   */
  prompt?: string
  /**
   * Hide the copy-to-clipboard button next to the URL bar (browser variant only).
   * @default false
   */
  hideUrlCopy?: boolean
  /**
   * Custom translations for the component. Override either key independently.
   * @type {Partial<MazUiTranslationsNestedSchema['windowMockup']>}
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['windowMockup']>
}

const {
  variant = 'browser',
  url = 'localhost',
  filename = 'index.vue',
  title = 'zsh',
  minHeight,
  code,
  language,
  label,
  hidePrompt = false,
  prompt = '$',
  hideUrlCopy = false,
  translations,
} = defineProps<MazWindowMockupProps>()

const { t } = useTranslations()

const copyUrlLabel = computed(() => translations?.copyUrlToClipboard ?? t('windowMockup.copyUrlToClipboard'))
const urlCopiedLabel = computed(() => translations?.urlCopiedToClipboard ?? t('windowMockup.urlCopiedToClipboard'))

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const MazCodeHighlight = defineAsyncComponent(() => import('./MazCodeHighlight.vue'))

const hasPrompt = computed(() => variant === 'terminal' && !hidePrompt)

const codeWithPrompt = computed(() => {
  if (hasPrompt.value && code) {
    return `${prompt} ${code}`
  }

  return code
})

const urlCopied = ref(false)
let urlCopyResetTimer: ReturnType<typeof setTimeout> | undefined

async function copyUrl() {
  if (!url || typeof navigator === 'undefined' || !navigator.clipboard)
    return
  try {
    await navigator.clipboard.writeText(url)
    urlCopied.value = true
    clearTimeout(urlCopyResetTimer)
    urlCopyResetTimer = setTimeout(() => {
      urlCopied.value = false
    }, 1500)
  }
  catch {}
}

onUnmounted(() => {
  clearTimeout(urlCopyResetTimer)
})
</script>

<template>
  <div
    class="m-window-mockup m-reset-css maz:relative maz:inline-flex maz:w-full maz:flex-col maz:overflow-hidden maz:rounded-md maz:border maz:bg-surface"
    :class="`--${variant}`"
  >
    <!-- Title bar -->
    <div class="m-window-mockup__titlebar border-b maz:flex maz:items-center maz:gap-3 maz:bg-surface-600 maz:px-4 maz:py-3" :class="{ 'maz:justify-center': variant === 'terminal' }">
      <div class="m-window-mockup__lights maz:flex maz:shrink-0 maz:items-center maz:gap-1.5" aria-hidden="true" :class="{ 'maz:absolute maz:left-4': variant === 'terminal' }">
        <span class="m-window-mockup__light maz:block maz:size-3 maz:rounded-full maz:bg-[#FF5F57]" />
        <span class="m-window-mockup__light maz:block maz:size-3 maz:rounded-full maz:bg-[#febc2e]" />
        <span class="m-window-mockup__light maz:block maz:size-3 maz:rounded-full maz:bg-[#28C840]" />
      </div>

      <!-- Browser: address bar + url copy button -->
      <div v-if="variant === 'browser'" class="m-window-mockup__url-group maz:mx-auto maz:flex maz:max-w-[60%] maz:flex-1 maz:items-center maz:gap-2">
        <div class="m-window-mockup__url-bar maz:flex-1 maz:truncate maz:rounded-md maz:border-b maz:bg-surface maz:px-3 maz:py-1 maz:text-center maz:text-sm maz:text-muted">
          {{ url }}
        </div>
        <MazBtn
          v-if="!hideUrlCopy"
          v-tooltip="{
            text: urlCopied ? urlCopiedLabel : copyUrlLabel,
            color: 'surface',
          }"
          size="xs"
          color="transparent"
          outlined
          class="m-window-mockup__url-copy-btn"
          :aria-label="urlCopied ? urlCopiedLabel : copyUrlLabel"
          :icon="urlCopied ? MazCheck : MazLinkIcon"
          @click="copyUrl"
        />
      </div>

      <!-- Editor: filename tab -->
      <div v-else-if="variant === 'editor'" class="m-window-mockup__tab maz:-mb-3 maz:self-end maz:rounded-t-md maz:border-x maz:border-t maz:bg-surface maz:px-4 maz:py-1 maz:text-sm maz:text-foreground">
        {{ filename }}
      </div>

      <!-- Terminal: title -->
      <div v-else-if="variant === 'terminal'" class="m-window-mockup__title-label maz:flex-1 maz:text-center maz:text-sm maz:text-muted">
        {{ title }}
      </div>
    </div>

    <!-- Content area -->
    <div
      class="m-window-mockup__content maz:flex maz:min-h-0 maz:flex-1 maz:flex-col maz:overflow-auto"
      :style="minHeight ? { minHeight } : undefined"
    >
      <!--
        @slot prompt - Replace the terminal prompt prefix (terminal variant only)
      -->
      <MazCodeHighlight v-if="code !== undefined" :code="codeWithPrompt" :copy-value="code" :language :rounded="false" class="maz:w-full" />

      <!--
        @slot default - Free content (image, interface, etc.) shown when code prop is not set.
        Falls back to a grid placeholder when neither code nor slot content are provided.
      -->
      <slot v-else>
        <div class="m-window-mockup__placeholder maz:relative maz:flex maz:flex-1 maz:flex-center maz:overflow-hidden maz:p-4">
          <span
            v-if="label"
            class="m-window-mockup__placeholder-label maz:font-mono maz:text-sm maz:text-muted"
          >
            {{ label }}
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>
