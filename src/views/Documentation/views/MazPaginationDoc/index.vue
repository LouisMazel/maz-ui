<template>
  <div class="maz-pagination-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazBtn
        class="mb-4"
        @click="dark = !dark"
      >
        Toggle dark mode
      </MazBtn>
      <MazPagination
        v-model="currentPage"
        :page-count="pageCount"
        :dark="dark"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazSwitchDoc',
    data () {
      return {
        dark: false,
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
