<template>
  <div class="maz-spinner-doc flex flex--wrap">
    <div class="flex-1 mr-4">
      <ComponentContainer
        class="text-center"
      >
        <MazSpinner :dark="hasDarkTheme" />
      </ComponentContainer>
    </div>
    <div class="flex-1">
      <ComponentContainer
        dark
        class="text-center"
      >
        <MazSpinner
          :size="60"
          :dark="hasDarkTheme"
        />
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'MazSpinnerDoc',
    computed: {
      ...mapGetters(['hasDarkTheme'])
    }
  }
</script>
