<template>
  <div class="maz-sidebar-doc">
    <p>
      <strong>
        Tips:
      </strong>
      Add this classes <code class="code">class="maz-flex maz-position-relative"</code> to the parent element (MazSidebar component works fine with flexbox)
    </p>
    <ComponentContainer
      code="<template>
  <div
    class=&quot;maz-position-relative maz-overflow-hidden maz-flex maz-border-color maz-border-solid maz-border&quot;
  >
    <MazSidebar
      v-model=&quot;hasLeftSidebarOpen&quot;
      :width=&quot;width&quot;
      :loading=&quot;loading&quot;
      :no-shadow=&quot;noShadow&quot;
      :no-close-btn=&quot;noCloseBtn&quot;
      :absolute=&quot;absolute&quot;
      :layer=&quot;layer&quot;
      :mini=&quot;mini&quot;
      :expand-on-hover=&quot;expandOnHover&quot;
    >
      <div class=&quot;maz-flex maz-flex-1 maz-align-center maz-justify-center maz-text-color&quot;>
        SideBar Content Example
      </div>
    </MazSidebar>
    <div
      class=&quot;maz-p-4 maz-flex maz-direction-column maz-align-center maz-justify-center maz-flex-1&quot;
    >
      <MazInput
        v-model=&quot;width&quot;
        type=&quot;number&quot;
        placeholder=&quot;Sidebar width&quot;
      />
      <div class=&quot;switch-container maz-flex&quot;>
        <p>Has left sidebar is open</p>
        <MazSwitch v-model=&quot;hasLeftSidebarOpen&quot; />
      </div>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>Has right sidebar is open</p>
        <MazSwitch v-model=&quot;hasRightSidebarOpen&quot; />
      </div>
      <p>
        <strong>Options:</strong>
      </p>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>shadow</p>
        <MazSwitch v-model=&quot;noShadow&quot; />
      </div>
      <div class=&quot;switch-container close-btn maz-flex&quot;>
        <p>close-btn</p>
        <MazSwitch v-model=&quot;noCloseBtn&quot; />
      </div>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>absolute</p>
        <MazSwitch v-model=&quot;absolute&quot; />
      </div>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>layer</p>
        <MazSwitch v-model=&quot;layer&quot; />
      </div>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>mini</p>
        <MazSwitch v-model=&quot;mini&quot; />
      </div>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>loading</p>
        <MazSwitch v-model=&quot;loading&quot; />
      </div>
      <div class=&quot;switch-container maz-flex&quot;>
        <p>expand-on-hover (only with mini)</p>
        <MazSwitch v-model=&quot;expandOnHover&quot; />
      </div>
    </div>
    <MazSidebar
      v-model=&quot;hasRightSidebarOpen&quot;
      :width=&quot;width&quot;
      :loading=&quot;loading&quot;
      :no-shadow=&quot;noShadow&quot;
      :no-close-btn=&quot;noCloseBtn&quot;
      :absolute=&quot;absolute&quot;
      :layer=&quot;layer&quot;
      :mini=&quot;mini&quot;
      :expand-on-hover=&quot;expandOnHover&quot;
      right
    >
      <div class=&quot;maz-flex maz-flex-1 maz-flex-center maz-text-color&quot;>
        SideBar Content Example
      </div>
    </MazSidebar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hasLeftSidebarOpen: true,
      hasRightSidebarOpen: false,
      width: 300,
      loading: false,
      noShadow: false,
      noCloseBtn: false,
      absolute: false,
      layer: false,
      mini: false
    }
  }
}
</script>"
    >
      <div
        class="maz-sidebar-doc__container maz-position-relative maz-overflow-hidden maz-flex maz-border-color maz-border-solid maz-border"
      >
        <MazSidebar
          v-model="hasLeftSidebarOpen"
          :width="width"
          :loading="loading"
          :no-shadow="noShadow"
          :no-close-btn="noCloseBtn"
          :absolute="absolute"
          :layer="layer"
          :mini="mini"
          :expand-on-hover="expandOnHover"
        >
          <div class="maz-flex maz-flex-1 maz-align-center maz-justify-center maz-text-color">
            SideBar Content Example
          </div>
        </MazSidebar>
        <div
          class="maz-sidebar-doc__content maz-p-4 maz-flex maz-direction-column maz-align-center maz-justify-center maz-flex-1"
        >
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
            <p>no-shadow</p>
            <MazSwitch v-model="noShadow" />
          </div>
          <div class="switch-container close-btn maz-flex">
            <p>no-close-btn</p>
            <MazSwitch v-model="noCloseBtn" />
          </div>
          <div class="switch-container maz-flex">
            <p>absolute</p>
            <MazSwitch v-model="absolute" />
          </div>
          <div class="switch-container maz-flex">
            <p>layer</p>
            <MazSwitch v-model="layer" />
          </div>
          <div class="switch-container maz-flex">
            <p>loading</p>
            <MazSwitch v-model="loading" />
          </div>
          <div class="switch-container maz-flex">
            <p>mini</p>
            <MazSwitch v-model="mini" />
          </div>
          <div class="switch-container maz-flex">
            <p>expand-on-hover (only with mini)</p>
            <MazSwitch v-model="expandOnHover" />
          </div>
        </div>
        <MazSidebar
          v-model="hasRightSidebarOpen"
          :width="width"
          :loading="loading"
          :no-shadow="noShadow"
          :no-close-btn="noCloseBtn"
          :absolute="absolute"
          :layer="layer"
          :mini="mini"
          :expand-on-hover="expandOnHover"
          right
        >
          <div class="maz-flex maz-flex-1 maz-flex-center maz-text-color">
            SideBar Content Example
          </div>
        </MazSidebar>
      </div>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <div
    class=&quot;maz-position-relative maz-overflow-hidden maz-flex maz-border-color maz-border-solid maz-border&quot;
  >
    <MazSidebar
      v-slot=&quot;{ isOpen }&quot;
      :width=&quot;200&quot;
      expand-on-hover
      mini
    >
      <div class=&quot;maz-p-2 maz-flex maz-direction-column&quot;>
        <div class=&quot;maz-flex maz-align-center maz-pb-2 maz-mb-2 maz-border-color maz-border-bottom maz-border-bottom-solid&quot;>
          <MazAvatar
            :size=&quot;46&quot;
            src=&quot;http://www.placecage.com/100/100&quot;
          />
          <p
            v-if=&quot;isOpen&quot;
            class=&quot;maz-ml-4 maz-dots-text&quot;
          >
            <strong>
              Nicolas Cage
            </strong>
            <br>
            <span>
              Actor
            </span>
          </p>
        </div>
        <MazBtn
          left-icon-name=&quot;person&quot;
          color=&quot;transparent&quot;
          class=&quot;maz-mb-2&quot;
          no-shadow
          justify-start
        >
          <span
            v-if=&quot;isOpen&quot;
            class=&quot;maz-ml-4&quot;
          >Profile</span>
        </MazBtn>
        <MazBtn
          left-icon-name=&quot;settings&quot;
          color=&quot;transparent&quot;
          class=&quot;maz-mb-2&quot;
          no-shadow
          justify-start
        >
          <span
            v-if=&quot;isOpen&quot;
            class=&quot;maz-ml-4&quot;
          >Settings</span>
        </MazBtn>
      </div>
    </MazSidebar>
    <div
      class=&quot;maz-p-4 maz-flex maz-direction-column maz-align-center maz-justify-center maz-flex-1&quot;
    >
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
      <h6>Content</h6>
    </div>
  </div>
</template>"
    >
      <h4 class="maz-mb-4">
        Mini & expand-on-hover
      </h4>
      <div
        class="maz-sidebar-doc__container maz-position-relative maz-overflow-hidden maz-flex maz-border-color maz-border-solid maz-border"
      >
        <MazSidebar
          v-slot="{ isOpen }"
          expand-on-hover
          mini
          :width="200"
        >
          <div class="maz-p-2 maz-flex maz-direction-column">
            <div class="maz-sidebar-doc__container_nav-header maz-flex maz-align-center maz-pb-2 maz-mb-2 maz-border-color maz-border-bottom maz-border-bottom-solid">
              <MazAvatar
                :size="46"
                src="http://www.placecage.com/100/100"
              />
              <p
                v-if="isOpen"
                class="maz-ml-4 maz-dots-text"
              >
                <strong>
                  Nicolas Cage
                </strong>
                <br>
                <span>
                  Actor
                </span>
              </p>
            </div>
            <MazBtn
              left-icon-name="person"
              color="transparent"
              class="maz-mb-2"
              no-shadow
              justify-start
            >
              <span
                v-if="isOpen"
                class="maz-ml-4"
              >Profile</span>
            </MazBtn>
            <MazBtn
              left-icon-name="settings"
              color="transparent"
              class="maz-mb-2"
              no-shadow
              justify-start
            >
              <span
                v-if="isOpen"
                class="maz-ml-4"
              >Settings</span>
            </MazBtn>
          </div>
        </MazSidebar>
        <div
          class="maz-sidebar-doc__content maz-p-4 maz-flex maz-direction-column maz-align-center maz-justify-center maz-flex-1"
        >
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
          <h6>Content</h6>
        </div>
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
  <MazSideBar />
</template>

<script>
  import { MazSideBar } from 'maz-ui'
  export default {
    components: { MazSideBar }
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
      width: 300,
      loading: false,
      noShadow: false,
      noCloseBtn: false,
      absolute: false,
      layer: false,
      mini: false,
      expandOnHover: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-sidebar-doc {
    &__container {
      padding: 0;
      border-radius: var(--maz-border-radius);
    }

    &__content {
      background-color: var(--maz-bg-color-light);

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
</style>
