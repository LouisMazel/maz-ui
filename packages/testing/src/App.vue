<template>
  <div
    class="maz-flex maz-flex-col maz-w-full maz-flex-center maz-text-normal-text"
  >
    <MazBtn style="margin-bottom: 16px" @click="toggleDarkMode">
      Dark Switch
    </MazBtn>

    <MazPhoneNumberInput v-model="phoneNumber" />

    <div style="position: relative; width: 500px">
      <MazTabsBar :items="tabs" color="secondary" />

      <MazTabsContent>
        <MazTabsContentItem :tab="1">
          <p>evzionfez</p>
        </MazTabsContentItem>
        <MazTabsContentItem :tab="2">
          <p>evzionfez</p>
        </MazTabsContentItem>
      </MazTabsContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { MazTabsItem } from 'maz-ui/package/components/MazTabsBar.vue'
  import {
    MazBtn,
    MazTabsBar,
    MazTabsContent,
    MazTabsContentItem,
    MazPhoneNumberInput,
  } from 'maz-ui/package/components'

  const tabs: MazTabsItem[] = [
    { label: 'First Tab', disabled: false },
    { label: 'Second Tab', disabled: false },
    { label: 'Third Tab', disabled: true },
  ]

  const phoneNumber = ref('0657574372')

  onMounted(() => {
    autoSetDarkMode()
  })

  const autoSetDarkMode = () => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  const toggleDarkMode = () => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    }
  }
</script>

<style>
  body {
    margin: 0;
  }

  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>
