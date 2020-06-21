<template>
  <div
    class="documentation maz-flex maz-flex-1 maz-position-relative"
  >
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      :width="280"
      :absolute="isAbsolute"
      :layer="isAbsolute"
    >
      <LeftSidebarContent />
    </MazSidebar>
    <div
      ref="DocumentationContainer"
      class="documentation__container maz-flex maz-direction-column maz-flex-1"
    >
      <div
        v-if="isComponentRoute"
        class="maz-flex maz-space-between maz-px-5 maz-py-5 maz-align-center maz-flex-wrap"
      >
        <h2>
          {{ currentComponent | capitalize }}
        </h2>
        <div class="maz-flex-fixed">
          <MazBtn
            color="secondary"
            href="#howToUseIt"
            class="maz-mr-2"
          >
            How to use it ?
          </MazBtn>
          <MazBtn @click="showOptions">
            Options - Events - Slots
          </MazBtn>
        </div>
      </div>
      <nuxt class="content maz-px-5 maz-py-5 maz-flex-1" />
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
import LeftSidebarContent from '@/components/LeftSidebarContent'
import RightSidebarContent from '@/components/RightSidebarContent'
import NavFooter from '@/components/NavFooter'

const isGeneralDoc = name => ['Install', 'GetStarted'].includes(name)
const isCliDoc = name => ['CliInstall'].includes(name)
const isThemeDoc = name => ['Theme', 'Colors', 'DarkMode'].includes(name)

export default {
  name: 'Documentation',
  components: {
    LeftSidebarContent,
      RightSidebarContent, // eslint-disable-line
    NavFooter
  },
  data () {
    return {
      hasLeftSidebarOpen: true, // !(window.innerWidth < 767),
      hasRightSidebarOpen: false,
      isAbsolute: false // window.innerWidth < 767
    }
  },
  computed: {
    currentComponent () {
      return this.$route.name.slice(0, -3)
    },
    isComponentRoute () {
      const { routeName } = this
      return !isGeneralDoc(routeName) && !isCliDoc(routeName) && !isThemeDoc(routeName)
    },
    routeName () {
      const { name } = this.$route
      return name
    }
  },
  watch: {
    async routeName () {
      await this.$nextTick()
      this.$refs.DocumentationContainer.scrollTop = 0
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
  .documentation {
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
  }
</style>
