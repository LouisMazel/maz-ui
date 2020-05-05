<template>
  <div class="install">
    <h2 class="maz-mb-4">
      Install
    </h2>
    <h3>NPM</h3>
    <CodeContainer
      code="npm i maz-ui -S"
      language="bash"
      class="maz-my-4" />

    <h3>Yarn</h3>
    <CodeContainer
      code="yarn add maz-ui"
      language="bash"
      class="maz-my-4" />

    <h3>CDN</h3>
    <CodeContainer
      :code="cdnCode"
      language="html"
      class="maz-my-4" />
  </div>
</template>

<script>
export default {
  name: 'Install',
  data () {
    return {
      cdnCode: `<!-- import du CSS -->
<link rel="stylesheet" href="https://unpkg.com/maz-ui/lib/maz-ui.css">
<!-- import du JavaScript -->
<script src="https://unpkg.com/maz-ui/lib/maz-ui.common.js"><script>`
    }
  }
}
</script>
