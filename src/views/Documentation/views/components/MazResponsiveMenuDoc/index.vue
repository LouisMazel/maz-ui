<template>
  <div class="maz-read-more-doc">
    <ComponentContainer :code="codeExample">
      <div class="flex justify-end">
        <MazResponsiveMenu :routes="routes" />
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
export default {
  name: 'MazReadMoreDoc',
  data () {
    return {
      routes: [
        { label: 'Home', name: 'Home' },
        { label: 'Documentation', name: 'Documentation' },
        { label: 'Mad with Maz Ui', name: 'MadeWithMazUi' },
        { label: 'Responsive Menu Doc', name: 'MazResponsiveMenuDoc' }
      ],
      codeExample: `<template>
  <MazResponsiveMenu
    :routes="routes"
  />
</template>

export default {
  data () {
    return {
      routes: [
        { label: 'Home', name: 'Home' },
        { label: 'Documentation', name: 'Documentation' },
        { label: 'Mad with Maz Ui', name: 'MadeWithMazUi' },
        { label: 'Responsive Menu Doc', name: 'MazResponsiveMenuDoc' }
      ]
    }
  }
}`
    }
  }
}
</script>
