<template>
	<div class="maz-btn-doc">
		<ComponentContainer
			:code="codeExample"
			language="html"
			class="btn-container"
		>
			<h4 class="mb-3">
				Example
			</h4>
			<MazBtn>
				Primary default
			</MazBtn>
			<MazBtn rounded>
				Primary default
			</MazBtn>
			<MazBtn outline>
				Primary default
			</MazBtn>
			<MazBtn fab>
				fab
			</MazBtn>
			<MazBtn loading>
				Primary loading
			</MazBtn>
			<MazBtn disabled>
				Primary disabled
			</MazBtn>
			<MazBtn block>
				Primary block
			</MazBtn>
			<MazBtn href="/#/documentation/btn">
				It's a link
			</MazBtn>
		</ComponentContainer>
		<ComponentContainer>
			<h4 class="mb-3">
				Basic
			</h4>
			<div
				v-for="type in btnTypes"
				:key="`normal-${type}`"
				class="btn-container"
			>
				<MazBtn
					v-for="size in btnSizes"
					:key="`normal-${type}-${size}`"
					:size="size"
					:color="type"
				>
					{{ type }} {{ size }}
				</MazBtn>
			</div>
		</ComponentContainer>
		<ComponentContainer>
			<h4 class="mb-3">
				Outline
			</h4>
			<div
				v-for="type in btnTypes"
				:key="`ountline-${type}`"
				class="btn-container"
			>
				<MazBtn
					v-for="size in btnSizes"
					:key="`outline-${type}-${size}`"
					:size="size"
					:color="type"
					outline
				>
					{{ type }} {{ size }}
				</MazBtn>
			</div>
		</ComponentContainer>
		<ComponentContainer>
			<h4 class="mb-3">
				Rounded
			</h4>
			<div
				v-for="type in btnTypes"
				:key="`rounded-${type}`"
				class="btn-container"
			>
				<MazBtn
					v-for="size in btnSizes"
					:key="`rounded-${type}-${size}`"
					:size="size"
					:color="type"
					rounded
				>
					{{ type }} {{ size }}
				</MazBtn>
			</div>
		</ComponentContainer>
		<ComponentContainer>
			<h4 class="mb-3">
				Fab
			</h4>
			<div
				v-for="type in btnTypes"
				:key="`fab-${type}`"
				class="btn-container">
				<MazBtn
					v-for="size in btnSizes"
					:key="`fab-${type}-${size}`"
					:size="size"
					:color="type"
					fab
				>
					{{ size || 'default' }}
				</MazBtn>
			</div>
		</ComponentContainer>
		<ComponentContainer>
			<h4 class="mb-3">
				loading
			</h4>
			<div
				v-for="type in btnTypes"
				:key="`loading-${type}`"
				class="btn-container"
			>
				<MazBtn
					v-for="size in btnSizes"
					:key="`loading-${size}`"
					:size="size"
					:color="type"
					loading
				>
					loading {{ size }}
				</MazBtn>
			</div>
		</ComponentContainer>
		<ComponentContainer>
			<h4 class="mb-3">
				Disabled
			</h4>
			<div class="btn-container">
				<MazBtn
					v-for="size in btnSizes"
					:key="`loading-${size}`"
					:size="size"
					disabled
					outline
				>
					Disabled {{ size }}
				</MazBtn>
			</div>
		</ComponentContainer>
	</div>
</template>

<script>
export default {
  name: 'MazBtnDoc',
  data() {
    return {
      btnTypes: [
        'primary',
        'secondary',
        'third',
        'success',
        'danger',
        'warning',
        'grey',
        'info',
        'light',
        'dark',
        'default',
        'white',
        'black'
      ],
      btnSizes: ['lg', '', 'md', 'sm', 'mini'],
      codeExample: `<template>
  <MazBtn>
    Primary default
  </MazBtn>
  <MazBtn
    rounded
  >
    Primary default
  </MazBtn>
  <MazBtn
    outline
  >
    Primary default
  </MazBtn>
  <MazBtn
    fab
  >
    fab
  </MazBtn>
  <MazBtn
    loading
  >
    Primary loading
  </MazBtn>
  <MazBtn
    disabled
  >
    Primary disabled
  </MazBtn>
  <MazBtn
    block
  >
    Primary block
  </MazBtn>
  <MazBtn
    href="/#/documentation/btn"
  >
    It's a link
  </MazBtn>
</template>`
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-container {
  * {
    margin: 5px;
  }
}
</style>
