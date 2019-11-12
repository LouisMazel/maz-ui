<template>
  <div class="maz-sidebar-doc h-100 flex">
    <div class="maz-sidebar-doc__container flex flex-1 pos-r br-8">
      <MazSidebar
        v-model="hasLeftSidebarOpen"
        class="h-100"
        :loader="loader"
        :width="width"
        :without-shadow="!hasShadow"
        :without-close-btn="!hasCloseBtn"
        :absolute="absolute"
      >
        <div class="flex flex-1 align-center justify-content-center">
          SideBar Content Example
        </div>
      </MazSidebar>
      <div class="maz-sidebar-doc__container__content p-4 flex flex-direction-column align-center justify-content-center flex-1">
        <button
          class="btn btn-success mb-2"
          @click="loader = !loader"
        >
          Toggle loader
        </button>
        <MazInput
          v-model="width"
          type="number"
          label="Sidebar width value"
        />
        <div class="switch-container shadow flex">
          <p> Has left sidebar is open</p>
          <MazSwitch
            v-model="hasLeftSidebarOpen"
          />
        </div>
        <div class="switch-container shadow flex">
          <p> Has right sidebar is open</p>
          <MazSwitch
            v-model="hasRightSidebarOpen"
          />
        </div>
        <div class="switch-container shadow flex">
          <p> Has shadow</p>
          <MazSwitch
            v-model="hasShadow"
          />
        </div>
        <div class="switch-container close-btn flex">
          <p> Has close btn</p>
          <MazSwitch
            v-model="hasCloseBtn"
          />
        </div>
        <div class="switch-container absolute flex">
          <p>Is absolute</p>
          <MazSwitch
            v-model="absolute"
          />
        </div>
      </div>
      <MazSidebar
        v-model="hasRightSidebarOpen"
        class="h-100"
        :loader="loader"
        :width="width"
        :without-shadow="!hasShadow"
        :without-close-btn="!hasCloseBtn"
        :absolute="absolute"
        right
      >
        <div class="flex flex-1 align-center justify-content-center">
          SideBar Content Example
        </div>
      </MazSidebar>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazSidebarDoc',
    data () {
      return {
        hasLeftSidebarOpen: true,
        hasRightSidebarOpen: false,
        loader: false,
        width: 350,
        hasShadow: true,
        hasCloseBtn: true,
        absolute: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-sidebar-doc {
    padding: 20px;

    &__container {
      border: 2px solid var(--maz-text-color-dark);
      overflow: hidden;

      &__content {
        .switch-container {
          margin-bottom: 10px;

          p {
            margin-right: 20px;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
