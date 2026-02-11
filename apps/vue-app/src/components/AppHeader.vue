<template>
  <nav class="maz-flex maz-h-16 maz-flex-none maz-items-center maz-gap-4 maz-border-b maz-p-4 maz-padded-container">
    <MazLink to="/" color="contrast">
      Home
    </MazLink>
    <MazLink to="/about" color="contrast">
      About
    </MazLink>
    <MazLink to="/color" color="contrast">
      Color
    </MazLink>

    <div class="maz-flex-1" />
    <ThemeSwitcher />
    <LangSwitcher />
  </nav>
</template>
