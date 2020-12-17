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
          class="maz-elevation maz-p-5 maz-border-radius maz-flex maz-flex-center"
          :class="`maz-bg-${name}`"
        >
          <h5
            :class="[{
              'text-white': name === 'black' || name === 'dark' || name === 'primary'
            }, name]"
          >
            {{ value }}
          </h5>
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
        { name: 'dark', value: '#21222E' },
        { name: 'default', value: '#CCC' },
        { name: 'white', value: 'white' },
        { name: 'black', value: 'black' },
        { name: 'transparent', value: 'transparent' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .colors {
    &__items {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 20px;

      h5 {
        color: #212121 !important;

        &.text-white {
          color: white !important;
        }
      }

      @media screen and (max-width: $breakpoint-laptop-m) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media screen and (max-width: $breakpoint-laptop-s) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  .maz-is-dark {
    .transparent {
      color: var(--maz-text-color-dark) !important;
    }
  }
</style>
