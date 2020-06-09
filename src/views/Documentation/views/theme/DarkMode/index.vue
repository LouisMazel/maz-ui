<template>
  <div class="dark-mode">
    <h2>
      Dark mode
    </h2>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      On component
    </h3>

    <p>
      You can set the <strong>dark</strong> option attributs on component. Example:
    </p>

    <CodeContainer
      :code="componentExample"
      language="html"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5">

    <h3>
      Set dark mode globally
    </h3>

    <p>
      Add <strong>.maz-is-dark</strong> class on your root HTML element. Example:
    </p>

    <CodeContainer
      code="<html class=&quot;maz-is-dark&quot;>
  <head>
    ...
  </head>
  <body>
    <div id=&quot;app&quot;>
      ...
    </div>
  </body>
</html>"
      language="html"
    />
  </div>
</template>

<script>
export default {
  name: 'DarkMode',
  data () {
    return {
      componentExample: `<template>
  <MazInput
    v-model="YOUR_VALUE"
    dark
  />
</template>`
    }
  }
}
</script>

<style lang="scss" scoped>
  .dark-mode {
    &__items {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 20px;

      h4 {
        color: $text-color !important;

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
</style>
