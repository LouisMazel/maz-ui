<template>
	<div class="maz-input-tags-doc">
		<ComponentContainer :code="codeExample">
			<p class="mb-2">v-model: {{ exampleValue }}</p>
			<MazInputTags
				v-model="exampleValue"
				placeholder="Add tags"
				clearable
				size="lg"
				class="mb-3"
			/>
			<MazInputTags
				v-model="exampleValue"
				placeholder="Add tags"
				clearable
				class="mb-3"
			/>
			<MazInputTags
				v-model="exampleValue"
				placeholder="Add tags"
				clearable
				size="sm"
			/>
		</ComponentContainer>
	</div>
</template>

<script>
export default {
  name: 'MazInputTagsDoc',
  data() {
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
    class="mb-3"
  />
  <MazInputTags
    v-model="exampleValue"
    placeholder="Add tags"
    clearable
    class="mb-3"
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
