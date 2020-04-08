<template>
  <header
    class="header bg-color flex-fixed"
    role="banner"
  >
    <nav
      class="px-4 flex space-between"
      :class="{ container: !isDocPage }"
    >
      <router-link
        :to="{
          name: 'Home'
        }"
        class="flex header__logo py-2 align-center"
      >
        <LogoSvg class="header__logo__img mr-2" />
        <div class="header__title flex direction-column hidden-tablet">
          <h1 class="fs-20">
            Maz UI
          </h1>
          <p class="fs-14 header__title__sub">
            Components & CSS Library
          </p>
        </div>
      </router-link>
      <div class="header__menu flex hidden-mobile">
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
        <router-link
          class="header__menu__item flex align-center"
          :to="{ name: 'MadeWithMazUi' }"
        >
          Made with Maz UI
        </router-link>
      </div>
      <div class="flex align-center hidden-mobile">
        <SocialButtons class="hidden-laptop-s" />
      </div>
      <MazResponsiveMenu
        :routes="routes"
        class="py-2 show-mobile"
      />
    </nav>
    <DarkSwitchBanner />
  </header>
</template>

<script>
  import LogoSvg from '@/components/LogoSvg'
  import SocialButtons from '@/components/SocialButtons'
  import DarkSwitchBanner from '@/components/DarkSwitchBanner'

  export default {
    name: 'Header',
    components: {
      LogoSvg,
      SocialButtons,
      DarkSwitchBanner
    },
    data () {
      return {
        routes: [
          { label: 'Home', name: 'Home' },
          { label: 'Documentation', name: 'Documentation' },
          { label: 'Mad with Maz Ui', name: 'MadeWithMazUi' }
        ]
      }
    },
    computed: {
      isDocPage () {
        return this.$route.matched.some(m => m.name === 'Documentation')
      }
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
        width: 100px;
        height: 40px;
      }
    }

    &__menu {
      &__item {
        text-decoration: none;
        padding: 0 20px;
        border-bottom: 2px solid transparent;
        transition: all .5s;
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
