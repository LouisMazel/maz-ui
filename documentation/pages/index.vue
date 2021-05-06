<template>
  <div class="home maz-flex-1 maz-flex maz-direction-column">
    <div class="home__main maz-flex maz-flex-1 maz-flex-center maz-container">
      <div class="home__content maz-flex maz-direction-column maz-justify-center maz-p-4">
        <h2 class="maz-mb-2 maz-text-center">
          Stand-alone components library to build your interfaces with
          <br><span class="maz-text-primary">Vue.JS & Nuxt.JS</span>
        </h2>
        <h3 class="maz-mb-2 maz-text-center maz-text-third">
          Full dark mode support
        </h3>
        <div class="maz-flex maz-flex-center maz-direction-column">
          <CodeContainer
            language="bash"
            code="npm i maz-ui -S"
            class="mb-4"
          />
          <div
            class="maz-flex maz-align-start maz-flex-wrap maz-my-3 maz-align-center maz-justify-center"
          >
            <MazBtn
              color="secondary"
              class="maz-mr-2"
              :to="{ name: 'documentation-get-started' }"
            >
              GET STARTED
            </MazBtn>
            <MazBtn
              color="primary"
              class="maz-mr-2"
              :to="{ name: 'documentation-maz-btn' }"
            >
              COMPONENTS
            </MazBtn>
            <MazBtn
              color="third"
              :to="{ name: 'documentation-theme' }"
            >
              THEME
            </MazBtn>
          </div>
        </div>
      </div>
      <div class="home__illu-container maz-flex maz-align-center maz-justify-center maz-p-4">
        <img
          class="home__illu-container__illu"
          :src="illuPath"
          alt="maz ui logo"
        />
      </div>
    </div>
    <NavFooter />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavFooter from '@/components/NavFooter'
import meta from '~/config/meta'

export default {
  name: 'Home',
  components: {
    NavFooter
  },
  head () {
    return {
      meta: meta({
        description: 'Build your amazing interfaces with Maz UI and its stand-alone components - Stand-alone components library for Vue.JS & Nuxt.JS',
        title: 'Maz UI - Stand-alone components library for Vue.JS & Nuxt.JS'
      })
    }
  },
  computed: {
    ...mapGetters(['hasDarkTheme']),
    illuPath () {
      return this.hasDarkTheme
        ? require('@/assets/img/maz-ui-illu-dark.png')
        : require('@/assets/img/maz-ui-illu.png')
    }
  }
}
</script>

<style lang="scss" scoped>
  .home {
    // background-image: linear-gradient(to right top, dodgerblue, #00B7FF, #00D4E0, #00E688, #A8EB12);

    @media only screen and (max-width: $breakpoint-laptop-s) {
      &__main {
        flex-direction: column-reverse;
      }
    }

    &__illu-container {
      flex: 0 0 60%;

      &__illu {
        max-width: 100%;
      }
    }

    &__content {
      flex: 0 0 40%;
    }

    h2 {
      color: var(--maz-text-color);
      font-size: 2.143rem;
      line-height: 1.5;
    }

    h3 {
      color: var(--maz-third);
    }
  }
</style>

