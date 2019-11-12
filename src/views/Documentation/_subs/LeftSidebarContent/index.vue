<template>
  <div class="left-sidebar-content flex flex-direction-column p-4 h-100">
    <h3 class="mb-3">
      Development
    </h3>
    <router-link
      v-for="route in routesStartedDoc"
      :key="route.name"
      class="menu-item btn btn-primary-outline btn-sm mb-2"
      :to="{
        name: route.name
      }"
    >
      {{ route.path | capitalize }}
    </router-link>
    <h3 class="my-3">
      Components
    </h3>
    <div class="left-sidebar-content__content flex flex-direction-column">
      <router-link
        v-for="route in routesComponents"
        :key="route.name"
        class="menu-item btn btn-primary-outline btn-sm mb-2"
        :to="{
          name: route.name
        }"
      >
        {{ route.path | capitalize }}
      </router-link>
    </div>
  </div>
</template>

<script>
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
    }
  }
</script>

<style lang="scss" scoped>
  .left-sidebar-content {
    background-color: var(--maz-bg-color);
    overflow-y: auto;

    .menu-item {
      border: none;
      color: var(--maz-text-color);

      &.router-link-active {
        background-color: var(--maz-bg-color);
        border: 1px solid var(--maz-primary-color);
      }
    }
  }
</style>
