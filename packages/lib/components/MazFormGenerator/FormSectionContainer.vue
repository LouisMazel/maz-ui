<script setup lang="ts">
import MazIcon from '../MazIcon.vue'
import type { Icon } from './types'

defineProps<{
  title?: string
  icon?: string | Icon
}>()
</script>

<template>
  <div class="form-section-container">
    <div class="form-section-container__wrapper">
      <div v-if="title" class="form-section-container__header">
        <slot name="title">
          <div class="form-section-container__title">
            <MazIcon v-if="typeof icon === 'string'" :src="icon" class="form-section-container__icon" />
            <Component :is="icon" v-else-if="icon" class="form-section-container__icon" />

            <h3>
              {{ title }}
            </h3>
          </div>
        </slot>
      </div>

      <div class="form-section-container__content">
        <slot />
      </div>

      <div v-if="$slots.footer" class="form-section-container__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.form-section-container {
  @apply maz-p-4 maz-border maz-border-color-light maz-rounded;

  &__wrapper {
    @apply maz-flex maz-flex-col maz-gap-4;
  }

  &__title {
    @apply maz-gap-2 maz-flex maz-items-center;

    h3 {
      @apply maz-truncate;
    }
  }

  &__icon {
    @apply maz-text-2xl;
  }

  &__content {
    @apply maz-flex maz-flex-col maz-gap-4 maz-max-w-full maz-flex-none;
  }

  &__footer {
    @apply maz-text-end;
  }
}
</style>
