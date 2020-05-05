<template>
  <div class="home maz-flex-1 maz-flex maz-direction-column">
    <div class="home__main maz-flex maz-flex-1 maz-container maz-flex-center">
      <div class="home__content maz-flex maz-direction-column maz-justify-center maz-p-4">
        <h2 class="maz-mb-2 maz-text-center">
          Components Library to build your interfaces with
          <span class="maz-text-primary">Vue.JS & Nuxt.JS</span>
        </h2>
        <div class="maz-flex maz-flex-center maz-direction-column">
          <CodeContainer
            language="bash"
            code="npm i maz-ui -S"
            class="mb-4"
          />
          <div
            class="maz-flex maz-align-start maz-flex-wrap maz-my-3 maz-align-center maz-justify-center"
          >
            <router-link
              class="maz-btn maz-btn--secondary maz-mr-2 maz-mb-2"
              :to="{ name: 'GetStarted' }"
            >
              Get started
            </router-link>
            <router-link
              class="maz-btn maz-btn--primary maz-mr-2"
              :to="{ name: 'MazInputDoc' }"
            >
              Components
            </router-link>
            <router-link
              class="maz-btn maz-btn--third maz-mr-2"
              :to="{ name: 'Theme' }"
            >
              Theme
            </router-link>
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

export default {
  name: 'Home',
  components: {
    NavFooter
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
    @media only screen and (max-width: $breakpoint-mobile-l) {
      &__header button {
        width: 100%;
      }
    }

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
      color: #444352;
      font-size: 2.143em;
      line-height: 1.5;
    }

    h3.subtitle {
      color: $primary-color;
    }
  }

  .maz-is-dark {
    .home {
      h2 {
        color: $text-color-dark;
      }

      h3.subtitle {
        color: $primary-color !important;
      }

      .maz-btn--dark--outline {
        background-color: $bg-color-dark;
        color: $text-color-dark;
        border-color: $text-color-dark;

        &:hover,
        &:focus {
          background-color: $text-color-dark;
          color: $bg-color-dark;
        }
      }
    }
  }
</style>
