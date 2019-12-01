<template>
  <footer
    class="nav-footer flex-fixed"
    role="contentinfo"
  >
    <nav class="nav-footer-content container flex align-center justify-content-between py-4">
      <div class="flex flex-direction-column">
        <RouterLink
          :to="{ name: 'Documentation' }"
        >
          Documentation
        </RouterLink>
      </div>
      <div class="nav-footer-content__logo">
        <img
          src="@/assets/img/logo.png"
          alt="logo-loic-mazuel"
          class="nav-footer-content__logo__img"
        >
      </div>
      <div class="flex align-center">
        <SocialButtons />
        <VersionNumber />
      </div>
    </nav>
    <div class="nav-footer-subs py-2">
      <div class="container flex flex-end">
        <a
          href="https://www.loicmazuel.com/"
          target="_blank"
          class="flex align-center"
        >
          <p class="fs-14">
            © Loïc Mazuel | Website made with VueJS
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
    color: var(--maz-third-color);
    border-top: 1px solid var(--maz-text-color-dark);

    &-subs {
      background-color: var(--maz-text-color-dark);

      a {
        color: var(--maz-muted-color);
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
        opacity: 0.6;
        height: 60px;
        transition: all 300ms;

        &:hover {
          opacity: 1;
          transform: scale(1.1);
        }
      }

      @media screen and (max-width: var(--maz-breakpoint-tablet)) {
        flex-direction: column;

        & > * {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
