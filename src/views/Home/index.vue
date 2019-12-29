<template>
  <div class="home flex-1 flex direction-column">
    <div class="home__header flex align-center justify-center p-4">
      <MazBtn
        @click="setDarkTheme(!hasDarkTheme)"
      >
        {{ modeBtnText }}
      </MazBtn>
    </div>
    <div class="home__main flex flex-1">
      <div class="home__content flex direction-column align-center justify-center p-4">
        <h2 class="mt-3 mb-2 text-center">
          A Vue.js library to build your interface
        </h2>
        <p class="mb-5 text-center">
          Components & CSS framework
        </p>
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
            class="btn btn--primary--outline"
            :to="{ name: 'MazInputDoc' }"
          >
            Components
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
  import { mapGetters, mapActions } from 'vuex'
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
      },
      modeBtnText () {
        return this.hasDarkTheme ? 'Enable Light Mode' : 'Enable Dark Mode'
      }
    },
    methods: {
      ...mapActions(['setDarkTheme'])
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
      color: $text-color;
    }

    p {
      color: $muted-color;
    }
  }

  .is-dark {
    .home {
      h2 {
        color: $text-color-dark;
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
