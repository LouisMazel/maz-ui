<template>
  <div class="maz-input-doc">
    <ComponentContainer :code="codeExample">
      <MazInput
        v-model="exampleValue"
        clearable
        placeholder="Custom label & placeholder text"
      />
    </ComponentContainer>
    <ComponentContainer :code="codePasswordExample">
      <form>
        <MazInput
          v-model="nameValue"
          placeholder="Name"
          autocomplete="new-name"
          class="maz-mb-3"
          left-icon-name="person"
          right-icon-name="favorite"
          clearable
        />
        <MazInput
          v-model="emailValue"
          placeholder="E-mail"
          autocomplete="new-email"
          class="maz-mb-3"
          clearable
        >
          <i
            slot="icon-left"
            class="material-icons"
          >
            email
          </i>
          <i
            slot="icon-right"
            class="material-icons"
          >
            done
          </i>
        </MazInput>

        <MazInput
          v-model="passwordValue"
          placeholder="Password"
          type="password"
          autocomplete="new-password"
          left-icon-name="lock"
          class="maz-mb-3"
          clearable
        >
          <i
            slot="icon-right"
            class="material-icons"
          >
            done
          </i>
        </MazInput>
        <MazInput
          v-model="commentValue"
          placeholder="Comment"
          autocomplete="new-comment"
          left-icon-name="comment"
          textarea
        />
      </form>
    </ComponentContainer>


    <h3>Colors</h3>

    <ComponentContainer
      v-model="inputValue"
      class="maz-flex-1 maz-mr-2"
      code="<template>
  <MazInput
    :color=&quot;YOUR_COLOR&quot;
  />
</template>"
    >
      <div class="maz-flex maz-flex-wrap">
        <MazInput
          v-for="color in inputColors"
          :key="color"
          v-model="inputValue"
          :color="color"
          left-icon-name="email"
          right-icon-name="check"
          :placeholder="color"
          class="maz-mr-2 maz-mb-2"
        />
      </div>
      <p>
        <strong>Colors list:</strong>
        {{ inputColors }}
      </p>
    </ComponentContainer>

    <div
      v-for="type in inputTypes"
      :key="type"
    >
      <div class="flex-component">
        <h3>{{ type | capitalize }}</h3>
        <div class="maz-flex maz-flex-wrap">
          <ComponentContainer class="maz-flex-1 maz-mr-2">
            <MazInput
              v-model="inputValue"
              :error="type === 'error'"
              :warning="type === 'warning'"
              :success="type === 'valid'"
              :disabled="type === 'disabled'"
              :clearable="type === 'clearable'"
              :textarea="type === 'textarea'"
              :hint="type === 'hint' ? 'Hint value' : null"
              :loading="type === 'loading'"
              :required="type === 'required'"
              :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
            />
          </ComponentContainer>
          <ComponentContainer class="maz-flex-1">
            <MazInput
              v-model="withValue"
              :error="type === 'error'"
              :warning="type === 'warning'"
              :success="type === 'valid'"
              :disabled="type === 'disabled'"
              :clearable="type === 'clearable'"
              :textarea="type === 'textarea'"
              :hint="type === 'hint' ? 'Hint value' : null"
              :loading="type === 'loading'"
              :required="type === 'required'"
              :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
            />
          </ComponentContainer>
        </div>
      </div>
    </div>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazInput
    v-model=&quot;exampleValue&quot;
  />
</template>

<script>
  import { MazInput } from 'maz-ui'
  export default {
    components: { MazInput }
    data () {
      return {
        exampleValue: null
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
import { COLORS } from '@/constantes'
export default {
  name: 'MazInputDoc',
  data () {
    return {
      inputValue: null,
      withValue: 'The value entered',
      disabledValue: '',
      inputTypes: [
        'basic',
        'sm',
        'lg',
        'error',
        'warning',
        'valid',
        'disabled',
        'hint',
        'clearable',
        'required',
        'loading',
        'textarea'
      ],
      inputColors: COLORS,
      exampleValue: null,
      nameValue: 'your name',
      emailValue: 'youremail@domain.com',
      passwordValue: 'password',
      commentValue: 'Your comment',
      codeExample: `<template>
  <MazInput
    v-model="exampleValue"
    placeholder="Custom placeholder/placeholder text"
  />
</template>

export default {
  data () {
    return {
      exampleValue: ''
    }
  }
}`,
      codePasswordExample: `<template>
  <MazInput
    v-model="nameValue"
    placeholder="Name"
    autocomplete="new-name"
    class="maz-mb-3"
    left-icon-name="person"
    right-icon-name="favorite"
    clearable
  />
  <MazInput
    v-model="emailValue"
    placeholder="E-mail"
    autocomplete="new-email"
    class="maz-mb-3"
    clearable
  >
    <MazInput
      v-model="emailValue"
      placeholder="E-mail"
      autocomplete="new-email"
      class="maz-mb-3"
      clearable
    >
      <i
        slot="icon-left"
        class="material-icons"
      >
        lock
      </i>
      <i
        slot="icon-right"
        class="material-icons"
      >
        email
      </i>
    </MazInput>
  </MazInput>
  <MazInput
    v-model="passwordValue"
    placeholder="Password"
    type="password"
    autocomplete="new-password"
    left-icon-name="lock"
    clearable
  />
  <MazInput
    v-model="commentValue"
    placeholder="Comment"
    autocomplete="new-comment"
    left-icon-name="comment"
    textarea
  />
</template>

export default {
  data () {
    return {
      nameValue: 'your name',
      emailValue: 'youremail@domain.com',
      passwordValue: 'password',
      commentValue: 'Your comment'
    }
  }
}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .maz-input-doc {
    .flex {
      &-component {
        margin: 5px;
        min-width: 250px;
      }
    }
  }
</style>
