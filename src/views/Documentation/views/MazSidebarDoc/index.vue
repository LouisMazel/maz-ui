<template>
  <div class="maz-sidebar-doc h-100 flex flex-direction-column">
    <h1 class="text-center">
      MazSidebar
    </h1>
    <ComponentContainer class="maz-sidebar-doc__container flex flex-1">
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
      <div class="maz-sidebar-doc__content p-4 flex flex-direction-column align-center justify-content-center flex-1">
        <MazBtn
          type="success"
          size="sm"
          @click="loader = !loader"
        >
          Toggle loader
        </MazBtn>
        <MazInput
          v-model="width"
          type="number"
          label="Sidebar width"
        />
        <div class="switch-container shadow flex">
          <p>Has left sidebar is open</p>
          <MazSwitch
            v-model="hasLeftSidebarOpen"
          />
        </div>
        <div class="switch-container shadow flex">
          <p>Has right sidebar is open</p>
          <MazSwitch
            v-model="hasRightSidebarOpen"
          />
        </div>
        <div class="switch-container shadow flex">
          <p>Has shadow</p>
          <MazSwitch
            v-model="hasShadow"
          />
        </div>
        <div class="switch-container close-btn flex">
          <p>Has close btn</p>
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
    </ComponentContainer>
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
    padding: 20px 40px;

    &__container {
      padding: 0;
    }

    &__content {
      & * {
        margin-bottom: 0.5rem;
      }

      .switch-container {
        p {
          margin-right: 20px;
          font-size: 14px;
        }
      }
    }
  }
</style>
