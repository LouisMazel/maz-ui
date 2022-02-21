<template>
  <div
    class="maz-flex maz-flex-col maz-w-full maz-items-center maz-text-normal-text"
  >
    <MazBtn style="margin-bottom: 16px" @click="toggleDarkMode">
      Dark Switch
    </MazBtn>

    <code class="maz-mb-2">
      {{ dateValue }}
    </code>

    <!-- <MazBtn id="customElement"> {{ dateValue || 'Select Date' }} </MazBtn> -->

    <MazPicker
      v-model="dateValue"
      label="Select date time"
      input-date-format="full"
      min-date="2022-02-04"
      max-date="2022-03-20"
      locale="fr-FR"
      double
      inline
      color="secondary"
      list-position="bottom left"
      :first-day-of-week="1"
    />

    <!-- <div style="position: relative; width: 500px">
      <MazTabsBar :items="tabs" color="secondary" />

      <MazTabsContent>
        <MazTabsContentItem :tab="1">
          <p>evzionfez</p>
        </MazTabsContentItem>
        <MazTabsContentItem :tab="2">
          <p>evzionfez</p>
        </MazTabsContentItem>
      </MazTabsContent>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  // import { MazTabsItem } from 'maz-ui/package/components/MazTabsBar.vue'
  import {
    MazBtn,
    // MazTabsBar,
    // MazTabsContent,
    // MazTabsContentItem,
    MazPicker,
  } from 'maz-ui/package/components'

  const dateValue = ref('2022-02-18')

  // const tabs: MazTabsItem[] = [
  //   { label: 'First Tab', disabled: false },
  //   { label: 'Second Tab', disabled: false },
  //   { label: 'Third Tab', disabled: true },
  // ]

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
    padding: 40px;
    height: 100vh;
  }
</style>
