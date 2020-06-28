<template>
  <div class="maz-avatar-doc">
    <h3>
      Examples
    </h3>

    <ComponentContainer
      code="<template>
  <MazBtn @click=&quot;isOpen = true&quot;>
    Open Bottom Sheet
  </MazBtn>
  <MazBottomSheet v-model=&quot;isOpen&quot;>
    <div class=&quot;maz-p-6&quot;>
      <h1 class=&quot;maz-text-center maz-text-color maz-mb-6&quot;>
        Your content
      </h1>
      <div class=&quot;maz-flex maz-flex-center&quot;>
        <MazBtn
          outline
          @click=&quot;isOpen = false&quot;
        >
          Close Bottom Sheet
        </MazBtn>
      </div>
    </div>
  </MazBottomSheet>
</template>

<script>
  export default {
    data () {
      return {
        isOpen: false
      }
    }
  }
</script>"
    >
      <MazBtn @click="isOpen = true">
        Open Bottom Sheet
      </MazBtn>
      <MazBottomSheet v-model="isOpen">
        <div class="maz-p-6">
          <h1 class="maz-text-center maz-text-color maz-mb-6">
            Your content
          </h1>
          <div class="maz-flex maz-flex-center">
            <MazBtn
              outline
              @click="isOpen = false"
            >
              Close Bottom Sheet
            </MazBtn>
          </div>
        </div>
      </MazBottomSheet>
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
  <MazBottomSheet v-model=&quot;isOpen&quot;>
    Your content
  </MazBottomSheet>
</template>

<script>
  import { MazBottomSheet } from 'maz-ui'
  export default {
    components: { MazBottomSheet };
    data () {
      return {
        isOpen: true || false
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazBottomSheetDoc',
  data () {
    return {
      isOpen: false
    }
  }
}
</script>