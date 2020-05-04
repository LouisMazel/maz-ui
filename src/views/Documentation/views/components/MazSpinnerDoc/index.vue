<template>
  <div class="maz-spinner-doc flex flex--wrap">
    <div class="flex-1 mr-4">
      <ComponentContainer
        :code="code1"
      >
        <div class="text-center">
          <MazSpinner
            v-for="color in colors"
            :key="`spinner-${color}`"
            :color="color"
          />
        </div>
      </ComponentContainer>
    </div>
    <div class="flex-1">
      <ComponentContainer
        dark
        :code="code2"
      >
        <div class="flex flex-center">
          <MazSpinner
            v-for="size in sizes"
            :key="`spinner-${size}`"
            :size="size"
          />
        </div>
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazSpinnerDoc',
    data () {
      return {
        colors: [
          'primary', 'secondary', 'third', 'success', 'danger', 'warning', 'grey', 'info', 'light', 'dark', 'default', 'white', 'black'
        ],
        sizes: [
          20, 40, 60, 80, 100, 120, 140
        ],
        code1: `<MazSpinner
  :color="YOUR_COLOR"
/>`,
        code2: `<MazSpinner
  :size="YOUR_SIZE"
/>`
      }
    }
  }
</script>
