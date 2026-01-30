<script setup lang="ts">
import { sleep } from 'maz-ui'

function action() {
  return sleep(2000)
}
</script>

<template>
  <MazPullToRefresh :on-click="action">
    <header>
      <NuxtLink :to="{ name: 'index' }">
        MazUi
      </NuxtLink>

      <nav>
        <MazBtn
          :to="{ name: 'index' }"
          color="transparent"
        >
          Home
        </MazBtn>
        <MazBtn
          :to="{ name: 'test-page' }"
          color="transparent"
        >
          Test page
        </MazBtn>
        <LangSwitcher />
        <ThemeSwitcher />
      </nav>
    </header>

    <main>
      <div class="content">
        <slot />
      </div>
    </main>
  </MazPullToRefresh>
</template>

<style scoped>
header {
  @apply maz-flex maz-w-full maz-flex-wrap maz-items-center maz-justify-between maz-border-b maz-border-divider maz-px-2 maz-py-4 maz-padded-container;

  nav {
    @apply maz-flex maz-gap-1;
  }
}

main {
  @apply maz-flex maz-min-h-screen maz-flex-col maz-padded-container;

  .content {
    @apply maz-flex maz-flex-1 maz-flex-col maz-py-4;
  }
}
</style>
