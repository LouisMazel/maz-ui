<template>
	<button
		class="custom-button flex flex-center"
		:class="{
			'is-dark': dark,
			'with-border': withBorder,
			'is-hover': hover,
			'is-selected': selected,
			'round': round
		}"
		tabindex="-1"
		type="button"
		@click.stop="$emit('click')"
		@focus="$emit('focus')"
		@blur="$emit('blur')"
		@mouseover="$emit('mouseover')"
		@mouseleave="$emit('mouseleave')"
	>
		<span
			:style="[bgStyle]"
			class="custom-button-effect"
		/>
		<span
			class="custom-button-content flex flex-center flex-1"
			:style="[colorStyle]"
		>
			<slot :style="[colorStyle]" />
		</span>
	</button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    color: { type: String, default: 'dodgerblue' },
    dark: { type: Boolean, default: false },
    withBorder: { type: Boolean, default: false },
    hover: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    round: { type: Boolean, default: false }
  },
  computed: {
    colorStyle () {
      const color = this.dark ? 'white' : this.color
      return {
        color: color,
        fill: color
      }
    },
    bgStyle () {
      return {
        backgroundColor: this.color
      }
    }
  }
}
</script>
