<template>
  <MazPullToRefresh :action="action">
    <main>
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
          <MazDropdown
            id="dropdown"
            color="transparent"
            prefer-position="bottom"
            trigger="hover"
          >
            <span class="maz-capitalize">
              {{ colorMode }}
            </span>

            <template #dropdown>
              <div class="maz-grid maz-grid-cols-2">
                <MazBtn
                  color="transparent"
                  class="maz-text-nowrap"
                  @click="colorMode = 'auto'"
                >
                  Auto
                </MazBtn>
                <MazBtn
                  color="transparent"
                  class="maz-text-nowrap"
                  @click="colorMode = 'dark'"
                >
                  Dark
                </MazBtn>
                <MazBtn
                  color="transparent"
                  class="maz-text-nowrap"
                  @click="colorMode = 'light'"
                >
                  Light
                </MazBtn>
              </div>
            </template>
          </MazDropdown>
        </nav>
      </header>

      <div class="content">
        <slot />
      </div>
    </main>
  </MazPullToRefresh>
</template>

<script setup lang="ts">
import { sleep } from 'maz-ui'

function action() {
  return sleep(20000)
}

const { colorMode } = useTheme()
</script>

<style lang="postcss">
  html,
  body {
    @apply maz-h-screen maz-overflow-y-auto maz-bg-surface maz-text-foreground;
  }
</style>

<style lang="postcss" scoped>
  main {
    @apply maz-flex maz-min-h-screen maz-flex-col maz-padded-container;

    header {
      @apply maz-flex maz-w-full maz-flex-wrap maz-items-center maz-justify-between maz-border-b maz-border-divider maz-px-2 maz-py-4;

      nav {
        @apply maz-flex maz-gap-1;
      }
    }

    .content {
      @apply maz-flex maz-flex-1 maz-flex-col maz-py-4;
    }
  }
</style>
