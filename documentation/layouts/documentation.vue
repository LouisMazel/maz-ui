<template>
  <div
    id="app"
    class="documentation maz-flex maz-flex-1 maz-direction-column maz-position-relative maz-bg-color maz-text-color"
    :class="{
      'maz-is-dark': hasDarkTheme
    }"
  >
    <NavHeader />
    <div class="maz-flex maz-flex-1 maz-m-h-0 maz-position-relative">
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
          class="maz-flex maz-space-between maz-px-5 maz-py-5 maz-align-center maz-flex-wrap maz-flex-fixed"
        >
          <h2>
            {{ currentComponent | capitalize }}
          </h2>
          <div class="maz-flex-fixed">
            <MazBtn
              v-scroll-to="{
                el: '#howToUseIt',
                container: '.documentation__container'
              }"
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
        <div
          v-if="description"
          class="documentation__component-desc maz-px-5 maz-py-2"
        >
          <div class="documentation__component-desc__container maz-p-3 maz-bg-color-light">
            <h3>
              {{ description }}
            </h3>
          </div>
        </div>
        <nuxt
          role="main"
          class="content maz-px-5 maz-py-5 maz-flex-1"
        />
        <NavFooter />
      </div>
      <MazSidebar
        v-if="isComponentRoute"
        v-model="hasRightSidebarOpen"
        :width="1300"
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
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import LeftSidebarContent from '@/components/LeftSidebarContent'
import RightSidebarContent from '@/components/RightSidebarContent'
import NavFooter from '@/components/NavFooter'

const isGeneralDoc = name => ['documentation-get-started'].includes(name)
const isCliDoc = name => ['documentation-cli-install'].includes(name)
const isThemeDoc = name => ['documentation-theme', 'documentation-colors', 'documentation-dark-mode'].includes(name)

import { mapGetters, mapActions } from 'vuex'

const regex = /-(\w)/g
const camelize = str => str.replace(regex, (_, c) => (c ? c.toUpperCase() : ''))

import { replaceAll, capitalizeAll } from '~/utils'
import meta from '~/config/meta'
import descriptions from '~/config/descriptions'

const NOT_COMPONENT_ROUTES = ['get-started', 'colors', 'theme', 'dark-mode']

export default {
  name: 'Documentation',
  components: {
    NavHeader,
    LeftSidebarContent,
    RightSidebarContent, // eslint-disable-line
    NavFooter
  },
  head () {
    const componentName = this.$route.name.substring(14)
    const pageTitle = capitalizeAll(replaceAll(componentName, '-', ' '))
    return {
      title: `${pageTitle}`,
      titleTemplate: '%s | Documentation | Maz UI',
      meta: meta({
        description: descriptions[componentName]
          ? `${descriptions[componentName]} - Dark mode support - For Vue.JS and Nuxt.JS`
          : `${pageTitle} is a stand-alone component for Vue.JS and Nuxt.JS - Dark mode support`,
        title: `${pageTitle} | Documentation | Maz UI`,
        ...(!NOT_COMPONENT_ROUTES.includes(componentName) ? { img: componentName } : {})
      })
    }
  },
  data () {
    return {
      hasLeftSidebarOpen: true,
      isAbsolute: false,
      hasRightSidebarOpen: false
    }
  },
  computed: {
    ...mapGetters(['hasDarkTheme']),
    currentComponent () {
      return camelize(this.$route.name.substring(14))
    },
    isComponentRoute () {
      const { routeName } = this
      return !isGeneralDoc(routeName) && !isCliDoc(routeName) && !isThemeDoc(routeName)
    },
    routeName () {
      const { name } = this.$route
      return name
    },
    description () {
      const componentName = this.$route.name.substring(14)
      return descriptions[componentName]
    }
  },
  watch: {
    async routeName () {
      await this.$nextTick()
      this.$refs.DocumentationContainer.scrollTop = 0
    }
  },
  mounted () {
    this.hasLeftSidebarOpen= !(window.innerWidth < 767),
    this.isAbsolute = window.innerWidth < 767

    const date = new Date().toTimeString()
    const darkMode = this.$cookies.get('use-dark-theme')
    const shouldSetDarkMode = (date < '9:00' && date > '23:00') && typeof darkMode === 'undefined'
    if (shouldSetDarkMode || darkMode) {
      this.setDarkTheme(shouldSetDarkMode ? true : Boolean(darkMode))
    }
  },
  methods: {
    ...mapActions(['setDarkTheme']),
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
      overflow-y: auto;
    }
  }
</style>

<style lang="scss">
  .documentation {
    &__component-desc {
      &__container {
        border-left: var(--border-width) solid $primary-color;

        h3 {
          font-size: 1.2rem;
          line-height: 1.5;
        }
      }
    }

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
