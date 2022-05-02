<template>
  <main>
    <MazBtn
      data-maz-aos="scale-in"
      data-maz-aos-delay="300"
      fab
      @click="toggleTheme"
    >
      <MazIcon
        :src="hasDarkTheme ? '/maz-icons/moon.svg' : '/maz-icons/sun.svg'"
      />
    </MazBtn>

    <br />

    <!-- Start Developing Area - Do not commit anything here -->

    <p>
      {{ dateValue }}
    </p>


    <MazPicker
      v-model="rangeValues"
      label="Select date"
      format="YYYY-MM-DD"
      :first-day-of-week="1"
      locale="fr-FR"
      color="secondary"
      :min-date="minMaxDates.min"
      :max-date="minMaxDates.max"
      style="min-width: 400px;"
      double
    />

    <!-- End Developing Area -->
  </main>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { MazBtn, MazIcon, MazPicker } from 'maz-ui/package/components'
  import { aosInstance } from 'maz-ui/package/plugins'
  import { useThemeHandler, ThemeHandlerOptions } from 'maz-ui/package/helpers'

  const options: ThemeHandlerOptions = {
    storageThemeKey: 'mode',
  }

  const { autoSetTheme, toggleTheme, hasDarkTheme } = useThemeHandler(options)

  onMounted(() => {
    autoSetTheme()
    aosInstance.handleObserver()
  })

  const dateValue = ref('2022-01-03 10:10 am')
  const rangeValues = ref({ start: "2022-05-02", end: "2022-06-28" })

  const minMaxDates = ref({
    min: '2022-05-05',
    max: '2022-06-20',
  })
</script>

<style lang="postcss">
  body {
    margin: 0;
  }

  #app {
    height: 100vh;
  }
</style>

<style lang="postcss" scoped>
  main {
    @apply maz-overflow-auto maz-p-5 maz-flex maz-flex-col maz-w-full maz-items-center maz-text-normal maz-h-full;
  }
</style>
