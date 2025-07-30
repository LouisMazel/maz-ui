<script setup lang="ts">
import { MazTrash } from '@maz-ui/icons'

const { message, success, error, info, warning } = useToast()

function showToast() {
  message(`Hello, <strong>world</strong>!`, {
    position: 'top-right',
    html: true,
    maxToasts: 2,
    queue: true,
  })
  info('Hello, world!', {
    position: 'bottom-right',
  })
  warning('Hello, world!', {
    position: 'bottom-left',
  })
  error('Hello, world!', {
    position: 'bottom',
  })
  success('Hello, world!', {
    position: 'top-left',
  })
  message('Hello, world!', {
    position: 'top',
    buttons: [
      {
        text: 'Click me',
        color: 'warning',
        rightIcon: MazTrash,
      },
    ],
  })
}
</script>

<template>
  <div class="maz-flex maz-h-full maz-flex-col">
    <nav class="maz-flex maz-h-16 maz-flex-none maz-items-center maz-gap-4 maz-border-b maz-p-4 maz-padded-container">
      <MazLink to="/" color="contrast">
        Home
      </MazLink>
      <MazLink to="/about" color="contrast">
        About
      </MazLink>

      <div class="maz-flex-1" />
      <ThemeSwitcher />
      <LangSwitcher />
      <MazBtn @click="showToast">
        Show Toast
      </MazBtn>
    </nav>

    <main class="maz-flex-1 maz-overflow-auto maz-py-8 maz-padded-container">
      <RouterView />
    </main>
  </div>
</template>
