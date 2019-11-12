<template>
  <div class="left-sidebar-content flex flex-direction-column p-4 h-100">
    <h3 class="mb-3">
      Development
    </h3>
    <router-link
      class="btn btn-white btn-sm mb-2"
      :to="{
        name: 'Install'
      }"
    >
      Install
    </router-link>
    <router-link
      class="btn btn-white btn-sm"
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
        class="btn btn-white btn-sm mb-2"
        :to="{
          name: 'MazInputDoc'
        }"
      >
        MazInput
      </router-link>
      <router-link
        class="btn btn-white btn-sm mb-2"
        :to="{
          name: 'MazSwitchDoc'
        }"
      >
        MazSwitch
      </router-link>
      <router-link
        class="btn btn-white btn-sm mb-2"
        :to="{
          name: 'MazSidebarDoc'
        }"
      >
        MazSidebar
      </router-link>
      <router-link
        class="btn btn-white btn-sm mb-2"
        :to="{
          name: 'MazLoaderDoc'
        }"
      >
        MazLoader
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LeftSidebarContent'
  }
</script>

<style lang="scss" scoped>
  .left-sidebar-content {
    background-color: var(--maz-bg-color);
    overflow-y: auto;
  }
</style>
