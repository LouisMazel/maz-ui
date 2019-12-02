<template>
  <div class="left-sidebar-content p-4 h-100">
    <h3 class="mb-3">
      Development
    </h3>
    <router-link
      v-for="route in routesStartedDoc"
      :key="route.name"
      class="menu-item btn btn--white mb-2 w-100"
      :to="{
        name: route.name
      }"
    >
      {{ getPageName(route.path) | capitalize }}
    </router-link>
    <h3 class="my-3">
      Components
    </h3>
    <div class="left-sidebar-content__content">
      <router-link
        v-for="route in routesComponents"
        :key="route.name"
        class="menu-item btn btn--white mb-2 w-100"
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

  export default {
    name: 'LeftSidebarContent',
    computed: {
      routesStartedDoc () {
        return this.$router.options.routes.filter(route => route.path === '/documentation')[0]
          .children.filter(child => child.name === 'Install' || child.name === 'GetStarted')
      },
      routesComponents () {
        return this.$router.options.routes.filter(route => route.path === '/documentation')[0]
          .children.filter(child => child.name !== 'Install' && child.name !== 'GetStarted')
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
      border: none;
      color: black;
      font-weight: 300;

      &.router-link-active {
        color: var(--maz-primary-color);
      }
    }
  }

  .is-dark .menu-item {
    background-color: var(--maz-bg-color-dark);
    color: var(--maz-text-color-dark);

    &:hover,
    &:focus {
      background-color: var(--maz-hover-color-dark);
    }
  }
</style>
