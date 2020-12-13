<template>
  <div class="maz-flex-doc">
    <ComponentContainer
      :code="codeExample"
      language="html"
    >
      <h4 class="maz-mb-3">
        Example
      </h4>
      <div class="demo">
        flex
        <MazFlex flex>
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex align-center
        <MazFlex
          flex
          align-center
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex
        <MazFlex flex>
          <div>
            div 1
          </div>
          <MazFlex flex1>
            flex-1
          </MazFlex>
          <div>
            div 2
          </div>
        </MazFlex>
        flex
        <MazFlex flex>
          <MazFlex flex1>
            flex-1
          </MazFlex>
          <MazFlex flex1>
            flex-1
          </MazFlex>
        </MazFlex>
        flex space-between
        <MazFlex
          flex
          space-between
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex space-around
        <MazFlex
          flex
          space-around
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex justify-end
        <MazFlex
          flex
          justify-end
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex justify-center
        <MazFlex
          flex
          justify-center
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex direction-column
        <MazFlex
          flex
          direction-column
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex direction-column
        <MazFlex
          flex
          direction-column-reverse
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex direction-column align-start
        <MazFlex
          flex
          direction-column-reverse
          align-start
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
        flex direction-column align-end
        <MazFlex
          flex
          direction-column-reverse
          align-end
        >
          <div>
            div 1
          </div>
          <div>
            div 2
          </div>
        </MazFlex>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h4>
      How to use it ?
    </h4>

    <CodeContainer
      language="html"
      code="<template>
  <MazFlex />
</template>

<script>
  import { MazFlex } from 'maz-ui'
  export default {
    components: { MazFlex }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazFlexDoc',
  data () {
    return {
      codeExample: `<template>
  <div class="demo">
    flex
    <MazFlex
      flex
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex align-center
    <MazFlex
      flex
      align-center
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex
    <MazFlex
      flex
    >
      <div>
        div 1
      </div>
      <MazFlex flex1>
        flex-1
      </MazFlex>
      <div>
        div 2
      </div>
    </MazFlex>
    flex
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
    flex space-between
    <MazFlex
      flex
      space-between
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex space-around
    <MazFlex
      flex
      space-around
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex justify-end
    <MazFlex
      flex
      justify-end
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex justify-center
    <MazFlex
      flex
      justify-center
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex direction-column
    <MazFlex
      flex
      direction-column
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex direction-column
    <MazFlex
      flex
      direction-column-reverse
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex direction-column align-start
    <MazFlex
      flex
      direction-column-reverse
      align-start
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
    flex direction-column align-end
    <MazFlex
      flex
      direction-column-reverse
      align-end
    >
      <div>
        div 1
      </div>
      <div>
        div 2
      </div>
    </MazFlex>
  </div>
</template>`
    }
  }
}
</script>

<style lang="scss">
  .maz-flex-doc .demo {
    .maz-flex {
      padding: 10px;
      background-color: $secondary-color;
      color: white;
      border-radius: var(--border-radius);
    }

    .maz-flex-1 {
      padding: 10px;
      background-color: dodgerblue;
      color: white;
      border: var(--border-width) solid white;
      border-radius: var(--border-radius);
    }

    & div {
      background-color: dodgerblue;
      padding: 10px;
      border: var(--border-width) solid white;
      border-radius: var(--border-radius);
    }
  }
</style>
