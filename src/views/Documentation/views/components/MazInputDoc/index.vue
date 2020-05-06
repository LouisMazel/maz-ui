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
          slot="input-icon-left"
          class="material-icons"
        >
          email
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
      />
      <MazInput
        v-model="commentValue"
        placeholder="Comment"
        autocomplete="new-comment"
        left-icon-name="comment"
        textarea
      />
    </ComponentContainer>
    <div
      v-for="type in inputTypes"
      :key="type"
      class="flex maz-mt-3 maz-flex-wrap"
    >
      <div class="flex-component maz-flex-1">
        <h3>{{ type | capitalize }}</h3>
        <ComponentContainer>
          <MazInput
            v-model="inputValue"
            :error="type === 'error'"
            :valid="type === 'valid'"
            :disabled="type === 'disabled'"
            :clearable="type === 'clearable'"
            :hint="type === 'hint' ? 'Hint value' : null"
            :loading="type === 'loading'"
            :required="type === 'required'"
            :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
          />
        </ComponentContainer>
        <ComponentContainer>
          <MazInput
            v-model="withValue"
            :error="type === 'error'"
            :valid="type === 'valid'"
            :disabled="type === 'disabled'"
            :clearable="type === 'clearable'"
            :hint="type === 'hint' ? 'Hint value' : null"
            :loading="type === 'loading'"
            :required="type === 'required'"
            :size="type === 'sm' ? 'sm' : type === 'lg' ? 'lg' : null"
          />
        </ComponentContainer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazInputDoc',
  data () {
    return {
      inputValue: null,
      withValue: 'The value entered',
      disabledValue: '',
      inputTypes: [
        'basic',
        'error',
        'valid',
        'disabled',
        'hint',
        'clearable',
        'sm',
        'lg',
        'required',
        'loading'
      ],
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
    <i
      slot="input-icon-left"
      class="material-icons"
    >
      email
    </i>
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
