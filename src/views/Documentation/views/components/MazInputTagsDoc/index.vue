<template>
  <div class="maz-input-tags-doc">
    <ComponentContainer :code="codeExample">
      <p class="maz-mb-2">
        v-model: {{ exampleValue }}
      </p>
      <MazInputTags
        v-model="exampleValue"
        placeholder="Add tags"
        clearable
        size="lg"
        class="maz-mb-3"
      />
      <MazInputTags
        v-model="exampleValue"
        placeholder="Add tags"
        clearable
        class="maz-mb-3"
      />
      <MazInputTags
        v-model="exampleValue"
        placeholder="Add tags"
        clearable
        size="sm"
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
  <MazInputTags
    v-model=&quot;exampleValue&quot;
  />
</template>

<script>
  import { MazInputTags } from 'maz-ui'
  export default {
    components: { MazInputTags }
    data () {
      return {
        exampleValue: null
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazInputTagsDoc',
  data () {
    return {
      exampleValue: ['maz-ui', 'input', 'tags'],
      codeExample: `<template>
  <p class="mb-2">
    v-model: {{ exampleValue }}
  </p>
  <MazInputTags
    v-model="exampleValue"
    placeholder="Add tags"
    clearable
    size="lg"
    class="maz-mb-3"
  />
  <MazInputTags
    v-model="exampleValue"
    placeholder="Add tags"
    clearable
    class="maz-mb-3"
  />
  <MazInputTags
    v-model="exampleValue"
    placeholder="Add tags"
    clearable
    size="sm"
  />
</template>

export default {
  data () {
    return {
      exampleValue: ['maz-ui', 'input', 'tags']
    }
  }
}`
    }
  }
}
</script>
