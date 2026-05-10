<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed, defineAsyncComponent, useSlots } from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent'

export type MazWindowMockupVariant = 'browser' | 'terminal' | 'editor'

export interface MazWindowMockupProps {
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
   * Whether to show the terminal prompt prefix (terminal variant only)
   * @default true
   */
  showPrompt?: boolean
}

const {
  variant = 'browser',
  url = 'localhost',
  filename = 'index.vue',
  title = 'zsh',
  minHeight,
  code,
  language,
  showPrompt = true,
} = defineProps<MazWindowMockupProps>()

const MazCodeHighlight = defineAsyncComponent(() => import('./MazCodeHighlight.vue'))

const slots = useSlots()

const contentStyle = computed<CSSProperties>(() => ({
  ...(minHeight && { minHeight }),
}))

const hasPrompt = computed(() => variant === 'terminal' && showPrompt)
const hasCode = computed(() => !!code)
const hasSlot = computed(() => hasSlotContent(slots.default))
</script>

<template>
  <div
    class="m-window-mockup m-reset-css"
    :class="`--${variant}`"
  >
    <!-- Title bar -->
    <div class="m-window-mockup__titlebar">
      <div class="m-window-mockup__lights" aria-hidden="true">
        <span class="m-window-mockup__light --red" />
        <span class="m-window-mockup__light --orange" />
        <span class="m-window-mockup__light --green" />
      </div>

      <!-- Browser: address bar -->
      <div v-if="variant === 'browser'" class="m-window-mockup__url-bar">
        {{ url }}
      </div>

      <!-- Editor: filename tab -->
      <div v-else-if="variant === 'editor'" class="m-window-mockup__tab">
        {{ filename }}
      </div>

      <!-- Terminal: title -->
      <div v-else-if="variant === 'terminal'" class="m-window-mockup__title-label">
        {{ title }}
      </div>
    </div>

    <!-- Content area -->
    <div class="m-window-mockup__content" :style="contentStyle">
      <!--
        @slot prompt - Replace the terminal prompt prefix (terminal variant only)
      -->
      <div v-if="hasPrompt" class="m-window-mockup__prompt">
        <slot name="prompt">
          <span>$</span>
        </slot>
      </div>

      <MazCodeHighlight v-if="hasCode" :code="code" :language="language" class="maz-w-full" />

      <!--
        @slot default - Free content (image, interface, etc.) shown when code prop is not set
      -->
      <slot v-else-if="hasSlot" />
    </div>
  </div>
</template>

<style scoped>
.m-window-mockup {
  @apply maz-relative maz-inline-flex maz-flex-col maz-overflow-hidden maz-rounded-lg maz-border maz-border-solid maz-border-divider maz-bg-surface maz-w-full;

  &__titlebar {
    @apply maz-flex maz-items-center maz-gap-3 maz-bg-surface-600 maz-px-4 maz-py-3;

    border-bottom: 1px solid hsl(var(--maz-border));
  }

  &__lights {
    @apply maz-flex maz-shrink-0 maz-items-center maz-gap-1.5;
  }

  &__light {
    @apply maz-block maz-size-3 maz-rounded-full;

    &.--red {
      background-color: #ff5f57;
    }

    &.--orange {
      background-color: #febc2e;
    }

    &.--green {
      background-color: #28c840;
    }
  }

  &__url-bar {
    @apply maz-flex-1 maz-truncate maz-rounded maz-bg-surface maz-px-3 maz-py-1 maz-text-center maz-text-sm maz-text-muted;

    border: 1px solid hsl(var(--maz-border));
    max-width: 60%;
    margin: 0 auto;
  }

  &__tab {
    @apply maz-rounded-t maz-bg-surface maz-px-4 maz-py-1 maz-text-sm maz-text-foreground;

    border: 1px solid hsl(var(--maz-border));
    border-bottom: none;
  }

  &__title-label {
    @apply maz-flex-1 maz-text-center maz-text-sm maz-text-muted;
  }

  &__content {
    @apply maz-flex maz-min-h-0 maz-flex-1 maz-flex-col maz-overflow-auto;
  }

  &__prompt {
    @apply maz-shrink-0 maz-px-4 maz-pt-3 maz-font-mono maz-text-sm maz-text-foreground;
  }

  &.--terminal {
    .m-window-mockup__titlebar {
      @apply maz-justify-center;
    }

    .m-window-mockup__lights {
      @apply maz-absolute maz-left-4;
    }
  }
}
</style>
