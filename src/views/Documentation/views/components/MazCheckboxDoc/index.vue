<template>
	<div class="maz-checkbox-doc">
		<ComponentContainer :code="codeExample">
			<MazCheckbox v-model="checkboxValue">
				Checkbox label
			</MazCheckbox>
		</ComponentContainer>
	</div>
</template>

<script>
export default {
  name: 'MazCheckboxDoc',
  data() {
    return {
      checkboxValue: false,
      codeExample: `<template>
  <MazCheckbox
    v-model="checkboxValue"
  >
    Checkbox label
  </MazCheckbox>
</template>

export default {
  data () {
    return {
      checkboxValue: false
    }
  }
}`
    }
  }
}
</script>
