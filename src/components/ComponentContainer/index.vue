<template>
  <div
    class="component-container pos-r br-4 bg-white my-4 shadow-container"
    :class="{
      'is-dark': dark
    }"
  >
    <div class="p-4">
      <slot />
    </div>
    <div
      v-if="code"
      class="component-container__footer"
    >
      <MazCollapse
        class="component-container__footer__collapse"
        :dark="dark"
      >
        <div
          slot="header-text"
          class="fs-12"
        >
          Show code
        </div>
        <div class="p-4">
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
      dark: { type: Boolean, default: false },
      code: { type: String, default: null },
      language: { type: String, default: 'html' }
    },
    data () {
      return {
        showCode: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    color: var(--maz-text-color);
    min-width: 320px;

    &__footer {
      border-top: 1px solid var(--maz-text-color-dark);
      overflow: hidden;

      &__collapse {
        border: none;
      }
    }

    &.is-dark {
      color: var(--maz-text-color-dark);
      background-color: var(--maz-bg-color-dark);

      .component-container__footer {
        border-color: var(--maz-third-color-dark);

        &__collapse {
          border: none;
        }
      }
    }
  }
</style>
