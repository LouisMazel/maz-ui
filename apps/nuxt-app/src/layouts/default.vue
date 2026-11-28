<template>
  <div>
    <header>
      <NuxtLink :to="{ name: 'index' }" class="maz:font-mono">
        MazUi
      </NuxtLink>

      <nav>
        <MazBtn
          :to="{ name: 'index' }"
          color="transparent"
        >
          Accueil
        </MazBtn>
        <MazBtn
          :to="{ name: 'components' }"
          color="transparent"
        >
          Composants
        </MazBtn>
        <MazBtn
          :to="{ name: 'test-page' }"
          color="transparent"
        >
          Page de test
        </MazBtn>
        <MazBtn
          :to="{ name: 'icons' }"
          color="transparent"
        >
          Icônes
        </MazBtn>
        <MazBtn
          :to="{ name: 'icons-lazy' }"
          color="transparent"
        >
          Icônes lazy
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
  </div>
</template>

<style scoped>
@reference "../css/main.css";

header {
  @apply maz:flex maz:w-full maz:flex-wrap maz:items-center maz:justify-between maz:border-b maz:border-divider maz:py-4 maz:padded-container maz:sticky maz:top-0 maz:z-50 maz:bg-surface;

  nav {
    @apply maz:flex maz:gap-1;
  }
}

main {
  @apply maz:flex maz:min-h-screen maz:flex-col maz:padded-container;

  .content {
    @apply maz:flex maz:flex-1 maz:flex-col maz:py-4;
  }
}
</style>
