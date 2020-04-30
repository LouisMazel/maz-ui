<template>
  <header
    class="header bg-color flex-fixed bg-color border-color border-bottom-1 border-bottom-solid"
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
        <div class="header__title flex direction-column hidden-tablet pos-r top-4">
          <h1 class="fs-20">
            Maz UI
          </h1>
          <h2 class="fs-14 header__title__sub text-color">
            Components & CSS Library
          </h2>
        </div>
      </router-link>
      <div class="header__menu flex align-center hidden-mobile">
        <router-link
          class="header__menu__item flex align-center btn btn--white btn--md bg-transparent no-shadow mr-1"
          :to="{
            name: 'Documentation'
          }"
        >
          Documentation
        </router-link>
        <router-link
          class="header__menu__item flex align-center btn btn--white btn--md bg-transparent no-shadow mr-1"
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
    &__logo {
      text-decoration: none;

      &__img {
        width: 100px;
        height: 40px;
      }
    }

    &__menu {
      &__item {
        font-weight: 500;
        transition: all .5s;
        outline: none;

        &:focus,
        &:hover {
          background-color: $hover-color;
        }

        &.router-link-active {
          color: $primary-color;
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
      &__menu__item {
        &:focus,
        &:hover {
          background-color: $hover-color-dark;
        }
      }
    }
  }
</style>
