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

    <!-- Start Developing Area -->

    {{ dateValue }}

    <MazPicker v-model="dateValue" format="DD-MM-YYYY" :first-day-of-week="1" style="min-width: 300px;" />

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

  const dateValue = ref()
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
