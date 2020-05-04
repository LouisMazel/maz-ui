<template>
  <div class="left-sidebar-content p-4 h-100">
    <h3 class="mb-3">
      Development
    </h3>
    <h4 class="my-3">
      General
    </h4>
    <router-link
      v-for="route in routesStartedDoc"
      :key="route.name"
      class="menu-item btn btn--white mb-2 w-100 no-shadow text-color bg-color no-border hover-bg-color"
      :to="{
        name: route.name
      }"
    >
      {{ getPageName(route.path) | capitalize }}
    </router-link>
    <h4 class="my-3">
      Maz-CLI
    </h4>
    <router-link
      class="menu-item btn btn--white mb-2 w-100 no-shadow text-color bg-color no-border hover-bg-color"
      :to="{
        name: 'CliInstall'
      }"
    >
      Create project w/ Nuxt.JS x Prismic
    </router-link>
    <h4 class="my-3">
      Theme
    </h4>
    <router-link
      class="menu-item btn btn--white mb-2 w-100 no-shadow text-color bg-color no-border hover-bg-color"
      :to="{
        name: 'Theme'
      }"
    >
      Use your own colors & text properties
    </router-link>
    <h3 class="my-3">
      Components
    </h3>
    <div class="left-sidebar-content__content">
      <h4 class="my-3">
        Form
      </h4>
      <router-link
        v-for="route in routesFormComponents"
        :key="route.name"
        class="menu-item btn btn--white w-100 no-shadow text-color bg-color no-border hover-bg-color"
        :to="{
          name: route.name
        }"
      >
        {{ getComponentName(route.name) }}
      </router-link>
      <h4 class="my-3">
        User Interface
      </h4>
      <router-link
        v-for="route in routesUiComponents"
        :key="route.name"
        class="menu-item btn btn--white w-100 no-shadow text-color bg-color no-border hover-bg-color"
        :to="{
          name: route.name
        }"
      >
        {{ getComponentName(route.name) }}
      </router-link>
    </div>
  </div>
</template>

<script>
  import { replaceAll, pascalCaseToKebabCase } from '@/utils'

  const isGeneralDoc = (name) => ['Install', 'GetStarted'].includes(name)
  const isCliDoc = (name) => ['CliInstall'].includes(name)
  const isThemeDoc = (name) => ['Theme'].includes(name)

  export default {
    name: 'LeftSidebarContent',
    computed: {
      routesStartedDoc () {
        return this.$router.options.routes.filter(route => route.path === '/documentation')[0]
          .children.filter(child => isGeneralDoc(child.name))
      },
      routesFormComponents () {
        return this.$router.options.routes.filter(route => route.path === '/documentation')[0]
          .children.filter(({ name }) => !isGeneralDoc(name) && !isCliDoc(name) && !isThemeDoc(name)).slice(0, 12)
      },
      routesUiComponents () {
        return this.$router.options.routes.filter(route => route.path === '/documentation')[0]
          .children.filter(({ name }) => !isGeneralDoc(name) && !isCliDoc(name) && !isThemeDoc(name)).slice(12)
      }
    },
    methods: {
      getComponentName (string) {
        return pascalCaseToKebabCase(string.slice(0, -3))
      },
      getPageName (string) {
        return replaceAll(string, '-', ' ')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .left-sidebar-content {
    overflow-y: auto;

    .menu-item {
      font-weight: 500;
      margin-bottom: .5em;
      line-height: normal;

      &:last-child {
        margin-bottom: 0;
      }

      &.router-link-active {
        color: $primary-color;
      }
    }
  }
</style>
