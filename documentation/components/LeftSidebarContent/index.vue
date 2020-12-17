<template>
  <div class="left-sidebar-content maz-p-4 maz-h-100">
    <h3 class="maz-mb-3">
      Development
    </h3>
    <h4 class="maz-my-3">
      General
    </h4>
    <MazBtn
      class="menu-item maz-mb-2"
      color="transparent"
      block
      justify-start
      no-shadow
      :to="{
        name: 'documentation-get-started'
      }"
    >
      Get started
    </MazBtn>
    <!-- <h4 class="maz-my-3">
      Maz-CLI
    </h4>
    <NuxtLink
      class="menu-item maz-btn maz-btn--white maz-mb-2 maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
      :to="{
        name: 'CliInstall'
      }"
    >
      Create project w/ Nuxt.JS x Prismic
    </NuxtLink> -->
    <h4 class="maz-my-3">
      Theme
    </h4>
    <MazBtn
      class="menu-item maz-mb-2"
      color="transparent"
      block
      justify-start
      no-shadow
      :to="{
        name: 'documentation-colors'
      }"
    >
      Basic colors
    </MazBtn>
    <MazBtn
      class="menu-item maz-mb-2"
      color="transparent"
      block
      justify-start
      no-shadow
      :to="{
        name: 'documentation-theme'
      }"
    >
      Theme (colors & style)
    </MazBtn>
    <MazBtn
      class="menu-item maz-mb-2"
      color="transparent"
      block
      justify-start
      no-shadow
      :to="{
        name: 'documentation-dark-mode'
      }"
    >
      Use dark mode
    </MazBtn>
    <h3 class="maz-my-3">
      Components
    </h3>
    <div class="left-sidebar-content__content">
      <h4 class="maz-my-3">
        Form
      </h4>
      <MazBtn
        v-for="route in routesFormComponents"
        :key="route.name"
        class="menu-item maz-mb-2"
        color="transparent"
        block
        justify-start
        no-shadow
        :to="{
          name: route.name
        }"
      >
        {{ getComponentName(route.name) }}
      </MazBtn>
      <h4 class="maz-my-3">
        User Interface
      </h4>
      <MazBtn
        v-for="route in routesUiComponents"
        :key="route.name"
        class="menu-item maz-mb-2"
        color="transparent"
        block
        justify-start
        no-shadow
        :to="{
          name: route.name
        }"
      >
        {{ getComponentName(route.name) }}
      </MazBtn>
    </div>
  </div>
</template>

<script>

const isGeneralDoc = name => ['documentation-get-started'].includes(name)
const isCliDoc = name => ['cli-install'].includes(name)
const isThemeDoc = name => ['documentation-theme', 'documentation-colors', 'documentation-dark-mode'].includes(name)

const formComponentsRoutes = [
  'documentation-maz-btn',
  'documentation-maz-btn-group',
  'documentation-maz-checkbox',
  'documentation-maz-dropzone',
  'documentation-maz-input',
  'documentation-maz-input-tags',
  'documentation-maz-phone-number-input',
  'documentation-maz-picker',
  'documentation-maz-radio',
  'documentation-maz-search',
  'documentation-maz-select',
  'documentation-maz-slider',
  'documentation-maz-switch'
]

export default {
  name: 'LeftSidebarContent',
  computed: {
    routesFormComponents () {
      return this.$router.options.routes
        .find(route => route.name === 'documentation').children
        .filter(({ name }) => formComponentsRoutes.includes(name))
    },
    routesUiComponents () {
      return this.$router.options.routes
        .find(route => route.name === 'documentation').children
        .filter(
          ({ name }) =>
            !formComponentsRoutes.includes(name) && !isGeneralDoc(name) && !isCliDoc(name) && !isThemeDoc(name)
        )
    }
  },
  methods: {
    getComponentName (string) {
      return string.substring(14)
    }
  }
}
</script>

<style lang="scss" scoped>
  .left-sidebar-content {
    overflow-y: auto;

    .menu-item {
      font-weight: 500;
      margin-bottom: .5rem;
      line-height: normal;
      text-align: left;

      &:last-child {
        margin-bottom: 0;
      }

      &.nuxt-link-exact-active {
        color: var(--maz-primary);
      }
    }
  }
</style>
