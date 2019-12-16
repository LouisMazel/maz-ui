<template>
  <div class="maz-btn-doc">
    <ComponentContainer
      :code="codeExample"
      language="html"
      class="btn-container"
    >
      <h3 class="mb-3">
        Example
      </h3>
      <MazBtnGroup
        v-model="btnGroupValue"
        :items="items"
      />
      <MazBtnGroup
        v-model="btnGroupValueBoolean"
        :items="itemsBoolean"
        color="info"
      />
      <MazBtnGroup
        v-model="btnGroupValueString"
        :items="itemsString"
        rounded
        color="success"
      />
      <MazBtnGroup
        v-model="btnGroupValue"
        :items="items"
        disabled
        rounded
      />

      <p>Number value : {{ btnGroupValue }}</p>
      <p>Boolean value : {{ btnGroupValueBoolean }}</p>
      <p>String value : {{ btnGroupValueString || 'null' }}</p>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazBtnGroupDoc',
    data () {
      return {
        btnGroupValue: 1,
        btnGroupValueBoolean: false,
        btnGroupValueString: null,
        items: [
          { label: 'Number 1', value: 1 },
          { label: 'Number 2', value: 2 },
          { label: 'Number 3', value: 3 }
        ],
        itemsBoolean: [
          { label: 'Boolean true', value: true },
          { label: 'Boolean false', value: false }
        ],
        itemsString: [
          { label: 'String foo', value: 'foo' },
          { label: 'String bar', value: 'bar' },
          { label: 'String toto', value: 'toto' },
          { label: 'String tata', value: 'tata' }
        ],
        codeExample: `<template>
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
  />
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
    color="info"
  />
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
    rounded
    color="success"
  />
  <MazBtnGroup
    v-model="btnGroupValue"
    :items="items"
    disabled
    rounded
  />
</template>

export default {
  data () {
    return {
      btnGroupValue: 1,
      items: [
        { label: 'button 1', value: 1 },
        { label: 'button 2', value: 2 },
        { label: 'button 3', value: 3 }
      ]
    }
  }
}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn-container {
    .maz-btn-group {
      margin-bottom: 20px;
    }
  }
</style>
