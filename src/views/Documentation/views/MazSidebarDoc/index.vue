<template>
  <div class="maz-sidebar-doc">
    <div class="maz-sidebar-doc__container pos-r br-4 over-hid my-4 shadow-container flex">
      <MazSidebar
        v-model="hasLeftSidebarOpen"
        :loader="loader"
        :width="width"
        :no-shadow="!hasShadow"
        :no-close-btn="!hasCloseBtn"
        :absolute="absolute"
        :dark="dark"
      >
        <div
          class="flex flex-1 align-center justify-center"
          :class="{ 'text-white': dark }"
        >
          SideBar Content Example
        </div>
      </MazSidebar>
      <div class="maz-sidebar-doc__content p-4 flex direction-column align-center justify-center flex-1">
        <MazBtn
          type="success"
          @click="loader = !loader"
        >
          Toggle loader
        </MazBtn>
        <MazBtn
          type="dark"
          @click="dark = !dark"
        >
          Toggle Dark
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
        :loader="loader"
        :width="width"
        :no-shadow="!hasShadow"
        :no-close-btn="!hasCloseBtn"
        :absolute="absolute"
        right
        :dark="!dark"
      >
        <div
          class="flex flex-1 align-center justify-center"
          :class="{ 'text-white': !dark }"
        >
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
        absolute: false,
        dark: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-sidebar-doc {
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
