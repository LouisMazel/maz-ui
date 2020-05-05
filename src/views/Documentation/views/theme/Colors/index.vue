<template>
  <div class="colors">
    <h2>
      Basic colors
    </h2>

    <div class="flex my-5">
      <div class="flex-1 text-center">
        <h3>
          Color Name
        </h3>
      </div>
      <div class="flex-1 text-center">
        <h3>
          Helper classes
        </h3>
      </div>
    </div>

    <div
      v-for="(color, i) in colors"
      :key="i"
      class="colors__item mb-4"
    >
      <h4 class="mb-3">
        {{ color | capitalize}}
      </h4>
      <div class="flex flex--wrap">
        <div
          class="elevation p-5 border-radius flex-33"
          :class="`bg-${color}`"
        />
        <div
          class="colors__classes flex-1 px-5"
        >
          <p :class="`fs-16 text-${color}`">{{ `text-${color}` }}</p>
          <p :class="`fs-16 bg-${color}`">{{ `bg-${color}` }}</p>
          <p :class="`fs-16 border-${color} border-solid border-width`">{{ `border-${color}` }} (with border-solid border-width) </p>
          <div class="flex">
            <p class="mr-2 fs-16">{{ `focus-bg-${color}` }}</p> <button :class="`fs-16 focus-bg-${color}`">Focus me</button>
          </div>
          <div class="flex">
            <p class="mr-2 fs-16">{{ `hover-bg-${color}` }}</p> <button :class="`fs-16 hover-bg-${color}`">Hover me</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Colors',
  data() {
    return {
      colors: ['primary', 'secondary', 'third', 'success', 'danger', 'warning', 'grey', 'info', 'light', 'dark', 'default', 'white', 'black']
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
