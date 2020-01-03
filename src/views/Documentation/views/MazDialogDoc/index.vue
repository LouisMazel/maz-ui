<template>
  <div class="maz-dialog-doc">
    <ComponentContainer :code="codeExample">
      <div class="flex">
        <MazBtn
          class="mr-2"
          @click.stop="hasDialogOpen = true"
        >
          Open Basic Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpen"
          max-width="800px"
          persistent
          hide-footer
        >
          <div slot="title">
            Dropzone Dialog
          </div>
          <MazDropzone
            ref="mazDropzone"
            :url="url"
            :headers="headers"
            :max-filesize="maxFilesize"
          />
        </MazDialog>
        <MazBtn
          color="success"
          class="mr-2"
          @click="hasDialogOpenSuccess = true"
        >
          Open Success Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpenSuccess"
          success
        >
          <div slot="title">
            Success Dialog
          </div>
          Dialog Content Success
        </MazDialog>
        <MazBtn
          color="danger"
          @click="hasDialogOpenDanger = true"
        >
          Open Danger Dialog
        </MazBtn>
        <MazDialog
          v-model="hasDialogOpenDanger"
          danger
        >
          <div slot="title">
            Danger Dialog
          </div>
          Dialog Content Danger
        </MazDialog>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazDialogDoc',
    data () {
      return {
        hasDialogOpen: false,
        hasDialogOpenDanger: false,
        hasDialogOpenSuccess: false,
        url: 'https://httpbin.org/post',
        headers: { 'My-Awesome-Header': 'header value' },
        maxFilesize: 2,
        errorMessage: null,
        successMessage: null,
        codeExample: `<template>
  <MazBtn
    class="mr-2"
    @click="hasDialogOpen = true"
  >
    Open Basic Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpen"
  >
    <div slot="title">
      Basic Dialog
    </div>
    Dialog Content Basic
  </MazDialog>
  <MazBtn
    color="success"
    class="mr-2"
    @click="hasDialogOpenSuccess = true"
  >
    Open Success Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpenSuccess"
    success
  >
    <div slot="title">
      Success Dialog
    </div>
    Dialog Content Success
  </MazDialog>
  <MazBtn
    color="danger"
    @click="hasDialogOpenDanger = true"
  >
    Open Danger Dialog
  </MazBtn>
  <MazDialog
    v-model="hasDialogOpenDanger"
    danger
  >
    <div slot="title">
      Danger Dialog
    </div>
    Dialog Content Danger
  </MazDialog>
</template>

export default {
  data () {
    return {
      hasDialogOpen: false,
      hasDialogOpenDanger: false,
      hasDialogOpenSuccess: false
    }
  }
}`
      }
    }
  }
</script>
