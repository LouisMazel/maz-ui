<template>
  <div class="maz-sidebar-doc">
    <p>
      <strong>
        Tips:
      </strong>
      Add this classes <code class="code">class="maz-flex maz-position-relative"</code> to the parent element (MazSidebar component works fine with flexbox)
    </p>
    <ComponentContainer
      code=""
      class="maz-flex maz-position-relative"
    >
      <div
        class="maz-sidebar-doc__container maz-position-relative maz-overflow-hidden maz-elevation maz-flex"
      >
        <MazSidebar
          v-model="hasLeftSidebarOpen"
          :loading="loading"
          :width="width"
          :no-shadow="!hasShadow"
          :no-close-btn="!hasCloseBtn"
          :absolute="absolute"
          :layer="layer"
          :mini="mini"
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
          <p>
            <strong>Options:</strong>
          </p>
          <div class="switch-container maz-flex">
            <p>shadow</p>
            <MazSwitch v-model="hasShadow" />
          </div>
          <div class="switch-container close-btn maz-flex">
            <p>close-btn</p>
            <MazSwitch v-model="hasCloseBtn" />
          </div>
          <div class="switch-container maz-flex">
            <p>absolute</p>
            <MazSwitch v-model="absolute" />
          </div>
          <div class="switch-container maz-flex">
            <p>Layer</p>
            <MazSwitch v-model="layer" />
          </div>
          <div class="switch-container maz-flex">
            <p>mini</p>
            <MazSwitch v-model="mini" />
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
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>

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
      layer: false,
      mini: false
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
      background-color: $bg-color-light;

      & * {
        margin-bottom: .5rem;
      }

      .switch-container {
        p {
          margin-right: 20px;
          font-size: 1rem;
        }
      }
    }
  }

  .maz-is-dark {
    .maz-sidebar-doc__content {
      background-color: darken($bg-color-dark-light, 5%);
    }
  }
</style>
