<template>
  <div class="component-container maz-position-relative maz-bg-white maz-my-4 maz-border-radius maz-elevation">
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
    color: var(--maz-text-color);
    min-width: 200px;
    background-color: var(--maz-bg-color);
    // border: var(--maz-border-width) solid var(--maz-border-color);

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
</style>
