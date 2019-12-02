<template>
  <div class="maz-spinner-doc flex flex--wrap">
    <div class="flex-1 mr-4">
      <ComponentContainer
        class="text-center"
      >
        <MazSpinner />
      </ComponentContainer>
    </div>
    <div class="flex-1">
      <ComponentContainer
        dark
        class="text-center"
      >
        <MazSpinner
          :size="60"
          dark
        />
      </ComponentContainer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MazSpinnerDoc'
  }
</script>
