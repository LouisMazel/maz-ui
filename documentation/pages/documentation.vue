<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'Documentation',
  layout: 'documentation',
  middleware ({ route, redirect }) {
    if (route.name === 'documentation') {
      return redirect({ name: 'documentation-get-started' })
    }
  }
}
</script>
