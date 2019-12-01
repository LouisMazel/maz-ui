<template>
  <div class="install">
    <h2 class="mb-4">
      Install
    </h2>
    <h3>NPM</h3>
    <CodeContainer
      code="npm i vue-mazel-ui -S"
      language="bash"
      class="my-4"
    />

    <h3>Yarn</h3>
    <CodeContainer
      code="yarn add vue-mazel-ui"
      language="bash"
      class="my-4"
    />

    <h3>CDN</h3>
    <CodeContainer
      :code="cdnCode"
      language="html"
      class="my-4"
    />
  </div>
</template>

<script>
  export default {
    name: 'Install',
    data () {
      return {
        cdnCode: `<!-- import du CSS -->
<link rel="stylesheet" href="https://unpkg.com/vue-mazel-ui/dist/vue-mazel-ui.css">
<!-- import du JavaScript -->
<script src="https://unpkg.com/vue-mazel-ui/dist/vue-mazel-ui.common.js"><script>`
      }
    }
  }
</script>
