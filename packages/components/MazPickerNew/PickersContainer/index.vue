<template>
  <div class="pickers-container bg-color-light">
    <HeaderPicker
      :date-moment="dateMoment"
    />
    <CalendarPicker
      :date-moment="dateMoment"
    />
    <FooterPicker />
  </div>
</template>

<script>
  import HeaderPicker from './HeaderPicker'
  import CalendarPicker from './CalendarPicker'
  import FooterPicker from './FooterPicker'

  export default {
    name: 'PickersContainer',
    components: { HeaderPicker, CalendarPicker, FooterPicker },
    props: {
      dateMoment: { type: Object, required: true }
    }
  }
</script>

<style lang="scss" scoped>
  .pickers-container {
    border-radius: $border-radius;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1);
    position: absolute;
    overflow: hidden;
    z-index: 999;
  }
</style>
