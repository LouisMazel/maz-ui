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

    {{ dateValue }}

    <MazPicker
      v-model="dateValue"
      label="Select date"
      format="YYYY-MM-DDThh:mm a"
      time
      :first-day-of-week="1"
      locale="fr-FR"
      color="secondary"
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

  const dateValue = ref('2022-02-03 10:00 am')
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
