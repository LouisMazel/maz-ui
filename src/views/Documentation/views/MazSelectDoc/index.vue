<template>
  <div class="maz-input-doc">
    <h2>
      {{ this.$route.name.substring(3).slice(0, -3) }}
    </h2>
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
