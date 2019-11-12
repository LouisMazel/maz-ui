<template>
  <pre class="code-container fs-14">
    <code class="code-container__content">
      <slot />
    </code>
  </pre>
</template>

<script>
  export default {
    name: 'CodeContainer'
  }
</script>

<style lang="scss" scoped>
  .code-container {
    display: block;
    font-family: monospace;
    white-space: pre;

    &__content {
      font-size: 12px;
      background-color: #FAFAFA;
      border: 1px solid #EAEEFB;
      border-radius: var(--maz-border-radius);
      -webkit-font-smoothing: auto;
      display: block;
      overflow-x: auto;
    }
  }
</style>
