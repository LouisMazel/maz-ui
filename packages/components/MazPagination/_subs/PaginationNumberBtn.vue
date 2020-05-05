<template>
	<MazBtn
		class="pagination-number-btn flex align-center justify-center flex-fixed"
		:disabled="disabled"
		:class="{
			'active': active
		}"
		fab
		size="sm"
		@click="handleClick"
	>
		<slot />
	</MazBtn>
</template>

<script>
export default {
  name: 'PaginationNumberBtn',
  props: {
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
