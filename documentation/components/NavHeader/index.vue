<template>
  <header
    class="header maz-flex-fixed maz-bg-color maz-border-color maz-border-bottom-1 maz-border-bottom-solid"
    role="banner"
  >
    <nav
      :class="[isDocPage ? 'maz-px-4' : 'maz-container' ]"
      class="maz-flex maz-space-between"
    >
      <NuxtLink
        :to="{
          name: 'index'
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
          <h2 class="maz-fs-14 header__title__sub maz-text-muted">
            UI Components Library
          </h2>
        </div>
      </NuxtLink>
      <div class="maz-flex-1" />
      <div
        role="navigation"
        class="header__menu maz-flex maz-align-center maz-hidden-mobile"
      >
        <MazBtn
          color="transparent"
          no-shadow
          class="header__menu__item maz-mr-1"
          :to="{
            name: 'documentation'
          }"
        >
          Documentation
        </MazBtn>
        <MazBtn
          color="transparent"
          no-shadow
          class="header__menu__item maz-mr-1"
          :to="{ name: 'made-with-maz-ui' }"
        >
          Made with Maz UI
        </MazBtn>
        <MazBtn
          color="third"
          class="header__menu__item maz-mr-1 --no-color"
          href="https://louismazel.github.io/maz-ui-3/"
          target="_blank"
        >
          v3.x
        </MazBtn>
      </div>
      <div class="maz-flex maz-align-center maz-hidden-mobile">
        <SocialButtons class="maz-ml-1 maz-hidden-laptop-s" />
      </div>
      <MazResponsiveMenu
        :routes="routes"
        class="maz-py-2 maz-show-mobile"
        role="navigation"
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
        { label: 'Home', name: 'index' },
        { label: 'Documentation', name: 'documentation-get-started' },
        { label: 'Mad with Maz Ui', name: 'made-with-maz-ui' }
      ]
    }
  },
  computed: {
    isDocPage () {
      return this.$route.matched.some(m => m.name === 'documentation')
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    z-index: 10;

    nav {
      transition: all 500ms ease-in-out;
    }

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
        outline: none;

        &:not(.--no-color) {
          color: var(--maz-text-color);
        }

        &.nuxt-link-active {
          color: var(--maz-primary) !important;
        }
      }
    }
  }
</style>
