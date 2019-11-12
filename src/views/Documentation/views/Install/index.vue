<template>
  <div class="install">
    <h2 class="mb-4">
      Install
    </h2>
    <h3>NPM</h3>
    <CodeContainer>npm i vue-mazel-ui -S</CodeContainer>

    <h3>Yarn</h3>
    <CodeContainer>yarn add vue-mazel-ui</CodeContainer>

    <h3>CDN</h3>
    <CodeContainer>
      {{ cdnCode.trim() }}
    </CodeContainer>
  </div>
</template>

<script>
  export default {
    name: 'Install',
    data () {
      return {
        cdnCode: `
      <!-- import du CSS -->
      <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
      <!-- import du JavaScript -->
      <script src="https://unpkg.com/element-ui/lib/index.js"><script>
      `
      }
    }
  }
</script>
