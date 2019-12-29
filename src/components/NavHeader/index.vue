<template>
  <header
    class="header bg-color flex-fixed"
    role="banner"
  >
    <nav class="px-4 flex space-between">
      <router-link
        :to="{
          name: 'Home'
        }"
        class="flex header__logo py-2 align-center"
      >
        <img
          class="header__logo__img mr-2"
          alt="Vue logo"
          src="@/assets/img/logo-base-dodgerblue.png"
        >
        <div class="header__title flex direction-column hidden-tablet">
          <h1 class="fs-20">
            Maz UI
          </h1>
          <p class="fs-14 header__title__sub">
            Components & CSS Library
          </p>
        </div>
      </router-link>
      <div class="header__menu flex">
        <router-link
          class="header__menu__item flex align-center home"
          :to="{
            name: 'Home'
          }"
        >
          Home
        </router-link>
        <router-link
          class="header__menu__item flex align-center"
          :to="{
            name: 'Documentation'
          }"
        >
          Documentation
        </router-link>
      </div>
      <div class="flex align-center hidden-mobile">
        <div class="flex align-center">
          <MazSwitch
            v-model="darkTheme"
            class="mr-2"
          />
          <SocialButtons class="mr-2" />
          <VersionNumber />
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
  import SocialButtons from '@/components/SocialButtons'
  import VersionNumber from '@/components/VersionNumber'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Header',
    components: {
      SocialButtons,
      VersionNumber
    },
    computed: {
      ...mapGetters(['hasDarkTheme']),
      darkTheme: {
        get () {
          return this.hasDarkTheme
        },
        set (val) {
          return this.setDarkTheme(val)
        }
      }
    },
    methods: {
      ...mapActions(['setDarkTheme'])
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    background-color: $bg-color;
    border-bottom: 1px solid $hover-color;

    &__logo {
      text-decoration: none;

      &__img {
        height: 40px;
      }
    }

    &__menu {
      &__item {
        text-decoration: none;
        padding: 0 20px;
        border-bottom: 2px solid transparent;
        transition: all 0.5s;
        outline: none;

        &:focus,
        &:hover {
          background-color: $hover-color;
        }

        &.router-link-exact-active.home {
          border-bottom: 2px solid $primary-color;
        }

        &.router-link-active:not(.home) {
          border-bottom: 2px solid $primary-color;
        }
      }
    }

    &__title {
      &__sub {
        color: $muted-color;
      }
    }
  }

  .is-dark {
    .header {
      background-color: $bg-color-dark;
      border-color: $hover-color-dark;

      &__title__sub {
        color: $text-color-dark;
      }

      &__menu__item {
        &:focus,
        &:hover {
          background-color: $hover-color-dark;
        }
      }
    }
  }
</style>
