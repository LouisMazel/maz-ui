<template>
  <div class="maz-pagination-doc">
    <ComponentContainer :code="codeExample">
      <MazPagination
        v-model="currentPage"
        :page-count="pageCount"
      />
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
  <MazPagination
    v-model=&quot;currentPage&quot;
    :page-count=&quot;pageCount&quot;
  />
</template>

<script>
  import { MazPagination } from 'maz-ui'
  export default {
    components: { MazPagination }
    data () {
      return {
        currentPage: 0,
        pageCount: 32
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazSwitchDoc',
  data () {
    return {
      currentPage: 11,
      pageCount: 32,
      codeExample: `<template>
  <MazPagination
    v-model="currentPage"
    :page-count="pageCount"
  />
</template>

export default {
  data () {
    return {
      currentPage: 4,
      pageCount: 32
    }
  }
}`
    }
  }
}
</script>
