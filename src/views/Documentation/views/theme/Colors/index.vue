<template>
  <div class="colors">
    <h2>
      Basic colors
    </h2>

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
          <h4>
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
    &__classes {
      min-width: 200px;

      p {
        margin-bottom: 10px;
      }
    }
  }
</style>
