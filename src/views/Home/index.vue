<template>
  <div class="home flex-1 flex direction-column">
    <div class="home__main flex flex-1 container flex-center">
      <div class="home__content flex direction-column justify-center p-4">
        <h2 class="mb-2">
          A library to build your interfaces with <span class="text-primary">Vue.JS & Nuxt.JS</span>
        </h2>
        <h3 class="subtitle mb-5">
          UI Components & CSS framework
        </h3>
        <div class="flex flex-center direction-column">
          <CodeContainer
            language="bash"
            code="npm i maz-ui -S"
            class="mb-4"
          />
          <div class="flex align-start flex--wrap my-3 align-center justify-center">
            <router-link
              class="btn btn--primary--outline mr-2 mb-2"
              :to="{ name: 'Install' }"
            >
              Installation
            </router-link>
            <router-link
              class="btn btn--primary--outline mr-2 mb-2"
              :to="{ name: 'GetStarted' }"
            >
              Get started
            </router-link>
            <router-link
              class="btn btn--primary--outline mr-2"
              :to="{ name: 'MazInputDoc' }"
            >
              Components
            </router-link>
            <router-link
              class="btn btn--primary--outline mr-2"
              :to="{ name: 'Theme' }"
            >
              Theme
            </router-link>
          </div>
          <div class="flex align-start flex--wrap align-center justify-center">
            <a
              class="btn btn--dark--outline mr-4"
              href="https://github.com/LouisMazel/maz-ui"
              target="_blank"
            >
              Github
            </a>
            <a
              class="btn btn--danger--outline"
              href="https://www.npmjs.com/package/maz-ui"
              target="_blank"
            >
              NPM
            </a>
          </div>
        </div>
      </div>
      <div class="home__illu-container flex align-center justify-center p-4">
        <img
          class="home__illu-container__illu"
          :src="illuPath"
          alt="maz ui logo"
        >
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
        return this.hasDarkTheme ? require('@/assets/img/maz-ui-illu-dark.png') : require('@/assets/img/maz-ui-illu.png')
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
    }

    h3.subtitle {
      color: $primary-color;
    }
  }

  .is-dark {
    .home {
      h2 {
        color: $text-color-dark;
      }

      h3.subtitle {
        color: $primary-color !important;
      }

      .btn--dark--outline {
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
