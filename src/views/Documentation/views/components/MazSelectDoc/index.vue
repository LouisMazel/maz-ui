<template>
  <div class="maz-input-doc">
    <ComponentContainer :code="codeExample">
      <MazSelect
        v-model="selectValueExample"
        placeholder="Custom label & placeholder text"
        :options="options"
      />
    </ComponentContainer>
    <div class="maz-flex maz-flex-wrap">
      <div class="maz-flex-1">
        <ComponentContainer>
          <h4 class="maz-mb-3">
            Basic
          </h4>
          <MazSelect
            v-model="selectValue"
            :options="options"
          />
        </ComponentContainer>
        <ComponentContainer>
          <h4 class="maz-mb-3">
            Error
          </h4>
          <MazSelect
            v-model="selectValue"
            :options="options"
            error
          />
        </ComponentContainer>
        <ComponentContainer>
          <h4 class="maz-mb-3">
            Valid
          </h4>
          <MazSelect
            v-model="selectValue"
            :options="options"
            valid
          />
        </ComponentContainer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazInputDoc',
  data () {
    return {
      selectValue: '',
      selectValueExample: '',
      options: [
        { label: 'None', value: null },
        { label: 'First option', value: 'first' },
        { label: 'Second option', value: 'second' },
        { label: 'Third option', value: 'third' }
      ],
      codeExample: `<template>
  <MazSelect
    v-model="selectValueExample"
    placeholder="Custom label/placeholder text"
    :options="options"
  />
</template>

export default {
  data () {
    return {
      selectValueExample: '',
      options: [
        { label: 'None', value: null },
        { label: 'First option', value: 'first' },
        { label: 'Second option', value: 'second' },
        { label: 'Third option', value: 'third' }
      ]
    }
  }
}`
    }
  }
}
</script>
