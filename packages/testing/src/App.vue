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
      label="Select date"
      input-date-format="full"
      min-date="2022-02-03"
      max-date="2022-03-17"
      style="width: 600px"
      locale="fr-FR"
      double
      color="secondary"
      :first-day-of-week="1"
    />

    <h1>Range</h1>

    <code class="maz-mb-2">
      {{ rangeValue }}
    </code>

    <MazPicker
      v-model="rangeValue"
      label="Select date"
      input-date-format="full"
      style="width: 600px"
      locale="fr-FR"
      color="info"
      double
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

  const dateValue = ref('2022-02-12')
  const rangeValue = ref({
    start: '2022-02-01',
    end: '2022-03-23',
  })

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
