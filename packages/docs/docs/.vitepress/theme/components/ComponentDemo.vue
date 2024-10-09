<template>
  <MazCard class="component-demo" :elevation="false" bordered block no-padding footer-align="left">
    <template v-if="$slots.title || title" #header>
      <h3 class="vp-raw maz-font-semibold maz-text-lg">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
    </template>
    <template #content>
      <div class="maz-p-4">
        <div class="vp-raw">
          <slot></slot>

        </div>
        <slot name="content"></slot>
      </div>
    </template>


    <template #footer v-if="$slots.code">
      <button v-show="!expanded" @click="showCode = !showCode" class="vp-raw maz-bg-color hover:maz-bg-color-light maz-py-3 maz-px-3 maz-w-full maz-flex maz-items-center maz-justify-between maz-transition-all maz-duration-300">
        <span class="maz-text-sm maz-flex maz-gap-2 maz-items-center maz-text-primary">
          <CodeIcon />
          View code
        </span>

        <ChevronIcon :class="{ '-maz-rotate-180': !showCode }" class="maz-transition-all maz-duration-300" />
      </button>

      <MazTransitionExpand>
        <div v-show="showCode || expanded">
          <div class="maz-p-4 maz-flex maz-flex-col maz-gap-4 maz-text-sm">
            <slot name="code"></slot>

          </div>
        </div>
      </MazTransitionExpand>
    </template>

  </MazCard>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import ChevronIcon from 'maz-ui/icons/chevron-up.svg'
  import CodeIcon from 'maz-ui/icons/code-bracket.svg'

  const props = withDefaults(defineProps<{
    title?: string
    expanded?: boolean
  }>(), {
    title: undefined
  })

  const showCode = ref(props.expanded)
</script>

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

    :deep(div[class*="language"]) {
      @apply maz-rounded-none mob-l:maz-rounded !-maz-mx-4 mob-l:!maz-mx-0 maz-my-0;

      code {
        @apply maz-px-4;
      }
    }
  }
</style>