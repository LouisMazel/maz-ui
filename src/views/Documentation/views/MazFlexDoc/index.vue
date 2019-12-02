<template>
  <div class="maz-flex-doc">
    <ComponentContainer
      :code="codeExample"
      language="html"
    >
      <h3 class="mb-3">
        Example
      </h3>
      <div class="demo">
        <MazFlex
          flex
        >
          <MazFlex flex1>
            flex-1
          </MazFlex>
          <MazFlex flex1>
            flex-1
          </MazFlex>
        </MazFlex>
        <MazFlex
          flex
          space-between
        >
          <div>
            Nike
          </div>
          <div>
            Toi
          </div>
        </MazFlex>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazFlexDoc',
    data () {
      return {
        codeExample: `<template>
  <MazFlex
    flex
  >
    <MazFlex flex1>
      flex-1
    </MazFlex>
    <MazFlex flex1>
      flex-1
    </MazFlex>
  </MazFlex>
</template>`
      }
    }
  }
</script>

<style lang="scss">
  .maz-flex-doc .demo {
    .flex {
      padding: 10px;
      background-color: yellowgreen;
      border: 1px solid white;
      color: white;
    }

    .flex-1 {
      padding: 10px;
      margin: 10px;
      background-color: dodgerblue;
      border: 1px solid white;
      color: white;
    }
  }
</style>
