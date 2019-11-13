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
      language: { type: String, default: 'javascript' }
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
    margin: 20px 0;

    &__content {
      background-color: transparent;
    }
  }
</style>
