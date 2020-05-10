<template>
  <div class="maz-sidebar-doc">
    <div
      class="maz-sidebar-doc__container maz-position-relative maz-overflow-hidden maz-my-4 maz-elevation maz-flex"
    >
      <MazSidebar
        v-model="hasLeftSidebarOpen"
        :loading="loading"
        :width="width"
        :no-shadow="!hasShadow"
        :no-close-btn="!hasCloseBtn"
        :absolute="absolute"
        :layer="layer"
      >
        <div class="maz-flex maz-flex-1 maz-align-center maz-justify-center maz-text-color">
          SideBar Content Example
        </div>
      </MazSidebar>
      <div
        class="maz-sidebar-doc__content maz-p-4 maz-flex maz-direction-column maz-align-center maz-justify-center maz-flex-1"
      >
        <MazBtn
          color="third"
          @click="loading = !loading"
        >
          Toggle loading
        </MazBtn>
        <MazInput
          v-model="width"
          type="number"
          placeholder="Sidebar width"
        />
        <div class="switch-container maz-flex">
          <p>Has left sidebar is open</p>
          <MazSwitch v-model="hasLeftSidebarOpen" />
        </div>
        <div class="switch-container maz-flex">
          <p>Has right sidebar is open</p>
          <MazSwitch v-model="hasRightSidebarOpen" />
        </div>
        <div class="switch-container maz-flex">
          <p>Has shadow</p>
          <MazSwitch v-model="hasShadow" />
        </div>
        <div class="switch-container close-btn maz-flex">
          <p>Has close btn</p>
          <MazSwitch v-model="hasCloseBtn" />
        </div>
        <div class="switch-container maz-flex">
          <p>Is absolute</p>
          <MazSwitch v-model="absolute" />
        </div>
        <div class="switch-container maz-flex">
          <p>has Layer</p>
          <MazSwitch v-model="layer" />
        </div>
      </div>
      <MazSidebar
        v-model="hasRightSidebarOpen"
        :loading="loading"
        :width="width"
        :no-shadow="!hasShadow"
        :no-close-btn="!hasCloseBtn"
        :absolute="absolute"
        right
        :layer="layer"
      >
        <div class="maz-flex maz-flex-1 maz-flex-center maz-text-color">
          SideBar Content Example
        </div>
      </MazSidebar>
    </div>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazSideBar
    v-model=&quot;value&quot;
  />
</template>

<script>
  import { MazSideBar } from 'maz-ui'
  export default {
    components: { MazSideBar }
    data () {
      return {
        value: false
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazSidebarDoc',
  data () {
    return {
      hasLeftSidebarOpen: true,
      hasRightSidebarOpen: false,
      loading: false,
      width: 300,
      hasShadow: true,
      hasCloseBtn: true,
      absolute: false,
      layer: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-sidebar-doc {
    &__container {
      padding: 0;
      border-radius: $border-radius;
    }

    &__content {
      & * {
        margin-bottom: .5rem;
      }

      .switch-container {
        p {
          margin-right: 20px;
          font-size: 1em;
        }
      }
    }
  }
</style>
