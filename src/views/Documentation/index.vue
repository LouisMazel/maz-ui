<template>
  <div class="documentation flex flex-1">
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      :width="250"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div class="documentation__container flex-1">
      <router-view class="px-5 py-3" />
      <NavFooter />
    </div>
  </div>
</template>

<script>
  import LeftSidebarContent from './_subs/LeftSidebarContent'
  import NavFooter from '@/components/NavFooter'

  export default {
    name: 'Documentation',
    components: {
      LeftSidebarContent,
      NavFooter
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
    }
  }
</style>
