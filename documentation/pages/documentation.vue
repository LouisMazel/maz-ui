<template>
  <NuxtChild />
</template>

<script>
import { replaceAll, capitalizeAll } from '~/utils'
import meta from '~/config/meta'

export default {
  name: 'Documentation',
  layout: 'documentation',
  head () {
    const pageTitle = capitalizeAll(replaceAll(this.$route.name.substring(14), '-', ' '))
    return {
      title: `${pageTitle}`,
      titleTemplate: '%s | Documentation | Maz UI',
      meta: meta({
        description: `Discover the documention of ${pageTitle}`,
        title: `${pageTitle} | Documentation | Maz UI`
      })
    }
  },
  middleware ({ route, redirect }) {
    if (route.name === 'documentation') {
      return redirect({ name: 'documentation-get-started' })
    }
  }
}
</script>
