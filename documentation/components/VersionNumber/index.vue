<template>
  <a
    target="_blank"
    class="version-number"
    href="https://www.npmjs.com/package/maz-ui"
  >
    {{ versionNumber }}
  </a>
</template>

<script>
import { version } from '../../../package.json'

export default {
  name: 'VersionNumber',
  computed: {
    versionNumber () {
      return version
    }
  }
}
</script>
