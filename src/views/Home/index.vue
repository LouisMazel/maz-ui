<template>
  <div class="home flex-1 flex direction-column">
    <div class="container flex-1 flex direction-column align-center justify-center py-4">
      <img
        class="home__logo"
        src="@/assets/img/logo-base-dodgerblue.png"
        alt="maz ui logo"
      >
      <h2 class="mt-3 mb-2 text-center">
        A Vue.js library to build your interface
      </h2>
      <p class="mb-5 text-center">
        Components & CSS framework
      </p>
      <CodeContainer
        language="bash"
        code="npm i maz-ui -S"
        class="mb-5"
      />
      <div class="flex align-start flex--wrap my-3 align-center justify-center">
        <router-link
          class="btn btn--primary--outline mr-3"
          :to="{ name: 'Install' }"
        >
          Installation
        </router-link>
        <router-link
          class="btn btn--primary--outline mr-3"
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
      <div class="flex align-start flex--wrap mt-3 align-center justify-center">
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
    <NavFooter />
  </div>
</template>

<script>
  import NavFooter from '@/components/NavFooter'

  export default {
    name: 'Home',
    components: {
      NavFooter
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    // background-image: linear-gradient(to right top, dodgerblue, #00B7FF, #00D4E0, #00E688, #A8EB12);

    &__logo {
      max-height: 120px;
      max-width: 100%;
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
