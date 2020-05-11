<template>
  <div class="maz-avatar-doc">
    <h3>
      Examples
    </h3>
    <ComponentContainer
      code="<template>
  <MazAvatar
    src=&quot;http://www.placecage.com/80/80&quot;
  />

  <MazAvatar
    src=&quot;http://www.placecage.com/120/120&quot;
    :size=&quot;120&quot;
    editable
    bordered
    @edit=&quot;editPicture&quot;
  />

  <MazAvatar
    src=&quot;http://www.placecage.com/160/160&quot;
    url=&quot;http://www.placecage.com/160/160&quot;
    target=&quot;_blank&quot;
    no-elevation
    square
    :size=&quot;160&quot;
  />
</template>

<script>
  export default {
    methods: {
      editPicture () {
        console.log('edit picture')
      }
    }
  }
</script>"
      language="html"
    >
      <div class="maz-flex maz-flex-wrap">
        <div class="demo maz-flex-1 maz-flex maz-direction-column maz-align-center">
          <MazAvatar
            src="http://www.placecage.com/80/80"
          />
          <h4 class="maz-my-3 maz-text-center">
            Default
          </h4>
          <h5 class="maz-mb-3 maz-text-center">
            Just the src image path provide
          </h5>
          <p>
            <strong>Options:</strong> none
          </p>
        </div>
        <div class="demo maz-flex-1 maz-flex maz-direction-column maz-align-center">
          <MazAvatar
            src="http://www.placecage.com/120/120"
            editable
            bordered
            :size="120"
            @edit="editPicture"
          />
          <h4 class="maz-my-3 maz-text-center">
            Editable
          </h4>
          <h5 class="maz-mb-3 maz-text-center">
            On hover: Add an "edit" layer & on click return <strong>@edit</strong> event on click
          </h5>
          <p>
            <strong>Options:</strong> editable - bordered - src="PATH" - size="120"
          </p>
        </div>
        <div class="demo maz-flex-1 maz-flex maz-direction-column maz-align-center">
          <MazAvatar
            src="http://www.placecage.com/160/160"
            url="http://www.placecage.com/160/160"
            target="_blank"
            no-elevation
            square
            :size="160"
          />
          <h4 class="maz-my-3 maz-text-center">
            Square & link avatar
          </h4>
          <h5 class="maz-mb-3 maz-text-center">
            The avatar becomes a link to the url you gave
          </h5>
          <p>
            <strong>Options:</strong> square - src="PATH" - url="URL" - size="160" - target="_blank" - no-elevation
          </p>
        </div>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>
    <CodeContainer
      language="html"
      class="maz-mb-0"
      code="<template>
  <MazAvatar />
</template>

<script>
  import { MazAvatar } from 'maz-ui'
  export default {
    components: { MazAvatar }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazAvatarDoc',
  methods: {
    editPicture () {
      console.log('edit picture')
    }
  }
}
</script>

<style lang="scss" scoped>
  .demo {
    margin: 20px;
    min-width: 265px;
  }
</style>