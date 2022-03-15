<template>
  <div
    class="maz-flex maz-flex-col maz-w-full maz-items-center maz-text-normal"
  >
    <MazAvatar
      data-maz-aos="scale-in"
      src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg"
    />
    <MazBtn
      style="margin-bottom: 16px"
      color="transparent"
      @click="toggleDarkMode"
    >
      Dark Switch
    </MazBtn>

    <code class="maz-mb-2">
      {{ dateValue }}
    </code>

    <!-- <MazBtn id="customElement"> {{ dateValue || 'Select Date' }} </MazBtn> -->

    <!-- <MazPicker
      v-model="dateValue"
      label="Select date"
      style="width: 400px"
      time
      hour12
      color="secondary"
    /> -->

    <!-- <MazPicker
      v-model="dateValue"
      style="width: 400px"
      label="Select date"
      :disabled-dates="['1990-02-04', '1990-02-20']"
      :disabled-hours="[0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 23]"
      hour12
      time
    /> -->

    <h1>Range</h1>

    <code class="maz-mb-2">
      {{ rangeValue }}
    </code>

    <MazPicker
      v-model="rangeValue"
      style="width: 400px"
      label="Select date"
      input-date-format="full"
      min-date="1990-02-05"
      max-date="1990-03-20"
      double
      color="info"
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
    MazAvatar,
    // MazTabsBar,
    // MazTabsContent,
    // MazTabsContentItem,
    MazPicker,
  } from 'maz-ui/package/components'
  import { aosInstance } from 'maz-ui'

  const dateValue = ref('1990-02-03')

  const rangeValue = ref({
    start: '1990-02-03',
    end: '1990-03-28',
  })

  // const tabs: MazTabsItem[] = [
  //   { label: 'First Tab', disabled: false },
  //   { label: 'Second Tab', disabled: false },
  //   { label: 'Third Tab', disabled: true },
  // ]

  onMounted(() => {
    autoSetDarkMode()
    aosInstance.handleObserver()
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
    /* align-items: flex-end; */
  }
</style>
