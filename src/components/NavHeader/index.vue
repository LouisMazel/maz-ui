<template>
  <header
    class="header maz-bg-color maz-flex-fixed maz-bg-color maz-border-color maz-border-bottom-1 maz-border-bottom-solid"
    role="banner"
  >
    <nav
      class="maz-px-4 maz-flex maz-space-between"
      :class="{ 'maz-container': !isDocPage }">
      <router-link
        :to="{
          name: 'Home'
        }"
        class="maz-flex header__logo maz-py-2 maz-align-center"
      >
        <LogoSvg class="header__logo__img maz-mr-2" />
        <div
          class="header__title maz-flex maz-justify-center maz-direction-column maz-hidden-tablet maz-position-relative"
        >
          <h1 class="maz-fs-20">
            Maz UI
          </h1>
          <h2 class="maz-fs-14 header__title__sub maz-text-color">
            Components & CSS Library
          </h2>
        </div>
      </router-link>
      <div class="header__menu maz-flex maz-align-center maz-hidden-mobile">
        <router-link
          class="header__menu__item maz-btn maz-btn--white maz-no-shadow maz-bg-color maz-no-border maz-hover-bg-color maz-mr-1"
          :to="{
            name: 'Documentation'
          }"
        >
          Documentation
        </router-link>
        <router-link
          class="header__menu__item maz-btn maz-btn--white maz-no-shadow maz-bg-color maz-no-border maz-hover-bg-color"
          :to="{ name: 'MadeWithMazUi' }"
        >
          Made with Maz UI
        </router-link>
      </div>
      <div class="flex maz-align-center maz-hidden-mobile">
        <SocialButtons class="maz-hidden-laptop-s" />
      </div>
      <MazResponsiveMenu
        :routes="routes"
        class="maz-py-2 maz-show-mobile" />
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
</style>
