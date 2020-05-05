<template>
  <div class="maz-loader-doc">
    <ComponentContainer :code="code">
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
</template>`
    }
  }
}
</script>
