<template>
  <div class="left-sidebar-content maz-p-4 maz-h-100">
    <h3 class="maz-mb-3">
      Development
    </h3>
    <h4 class="maz-my-3">
      General
    </h4>
    <NuxtLink
      class="menu-item maz-btn maz-btn--white maz-mb-2 maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
      :to="{
        name: 'get-started'
      }"
    >
      Get started
    </NuxtLink>
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
    <NuxtLink
      class="menu-item maz-btn maz-btn--white maz-mb-2 maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
      :to="{
        name: 'colors'
      }"
    >
      Basic colors
    </NuxtLink>
    <NuxtLink
      class="menu-item maz-btn maz-btn--white maz-mb-2 maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
      :to="{
        name: 'theme'
      }"
    >
      Use your own colors & style
    </NuxtLink>
    <NuxtLink
      class="menu-item maz-btn maz-btn--white maz-mb-2 maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
      :to="{
        name: 'dark-mode'
      }"
    >
      Use dark mode
    </NuxtLink>
    <h3 class="maz-my-3">
      Components
    </h3>
    <div class="left-sidebar-content__content">
      <h4 class="maz-my-3">
        Form
      </h4>
      <NuxtLink
        v-for="route in routesFormComponents"
        :key="route.name"
        class="menu-item maz-btn maz-btn--white maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
        :to="{
          name: route.name
        }"
      >
        {{ getComponentName(route.name) }}
      </NuxtLink>
      <h4 class="maz-my-3">
        User Interface
      </h4>
      <NuxtLink
        v-for="route in routesUiComponents"
        :key="route.name"
        class="menu-item maz-btn maz-btn--white maz-w-100 maz-no-shadow maz-text-color maz-bg-color maz-no-border maz-hover-bg-color"
        :to="{
          name: route.name
        }"
      >
        {{ getComponentName(route.name) }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { replaceAll, pascalCaseToKebabCase } from '@/../utils'

const isGeneralDoc = name => ['install', 'get-started'].includes(name)
const isCliDoc = name => ['cli-install'].includes(name)
const isThemeDoc = name => ['theme', 'colors', 'dark-mode'].includes(name)

export default {
  name: 'LeftSidebarContent',
  computed: {
    routesFormComponents () {
      return this.$router.options.routes
        .filter(route => route.path.includes('/documentation/'))
        .filter(
          ({ name }) =>
            !isGeneralDoc(name) && !isCliDoc(name) && !isThemeDoc(name)
        )
        .slice(0, 13)
    },
    routesUiComponents () {
      return this.$router.options.routes
        .filter(route => route.path.includes('/documentation/'))
        .filter(
          ({ name }) =>
            !isGeneralDoc(name) && !isCliDoc(name) && !isThemeDoc(name)
        )
        .slice(13)
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
      margin-bottom: .5rem;
      line-height: normal;
      text-align: left;

      &:last-child {
        margin-bottom: 0;
      }

      &.NuxtLink-active {
        color: $primary-color;
      }
    }
  }
</style>
