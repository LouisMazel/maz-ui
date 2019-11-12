<template>
  <div class="maz-input-doc">
    <h2 class="text-center">
      Select
    </h2>
    <ComponentContainer class="p-4 m-4">
      <MazSelect
        v-model="selectValue"
        :options="options"
      />
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazInputDoc',
    data () {
      return {
        selectValue: '',
        options: [
          { label: 'None' },
          { label: 'First option', value: 'first' },
          { label: 'Second option', value: 'second' },
          { label: 'Third option', value: 'third' }
        ]
      }
    }
  }
</script>
