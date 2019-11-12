<template>
  <div class="documentation flex">
    <MazSidebar
      v-model="hasLeftSidebarOpen"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div class="documentation__container flex-1">
      <router-view />
    </div>
  </div>
</template>

<script>
  import LeftSidebarContent from './_subs/LeftSidebarContent'

  export default {
    name: 'Documentation',
    components: {
      LeftSidebarContent
    },
    data () {
      return {
        hasLeftSidebarOpen: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .documentation {
    overflow: hidden;

    &__container {
      overflow-x: auto;
    }
  }
</style>
