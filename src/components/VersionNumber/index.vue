<template>
  <a
    target="_blank"
    class="version-number"
    href="https://www.npmjs.com/package/vue-mazel-ui"
  >
    {{ versionNumber }}
  </a>
</template>

<script>
  import { version } from '../../lib'

  export default {
    name: 'VersionNumber',
    computed: {
      versionNumber () {
        return version
      }
    }
  }
</script>
