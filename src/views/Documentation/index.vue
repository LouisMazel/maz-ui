<template>
  <div class="documentation maz-flex maz-flex-1 maz-position-relative">
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      :width="280"
      :absolute="isAbsolute"
      :layer="isAbsolute"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div class="documentation__container maz-flex maz-direction-column maz-flex-1">
      <div
        v-if="isComponentRoute"
        class="maz-flex maz-space-between maz-px-5 maz-py-5 maz-align-center maz-flex-wrap"
      >
        <h2>
          {{ currentComponent | capitalize }}
        </h2>
        <div class="maz-flex-fixed">
          <MazBtn @click="showOptions">
            Show Options, Events & Slots
          </MazBtn>
        </div>
      </div>
      <router-view class="content maz-px-5 maz-py-5 maz-flex-1" />
      <NavFooter />
    </div>
    <MazSidebar
      v-if="isComponentRoute"
      v-model="hasRightSidebarOpen"
      :width="1000"
      right
      absolute
      layer
      no-close-btn
    >
      <RightSidebarContent
        @close="hasRightSidebarOpen = !hasRightSidebarOpen"
      />
    </MazSidebar>
  </div>
</template>

<script>
import LeftSidebarContent from './_subs/LeftSidebarContent'
import RightSidebarContent from './_subs/RightSidebarContent'
import NavFooter from '@/components/NavFooter'

const isGeneralDoc = name => ['Install', 'GetStarted'].includes(name)
const isCliDoc = name => ['CliInstall'].includes(name)
const isThemeDoc = name => ['Theme', 'Colors'].includes(name)

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
    currentComponent () {
      return this.$route.name.slice(0, -3)
    },
    isComponentRoute () {
      const { name } = this.$route
      return !isGeneralDoc(name) && !isCliDoc(name) && !isThemeDoc(name)
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
    overflow-y: hidden;

    &__container {
      overflow-x: auto;
    }
  }
</style>

<style lang="scss">
  .content {
    > p,
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      margin-bottom: 15px;
    }
  }
</style>
