<script lang="ts" setup>
import { MazChevronUp, MazCodeBracket } from '@maz-ui/icons/src/index.js'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  expanded?: boolean
}>(), {
  title: undefined,
  expanded: false,
})

const showCode = ref(props.expanded)
</script>

<template>
  <MazCard class="component-demo" block footer-align="left">
    <template v-if="$slots.title || title" #title>
      <h3 class="vp-raw maz-text-lg maz-font-semibold">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
    </template>
    <template #default>
      <div class="content">
        <div class="vp-raw">
          <slot />
        </div>
        <slot name="content" />
      </div>
    </template>

    <template v-if="$slots.code" #footer>
      <button class="vp-raw maz-bg-color maz-flex maz-w-full maz-items-center maz-justify-between maz-p-3 maz-transition-all maz-duration-300 hover:maz-bg-surface-400" @click="showCode = !showCode">
        <span class="maz-flex maz-items-center maz-gap-2 maz-text-sm maz-text-primary">
          <MazCodeBracket />
          View code
        </span>

        <MazChevronUp :class="{ '-maz-rotate-180': !showCode }" class="maz-transition-all maz-duration-300" />
      </button>

      <MazExpandAnimation v-model="showCode">
        <div class="code-wrapper maz-flex maz-flex-col maz-gap-4 maz-text-sm">
          <slot name="code" />
        </div>
      </MazExpandAnimation>
    </template>
  </MazCard>
</template>

<style lang="postcss" scoped>
  .component-demo {
  :deep(.m-card__footer) {
    @apply maz-p-0 maz-rounded-b;
  }

  :deep(a):not(.m-link) {
    @apply maz-text-primary maz-underline;
  }

  :deep(.custom-block) {
    @apply maz-my-0;
  }

  .content {
    &:deep(div[class*='language']) {
      @apply mob-l:maz-rounded;
    }
  }

  :deep(div[class*='language']) {
    @apply maz-rounded-none !-maz-mx-4 mob-l:!maz-mx-0 maz-my-0;

    code {
      @apply maz-px-4;
    }
  }
}
</style>
