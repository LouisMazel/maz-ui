<template>
  <header
    class="header bg-color"
    role="banner"
  >
    <nav class="px-4 flex justify-content-between">
      <router-link
        :to="{
          name: 'Home'
        }"
        class="flex header__logo py-2"
      >
        <img
          class="header__logo__img mr-2"
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
      </router-link>
      <div class="header__menu flex">
        <!-- <router-link
          class="header__menu__item flex align-center"
          :to="{
            name: 'Home'
          }"
        >
          Home
        </router-link> -->
        <router-link
          class="header__menu__item flex align-center"
          :to="{
            name: 'Documentation'
          }"
        >
          Documentation
        </router-link>
      </div>
      <div class="flex align-center">
        <div class="flex align-center">
          <SocialButtons />
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
  import SocialButtons from '@/components/SocialButtons'

  export default {
    name: 'Header',
    components: {
      SocialButtons
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    border-bottom: 1px solid var(--maz-text-color-dark);

    &__logo {
      text-decoration: none;

      &__img {
        height: 50px;
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
          background-color: var(--maz-text-color-dark);
        }

        &.router-link-exact-active {
          border-bottom: 2px solid var(--maz-primary-color);
        }
      }
    }
  }
</style>
