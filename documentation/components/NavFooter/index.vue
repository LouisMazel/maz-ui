<template>
  <footer
    class="nav-footer maz-flex-fixed maz-border-top-1 maz-border-top-solid maz-border-color"
    role="contentinfo"
  >
    <nav
      class="nav-footer-content maz-container maz-px-4 maz-flex maz-align-center maz-space-between maz-py-4"
    >
      <div class="maz-flex maz-direction-column maz-hidden-tablet">
        <RouterLink
          :to="{ name: 'Home' }"
          class="maz-mr-3"
        >
          Home
        </RouterLink>
        <RouterLink :to="{ name: 'Documentation' }">
          Documentation
        </RouterLink>
        <RouterLink :to="{ name: 'MadeWithMazUi' }">
          Made with Maz UI
        </RouterLink>
      </div>
      <div
        class="nav-footer-content__logo maz-flex maz-direction-column maz-hidden-tablet maz-align-center"
      >
        <img
          src="@/assets/img/logo-maz-ui.png"
          alt="logo-loic-mazuel"
          class="nav-footer-content__logo__img"
        />
      </div>
      <div class="maz-flex maz-align-center">
        <SocialButtons class="mr-2" />
        <VersionNumber />
      </div>
    </nav>
    <div class="nav-footer-subs maz-py-2">
      <div class="maz-px-4 maz-flex maz-justify-end">
        <a
          href="https://www.loicmazuel.com/"
          target="_blank"
          class="maz-flex"
        >
          <p class="maz-fs-14">
            © Loïc Mazuel
          </p>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
import SocialButtons from '@/components/SocialButtons'
import VersionNumber from '@/components/VersionNumber'

export default {
  name: 'NavFooter',
  components: {
    SocialButtons,
    VersionNumber
  }
}
</script>

<style lang="scss" scoped>
  .nav-footer {
    color: $border-color;
    background-color: $bg-color;

    &-subs {
      background-color: $hover-bg-color;

      a {
        color: $muted-color;
      }
    }

    &-content {
      li {
        margin-right: 15px;

        &:last-child {
          margin-right: 0;
        }
      }

      &__logo__img {
        opacity: .6;
        height: 60px;
        transition: all 300ms;

        &:hover {
          opacity: 1;
          transform: scale(1.1);
        }
      }

      @media screen and (max-width: $breakpoint-tablet) {
        flex-direction: column;

        & > * {
          margin-bottom: 20px;
        }
      }
    }
  }

  .maz-is-dark .nav-footer {
    background-color: $bg-color-dark;
    border-color: $hover-bg-color-dark;

    &-subs {
      background-color: $hover-bg-color-dark;
    }
  }
</style>
