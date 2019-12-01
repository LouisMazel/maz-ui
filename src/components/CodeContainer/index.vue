<template>
  <pre
    v-highlightjs="code"
    class="code-container"
    :class="{
      'is-dark': dark || hasDarkTheme
    }"
  >
    <code
      class="code-container__content"
      :class="[language]"
    >
      <slot />
    </code>
  </pre>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'CodeContainer',
    props: {
      code: { type: String, required: true },
      language: { type: String, default: 'javascript' },
      dark: { type: Boolean, default: false }
    },
    computed: {
      ...mapGetters(['hasDarkTheme'])
    }
  }
</script>

<style lang="scss" scoped>
  .code-container {
    display: block;
    font-family: monospace;
    white-space: pre;
    font-size: 12px;
    background-color: #FAFAFA;
    border: 1px solid #EAEEFB;
    border-radius: var(--maz-border-radius);
    -webkit-font-smoothing: auto;
    overflow-x: auto;
    padding: 0 20px;

    &__content {
      background-color: transparent;
    }

    &.is-dark {
      background-color: var(--maz-hover-color-dark);
      border: 1px solid #535673;

      .hljs,
      .hljs-subst {
        color: var(--maz-text-color-dark);
      }
    }
  }
</style>
