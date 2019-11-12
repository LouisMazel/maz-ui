<template>
  <div class="documentation flex">
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      :width="250"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div class="documentation__container flex-1 px-5 py-3">
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
    min-height: 0;

    &__container {
      overflow-x: auto;
      min-height: 0;
    }
  }
</style>
