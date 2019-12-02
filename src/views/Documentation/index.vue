<template>
  <div class="documentation flex flex-1 pos-r">
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      :width="250"
      :dark="hasDarkTheme"
      :absolute="isAbsolute"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div class="documentation__container flex direction-column flex-1">
      <div
        v-if="$route.name !== 'Install' && $route.name !== 'GetStarted'"
        class="flex space-between px-5 py-3 align-center"
      >
        <h2>
          {{ currentComponent | capitalize }}
        </h2>
        <MazBtn
          @click="showOptions"
        >
          Show options
        </MazBtn>
      </div>
      <router-view class="px-5 py-3 flex-1" />
      <NavFooter />
    </div>
    <MazSidebar
      v-if="$route.name !== 'Install' && $route.name !== 'GetStarted'"
      v-model="hasRightSidebarOpen"
      :width="500"
      right
      absolute
      no-close-btn
      :dark="hasDarkTheme"
    >
      <RightSidebarContent @close="hasRightSidebarOpen = !hasRightSidebarOpen" />
    </MazSidebar>
  </div>
</template>

<script>
  import LeftSidebarContent from './_subs/LeftSidebarContent'
  import RightSidebarContent from './_subs/RightSidebarContent'
  import NavFooter from '@/components/NavFooter'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Documentation',
    components: {
      LeftSidebarContent,
      RightSidebarContent, // eslint-disable-line
      NavFooter
    },
    data () {
      return {
        hasLeftSidebarOpen: !(window.innerWidth < 767),
        hasRightSidebarOpen: false,
        isAbsolute: window.innerWidth < 767
      }
    },
    computed: {
      ...mapGetters(['hasDarkTheme']),
      currentComponent () {
        return this.$route.name.slice(0, -3)
      }
    },
    methods: {
      showOptions () {
        this.hasRightSidebarOpen = !this.hasRightSidebarOpen
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
