<template>
	<div
		:class="{'is-dark': dark}"
		class="week-days flex"
	>
		<div
			v-for="(weekDay, index) in weekDays"
			:key="index"
			class="flex-1 text-muted fs-12 flex flex-center week-days-container"
		>
			{{ weekDay }}
		</div>
	</div>
</template>

<script>
export default {
  name: 'WeekDays',
  props: {
    weekDays: { type: Array, required: true },
    dark: { type: Boolean, default: null }
  }
}
</script>
