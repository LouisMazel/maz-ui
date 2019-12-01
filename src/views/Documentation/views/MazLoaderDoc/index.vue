<template>
  <div class="maz-loader-doc">
    <ComponentContainer :code="code">
      <MazLoader />
    </ComponentContainer>
    <ComponentContainer
      dark
      :code="code2"
    >
      <MazLoader dark />
    </ComponentContainer>
    <ComponentContainer dark>
      <MazLoader />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazLoaderDoc',
    data () {
      return {
        code: `<template>
  <MazLoader />
</template>`,
        code2: `<template>
  <MazLoader dark />
</template>`
      }
    }
  }
</script>
