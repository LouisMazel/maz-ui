<template>
  <NuxtChild />
</template>

<script>
import { replaceAll, capitalizeAll } from '~/utils'
import meta from '~/config/meta'

const NOT_COMPONENT_ROUTES = ['get-started', 'colors', 'theme', 'dark-mode']

export default {
  name: 'Documentation',
  layout: 'documentation',
  head () {
    const componentName = this.$route.name.substring(14)
    const pageTitle = capitalizeAll(replaceAll(componentName, '-', ' '))
    return {
      title: `${pageTitle}`,
      titleTemplate: '%s | Documentation | Maz UI',
      meta: meta({
        description: `${pageTitle} is a stand-alone component for Vue.JS and Nuxt.JS - Dark mode support`,
        title: `${pageTitle} | Documentation | Maz UI`,
        ...(!NOT_COMPONENT_ROUTES.includes(componentName) ? { img: componentName } : {})
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
