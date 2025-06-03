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
          <ClientOnly>
            <MazDropdown
              id="dropdown"
              color="transparent"
              position="bottom right"
            >
              <span class="maz-capitalize">
                {{ theme }}
              </span>

              <template #dropdown>
                <div class="maz-grid maz-grid-cols-2">
                  <MazBtn
                    color="transparent"
                    class="maz-text-nowrap"
                    @click="autoSetTheme"
                  >
                    Auto
                  </MazBtn>
                  <MazBtn
                    color="transparent"
                    class="maz-text-nowrap"
                    @click="selectedTheme = 'dark'"
                  >
                    Dark
                  </MazBtn>
                  <MazBtn
                    color="transparent"
                    class="maz-text-nowrap"
                    @click="selectedTheme = 'light'"
                  >
                    Light
                  </MazBtn>
                  <MazBtn
                    color="transparent"
                    class="maz-text-nowrap"
                    @click="selectedTheme = 'system'"
                  >
                    System
                  </MazBtn>
                </div>
              </template>
            </MazDropdown>
          </ClientOnly>
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

const { autoSetTheme, selectedTheme, theme } = useThemeHandler()

autoSetTheme()
</script>

<style lang="postcss">
  html,
  body {
    @apply maz-h-screen maz-overflow-y-auto maz-bg-color maz-text-normal;
  }
</style>

<style lang="postcss" scoped>
  main {
    @apply maz-flex maz-min-h-screen maz-flex-col maz-padded-container;

    header {
      @apply maz-flex maz-w-full maz-flex-wrap maz-items-center maz-justify-between maz-border-b maz-border-color-lighter maz-px-2 maz-py-4;

      nav {
        @apply maz-flex maz-gap-1;
      }
    }

    .content {
      @apply maz-flex maz-flex-1 maz-flex-col maz-py-4;
    }
  }
</style>
