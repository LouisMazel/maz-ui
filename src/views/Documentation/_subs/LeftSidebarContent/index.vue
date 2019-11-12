<template>
  <div class="left-sidebar-content flex flex-direction-column p-4 h-100">
    <h3 class="mb-3">
      Development
    </h3>
    <router-link
      class="menu-item btn btn-white btn-sm mb-2"
      :to="{
        name: 'Install'
      }"
    >
      Install
    </router-link>
    <router-link
      class="menu-item btn btn-white btn-sm"
      :to="{
        name: 'GetStarted'
      }"
    >
      Get started
    </router-link>
    <h3 class="my-3">
      Components
    </h3>
    <div class="left-sidebar-content__content flex flex-direction-column">
      <router-link
        v-for="route in routesComponents"
        :key="route.name"
        class="menu-item btn btn-white btn-sm mb-2"
        :to="{
          name: route.name
        }"
      >
        {{ route.name.substring(3).slice(0, -3) }}
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LeftSidebarContent',
    computed: {
      routesComponents () {
        return this.$router.options.routes.filter(route => route.path === '/documentation')[0]
          .children.filter(child => child.path.startsWith('maz-'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .left-sidebar-content {
    background-color: var(--maz-bg-color);
    overflow-y: auto;

    .menu-item.router-link-active {
      background-color: var(--maz-bg-color);
      border: 1px solid var(--maz-primary-color);
    }
  }
</style>
