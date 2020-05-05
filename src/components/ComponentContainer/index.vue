<template>
	<div class="component-container pos-r bg-white my-4 shadow-container">
		<div class="p-4">
			<slot />
		</div>
		<div
			v-if="code"
			class="component-container__footer border-top border-color border-top-solid"
		>
			<MazCollapse class="component-container__footer__collapse">
				<div slot="header-text">
					Show code
				</div>
				<div class="px-4">
					<CodeContainer
						:language="language"
						:code="code"
					/>
				</div>
			</MazCollapse>
		</div>
	</div>
</template>

<script>
export default {
  name: 'ComponentContainer',
  props: {
    dark: { type: Boolean, default: false },
    code: { type: String, default: null },
    language: { type: String, default: 'html' }
  },
  data() {
    return {
      showCode: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .component-container {
    color: $text-color;
    min-width: 200px;
    border-radius: $border-radius;

    &__footer {
      overflow: hidden;

      &__collapse {
        border: none;
        border-top-left-radius: 0;
        border-top-right-radius: 0;

        &.open {
          border-radius: 0;
        }
      }
    }
  }

  .is-dark .component-container,
  .is-dark.component-container {
    color: $text-color-dark;
    background-color: $bg-color-dark;
    border: $border-width solid $hover-bg-color-dark;

    .component-container__footer {
      border-color: $hover-bg-color-dark;

      &__collapse {
        border: none;
      }
    }
  }
</style>
