<template>
  <main>
    <MazBtn
      style="margin-bottom: 16px"
      color="transparent"
    >
      Dark Switch
    </MazBtn>

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



    <!-- End Developing Area -->
  </main>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { MazBtn, MazPicker } from 'maz-ui/package/components'
  import { aosInstance } from 'maz-ui/package/plugins'

  const rangeValue = ref({
    start: '1990-02-03',
    end: '1990-03-28',
  })

  onMounted(() => {
    aosInstance.handleObserver()
  })

  const dateValue = ref<string>('2022-03-25')
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
<style lang="postcss" scoped>
  main {
    @apply maz-overflow-auto maz-p-5 maz-flex maz-flex-col maz-w-full maz-items-center maz-text-normal maz-h-full;
  }
</style>
