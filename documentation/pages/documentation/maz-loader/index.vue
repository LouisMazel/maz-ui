<template>
  <div class="maz-loader-doc">
    <ComponentContainer :code="code">
      <MazLoader />
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazLoader />
</template>

<script>
  import { MazLoader } from 'maz-ui'
  export default {
    components: { MazLoader }
  }
</script>"
    />
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
