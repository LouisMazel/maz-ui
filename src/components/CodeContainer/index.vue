<template>
  <pre
    v-highlightjs="code"
    class="code-container"
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
  export default {
    name: 'CodeContainer',
    props: {
      code: { type: String, required: true },
      language: { type: String, default: 'javascript' },
      dark: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .code-container {
    display: block;
    font-family: monospace;
    white-space: pre;
    font-size: 0.857em;
    background-color: #FAFAFA;
    border: 1px solid #EAEEFB;
    border-radius: $border-radius;
    -webkit-font-smoothing: auto;
    overflow-x: auto;
    padding: 0 20px;

    &__content {
      background-color: transparent;
    }
  }

  .is-dark .code-container {
    background-color: $hover-color-dark;
    border: 1px solid #535673;

    .hljs,
    .hljs-subst {
      color: $text-color-dark;
    }
  }
</style>
