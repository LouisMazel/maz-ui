<template>
  <div class="maz-pagination-doc">
    <ComponentContainer :code="codeExample">
      <MazPagination
        v-model="currentPage"
        :page-count="pageCount"
      />
    </ComponentContainer>
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
