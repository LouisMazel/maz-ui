<template>
  <div class="colors">
    <h2>
      Basic colors
    </h2>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <div
      class="colors__items maz-mb-4"
    >
      <div
        v-for="({ name, value }, i) in colors"
        :key="i"
        class="colors__items__color maz-mb-3"
      >
        <h4 class="maz-mb-3">
          {{ name | capitalize }}
        </h4>
        <div
          class="colors__items__color__item maz-elevation maz-border-radius maz-flex maz-flex-center"
          :class="`maz-bg-${name}`"
        >
          <h4
            :class="{
              'text-white': name === 'black' || name === 'dark'
            }"
          >
            {{ value }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Colors',
  data () {
    return {
      colors: [
        { name: 'primary', value: 'dodgerblue' },
        { name: 'secondary', value: '#1CD1A1' },
        { name: 'third', value: '#C41AF9' },
        { name: 'success', value: 'yellowgreen' },
        { name: 'danger', value: 'orangered' },
        { name: 'warning', value: '#FFA300' },
        { name: 'grey', value: '#999' },
        { name: 'info', value: '#17A2B8' },
        { name: 'light', value: 'whitesmoke' },
        { name: 'dark', value: '#24292E' },
        { name: 'default', value: '#CCC' },
        { name: 'white', value: 'white' },
        { name: 'black', value: 'black' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .colors {
    &__items {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      grid-gap: 20px;

      &__color__item {
        height: 82px;
      }

      h4 {
        color: $text-color !important;

        &.text-white {
          color: white !important;
        }
      }

      @media screen and (max-width: $breakpoint-laptop-m) {
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
      }

      @media screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      }
    }
  }
</style>
