<template>
	<pre
		v-highlightjs="code"
		class="code-container"
	>
    <code
      class="code-container__content"
      :class="[language]"
    >
      <slot />
    </code>
  </pre>
</template>

<script>
export default {
  name: 'CodeContainer',
  props: {
    code: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    dark: { type: Boolean, default: false }
  }
}
</script>
