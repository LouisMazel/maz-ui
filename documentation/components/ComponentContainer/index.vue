<template>
  <div class="component-container maz-position-relative maz-bg-white maz-my-4 maz-elevation maz-border-radius">
    <div class="maz-p-4 maz-bg-color maz-border-radius maz-w-100">
      <slot />
    </div>
    <div
      v-if="code"
      class="component-container__footer maz-border-top maz-border-color maz-border-top-solid"
    >
      <MazCollapse class="component-container__footer__collapse">
        <div slot="header-text">
          Show code
        </div>
        <div class="maz-px-4">
          <CodeContainer
            :language="language"
            :code="code"
          />
        </div>
      </MazCollapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentContainer',
  props: {
    code: { type: String, default: null },
    language: { type: String, default: 'html' }
  }
}
</script>

<style lang="scss" scoped>
  .component-container {
    color: $text-color;
    min-width: 200px;
    border: var(--border-width) solid transparent;

    &__footer {
      overflow: hidden;

      &__collapse {
        border: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;

        &.open {
          border-radius: 0;
        }
      }
    }
  }

  .maz-is-dark .component-container,
  .maz-is-dark.component-container {
    color: $text-color-dark;
    background-color: $bg-color-dark;
    border: var(--border-width) solid $hover-bg-color-dark;

    .component-container__footer {
      border-color: $hover-bg-color-dark;

      &__collapse {
        border: none;
      }
    }
  }
</style>
