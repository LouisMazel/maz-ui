<template>
  <header class="header bg-color">
    <div class="px-4 p-2 flex align-center justify-content-between">
      <a
        href="#"
        class="flex logo"
      >
        <img
          class="header__logo mr-2"
          alt="Vue logo"
          src="@/assets/img/logo.png"
        >
        <div class="header__title flex flex-direction-column">
          <h1 class="fs-20">
            Vue Mazel Ui
          </h1>
          <p class="fs-14 text-muted">
            Components & CSS Library
          </p>
        </div>
      </a>
      <div class="flex">
        <div class="flex align-center mr-4">
          <p class="fs-14 mr-2">
            Dark mode
          </p>
          <MazCheckbox
            v-model="darkMode"
          />
        </div>
        <a
          href="https://www.loicmazuel.com/"
          target="_blank"
          class="flex"
        >
          <div class="header__title flex flex-direction-column flex-end">
            <h3>
              Made by LouisMazel
            </h3>
            <p class="fs-14 text-muted">
              With VueJS
            </p>
          </div>
        </a>
      </div>
    </div>
  </header>
</template>

<script>
  import MazCheckbox from '@/packages/MazCheckbox/_main.vue'

  export default {
    name: 'Header',
    components: {
      MazCheckbox
    },
    data () {
      return {
        darkMode: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    border-bottom: 1px solid var(--second-color);

    a.logo {
      text-decoration: none;
    }

    &__logo {
      height: 50px;
    }
  }
</style>
