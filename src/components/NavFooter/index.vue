<template>
  <footer
    class="nav-footer flex-fixed"
    role="contentinfo"
  >
    <nav class="nav-footer-content container px-4 flex align-center space-between py-4">
      <div class="flex direction-column hidden-tablet">
        <RouterLink
          :to="{ name: 'Home' }"
          class="mr-3"
        >
          Home
        </RouterLink>
        <RouterLink
          :to="{ name: 'Documentation' }"
        >
          Documentation
        </RouterLink>
        <RouterLink
          :to="{ name: 'MadeWithMazUi' }"
        >
          Made with Maz UI
        </RouterLink>
      </div>
      <div class="nav-footer-content__logo direction-column hidden-tablet flex align-center">
        <img
          src="@/assets/img/logo-maz-ui.png"
          alt="logo-loic-mazuel"
          class="nav-footer-content__logo__img"
        >
      </div>
      <div class="flex align-center">
        <SocialButtons class="mr-2" />
        <VersionNumber />
      </div>
    </nav>
    <div class="nav-footer-subs py-2">
      <div class="px-4 flex justify-end">
        <a
          href="https://www.loicmazuel.com/"
          target="_blank"
          class="flex"
        >
          <p class="fs-14">
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
    border-top: 1px solid $text-color-dark;
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

  .is-dark .nav-footer {
    background-color: $bg-color-dark;
    border-color: $hover-bg-color-dark;

    &-subs {
      background-color: $hover-bg-color-dark;
    }
  }
</style>
