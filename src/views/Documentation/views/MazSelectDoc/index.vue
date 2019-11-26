<template>
  <div class="maz-input-doc">
    <ComponentContainer>
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
