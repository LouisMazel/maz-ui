<template>
  <div
    ref="mazSelectElement"
    v-click-outside="closeList"
    class="m-select"
    :class="[
      { '--is-open': hasListOpened, '--disabled': disabled, '--block': block },
      props.class,
      `--${size}`,
    ]"
    :style="style"
  >
    <MazInput
      :id="instanceId"
      ref="mazInputComponent"
      class="m-select-input"
      v-bind="$attrs"
      :required="required"
      :border-active="listOpened"
      :color="color"
      :model-value="mazInputValue"
      autocomplete="off"
      :size="size"
      block
      :disabled="disabled"
      @focus.prevent.stop="openList"
      @click.prevent.stop="openList"
      @blur.prevent.stop="closeList"
      @change="emits('change', $event)"
      @keydown="mainInputKeyboardHandler"
    >
      <template #right-icon>
        <button
          tabindex="-1"
          type="button"
          class="m-select-input__toggle-button maz-custom"
          :aria-label="`${hasListOpened ? 'collapse' : 'expand'} list of options`"
          @click.stop="toggleList"
        >
          <ChevronDownIcon class="m-select-chevron maz-text-xl" />
        </button>
      </template>
    </MazInput>
    <Transition :name="listTransition">
      <div
        v-if="hasListOpened"
        ref="optionsListElement"
        class="m-select-list"
        :class="{
          '--top': listPosition.includes('top'),
          '--left': listPosition.includes('left'),
          '--right': listPosition.includes('right'),
          '--bottom': listPosition.includes('bottom'),
        }"
        :style="{
          maxHeight: `${maxListHeight}px`,
          maxWidth: `${maxListWidth}px`,
        }"
      >
        <MazInput
          v-if="search"
          ref="searchInputComponent"
          v-model="searchQuery"
          size="sm"
          :color="color"
          :placeholder="searchPlaceholder"
          name="search"
          autocomplete="off"
          tabindex="-1"
          class="m-select-list__search-input maz-flex-none"
          :left-icon="SearchIcon"
          @keydown="keyboardHandler"
          @update:model-value="tmpModelValueIndex = 0"
        />
        <!--
          @slot No results slot - Displayed when no results corresponding with search query
        -->
        <slot v-if="!optionsList || optionsList.length <= 0" name="no-results">
          <span class="m-select-list__no-results">
            <NoSymbolIcon class="maz-h-6 maz-w-6 maz-text-normal" />
          </span>
        </slot>
        <div v-else class="m-select-list__scroll-wrapper" tabindex="-1">
          <template v-for="(option, i) in optionsList" :key="i">
            <!--
              @slot Custom optgroup label
                @binding {String} label - the label of the optgroup
            -->
            <slot v-if="option.label && option.isOptGroup" name="optgroup" :label="option.label">
              <span class="m-select-list-optgroup">
                {{ option.label }}
              </span>
            </slot>

            <button
              v-else
              tabindex="-1"
              type="button"
              class="m-select-list-item maz-custom maz-flex-none"
              :class="[
                {
                  '--is-keyboard-selected': tmpModelValueIndex === i,
                  '--is-selected': isSelectedOption(option),
                  '--is-none-value': isNullOrUndefined(option[optionValueKey]),
                },
              ]"
              :style="itemHeight ? { height: `${itemHeight}px` } : undefined"
              @click.prevent.stop="updateValue(option)"
            >
              <MazCheckbox
                v-if="multiple"
                tabindex="-1"
                :model-value="isSelectedOption(option)"
                size="sm"
                :color="color"
              />
              <!--
                @slot Custom option
                  @binding {Object} option - the option object
                  @binding {Boolean} is-selected - if the option is selected
              -->
              <slot :option="option" :is-selected="isSelectedOption(option)">
                <span>
                  {{ option[optionLabelKey] }}
                </span>
              </slot>
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    onBeforeMount,
    nextTick,
    defineAsyncComponent,
    defineOptions,
    type StyleValue,
  } from 'vue'
  import MazInput from './MazInput.vue'
  import type { Color, ModelValueSimple, Position, Size } from './types'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { debounceCallback } from '../modules/helpers/debounce-callback'
  import { vClickOutside } from '../modules/directives/click-outside'
  import { useStringMatching } from '../modules/composables/use-string-matching'

  export type NormalizedOption = Record<string, ModelValueSimple>
  export type MazSelectOptionWithOptGroup = {
    label: string
    options: (NormalizedOption | string | number | boolean)[]
  }
  export type MazSelectOption =
    | NormalizedOption
    | string
    | number
    | boolean
    | MazSelectOptionWithOptGroup

  export type { Color, Size, ModelValueSimple, Position }

  const MazCheckbox = defineAsyncComponent(() => import('./MazCheckbox.vue'))

  const SearchIcon = defineAsyncComponent(() => import('./../icons/magnifying-glass.svg'))
  const ChevronDownIcon = defineAsyncComponent(() => import('./../icons/chevron-down.svg'))
  const NoSymbolIcon = defineAsyncComponent(() => import('./../icons/no-symbol.svg'))

  defineOptions({
    inheritAttrs: false,
  })

  export type Props = {
    /** The style of the select */
    style?: StyleValue
    /** The class of the select */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class?: any
    /** The id of the select */
    id?: string
    /** The value of the select */
    modelValue?: ModelValueSimple | ModelValueSimple[]
    /** The options of the select */
    options?: MazSelectOption[]
    /** The key of the option value */
    optionValueKey?: string
    /** The key of the option label */
    optionLabelKey?: string
    /** The key of the option input value */
    optionInputValueKey?: string
    /** The position of the list */
    listPosition?: Position
    /** The height of the option list item */
    itemHeight?: number
    /** The max height of the option list */
    maxListHeight?: number
    /** The max width of the option list */
    maxListWidth?: number
    /** The size of the select */
    size?: Size
    /** The color of the select */
    color?: Color
    /** Display search input in option list */
    search?: boolean
    /** The placeholder of the search input */
    searchPlaceholder?: string
    /** if true, the option list is opened by default */
    open?: boolean
    /** Enable the multiple selection */
    multiple?: boolean
    /** Make the input required in the form */
    required?: boolean
    /** Disable the component */
    disabled?: boolean
    /** The input will be displayed in full width */
    block?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    class: undefined,
    style: undefined,
    modelValue: undefined,
    optionValueKey: 'value',
    optionLabelKey: 'label',
    optionInputValueKey: 'label',
    listPosition: 'bottom left',
    itemHeight: undefined,
    maxListHeight: 240,
    maxListWidth: undefined,
    size: 'md',
    color: 'primary',
    searchPlaceholder: 'Search in options',
    options: undefined,
  })

  const emits = defineEmits<{
    /** On list is closed
     * @event 'close'
     * @property {Event} value - the event
     */
    (event: 'close', value?: Event): void
    /** On list is opened
     * @event 'open'
     * @property {boolean} value - if the list is opened or not
     */
    (event: 'open', value?: boolean): void
    /** On input blur
     * @event 'blur'
     * @property {Event} value - the event
     */
    (event: 'blur', value?: Event): void
    /** On input focus
     * @event 'focus'
     * @property {Event} value - the event
     */
    (event: 'focus', value?: Event): void
    /** On input change value
     * @event 'change'
     * @property {Event} value - the event
     */
    (event: 'change', value?: Event): void
    /** On model value update, returns the new value
     * @event 'update:model-value'
     * @property {ModelValueSimple | ModelValueSimple[]} value - the new value
     */
    (event: 'update:model-value', value: ModelValueSimple | ModelValueSimple[]): void
    /** On selected value, returns the option object
     * @event 'selected-option'
     * @property {MazSelectOption} value - the option object
     */
    (event: 'selected-option', option: MazSelectOption): void
  }>()

  const listOpened = ref(false)
  const tmpModelValueIndex = ref<number>()

  const isBlackOrTransparentColor = computed(() =>
    ['black', 'transparent', 'white'].includes(props.color),
  )

  const selectedTextColor = computed(() =>
    isBlackOrTransparentColor.value
      ? `var(--maz-color-black)`
      : `var(--maz-color-${props.color}-800)`,
  )
  const selectedBgColor = computed(() =>
    isBlackOrTransparentColor.value
      ? 'var(--maz-color-muted)'
      : `var(--maz-color-${props.color}-100)`,
  )
  const keyboardSelectedBgColor = computed(() =>
    isBlackOrTransparentColor.value
      ? 'var(--maz-color-muted)'
      : `var(--maz-color-${props.color}-200)`,
  )

  const hasListOpened = computed(() => listOpened.value || props.open)

  const instanceId = useInstanceUniqId({
    componentName: 'MazSelect',
    providedId: props.id,
  })

  function getOptionPayload(option: string | number | boolean): NormalizedOption {
    return {
      [props.optionValueKey]: option,
      [props.optionLabelKey]: option,
      [props.optionInputValueKey]: option,
    }
  }
  function getNormalizedOptionPayload(option: NormalizedOption): NormalizedOption {
    return {
      ...option,
      [props.optionValueKey]: option[props.optionValueKey],
      [props.optionLabelKey]: option[props.optionLabelKey],
      [props.optionInputValueKey]: option[props.optionInputValueKey],
    }
  }

  const optionsNormalized = computed<NormalizedOption[]>(() => {
    const normalizedOptions: NormalizedOption[] = []

    if (!props.options?.length) {
      return []
    }

    for (const option of props.options) {
      if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
        normalizedOptions.push(getOptionPayload(option))
      } else if ('options' in option && Array.isArray(option.options)) {
        normalizedOptions.push(
          { label: option.label, isOptGroup: true },
          ...option.options.map((opt) =>
            typeof opt === 'string' || typeof opt === 'number' || typeof opt === 'boolean'
              ? getOptionPayload(opt)
              : getNormalizedOptionPayload(opt),
          ),
        )
      } else {
        normalizedOptions.push(getNormalizedOptionPayload(option as NormalizedOption))
      }
    }

    return normalizedOptions
  })

  const selectedOptions = computed(
    () =>
      optionsNormalized.value?.filter((option) => {
        return props.multiple
          ? Array.isArray(props.modelValue)
            ? props.modelValue.includes(option[props.optionValueKey]) &&
              !isNullOrUndefined(option[props.optionValueKey])
            : false
          : props.modelValue === option[props.optionValueKey] &&
              !isNullOrUndefined(option[props.optionValueKey])
      }) ?? [],
  )

  onBeforeMount(() => {
    if (!props.options?.length) {
      console.warn('[maz-ui](MazSelect) you must provide options')
    }

    updateTmpModelValueIndex()
  })

  const mazSelectElement = ref<HTMLDivElement>()
  const mazInputComponent = ref<typeof MazInput>()
  const searchInputComponent = ref<typeof MazInput>()
  const optionsListElement = ref<HTMLDivElement>()

  const isNullOrUndefined = (value: unknown) => {
    return value === undefined || value === null
  }

  function isSelectedOption(option: NormalizedOption) {
    const hasOption =
      selectedOptions.value?.some(
        (selectedOption) => selectedOption[props.optionValueKey] === option[props.optionValueKey],
      ) ?? false

    return hasOption && !isNullOrUndefined(option[props.optionValueKey])
  }

  const mazInputValue = computed(() => {
    if (props.multiple && props.modelValue && Array.isArray(props.modelValue)) {
      return props.modelValue
        .map(
          (value) =>
            optionsNormalized.value?.find((option) => option[props.optionValueKey] === value)?.[
              props.optionInputValueKey
            ],
        )
        .join(', ')
    }

    const selectedOption = optionsNormalized.value?.find(
      (option) => option[props.optionValueKey] === props.modelValue,
    )

    return isNullOrUndefined(props.modelValue)
      ? undefined
      : selectedOption?.[props.optionInputValueKey]
  })

  const listTransition = computed(() =>
    props.listPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert',
  )

  const searchQuery = ref<string>('')
  const query = ref<string>('')

  function normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .replaceAll(/[^\dA-Za-z\u0400-\u04FF]/g, '')
  }

  const searchInValue = (value?: ModelValueSimple, query?: string) => {
    return (
      query &&
      value &&
      normalizeString(value.toString().toLocaleLowerCase().trim()).includes(
        normalizeString(query.toLocaleLowerCase().trim()),
      )
    )
  }

  function getFilteredOptionWithQuery(query: string) {
    return query
      ? optionsNormalized.value?.filter((option) => {
          const searchValue = option[props.optionLabelKey]
          const searchValue3 = option[props.optionValueKey]
          const searchValue2 = option[props.optionInputValueKey]

          return (
            searchInValue(searchValue, query) ||
            searchInValue(searchValue2, query) ||
            searchInValue(searchValue3, query) ||
            (typeof searchValue === 'string' &&
              useStringMatching(searchValue, query).isMatching.value) ||
            (typeof searchValue2 === 'string' &&
              useStringMatching(searchValue2, query).isMatching.value) ||
            (typeof searchValue3 === 'string' &&
              useStringMatching(searchValue3, query).isMatching.value)
          )
        })
      : optionsNormalized.value
  }

  const optionsList = computed(() => getFilteredOptionWithQuery(searchQuery.value))

  async function closeList(event?: Event) {
    if (!hasListOpened.value) return
    if (
      event &&
      (('relatedTarget' in event &&
        mazSelectElement.value?.contains(event.relatedTarget as Node)) ||
        event.type === 'keydown')
    ) {
      return event.preventDefault()
    }

    await nextTick()
    listOpened.value = false
    tmpModelValueIndex.value = 0
    emits('close', event)
  }

  async function openList(event?: Event) {
    if (props.disabled || hasListOpened.value) return

    event?.preventDefault()
    listOpened.value = true
    await scrollToOptionIndex()
    emits('focus', event)
    emits('open', listOpened.value)
  }

  function focusMainInput() {
    ;(mazInputComponent.value?.$el as HTMLElement).querySelector('input')?.focus()
  }

  function toggleList(event: Event) {
    listOpened.value ? closeList(event) : focusMainInput()
  }

  function focusSearchInputAndSetQuery(q: string) {
    searchQuery.value = q
    ;(searchInputComponent.value?.$el as HTMLElement).querySelector('input')?.focus()
  }

  function searchOptionWithQuery(keyPressed: string) {
    if (keyPressed === 'Backspace' && query.value.length > 0) {
      query.value = query.value.slice(0, -1)
    } else {
      query.value += keyPressed
    }

    const filteredOptions = getFilteredOptionWithQuery(query.value)

    if (filteredOptions?.length) {
      tmpModelValueIndex.value = optionsList.value?.findIndex(
        (option) => option[props.optionValueKey] === filteredOptions[0][props.optionValueKey],
      )

      if (typeof tmpModelValueIndex.value === 'number' && tmpModelValueIndex.value >= 0) {
        scrollToOptionIndex(tmpModelValueIndex.value)
      }
    }

    debounceCallback(() => {
      query.value = ''
    }, 1000)
  }

  const mainInputKeyboardHandler = (event: KeyboardEvent) => {
    const keyPressed = event.key

    if (/^[\dA-Za-z\u0400-\u04FF]$/.test(keyPressed)) {
      event.preventDefault()
      openList(event)

      props.search ? focusSearchInputAndSetQuery(keyPressed) : searchOptionWithQuery(keyPressed)
    } else {
      keyboardHandler(event)
    }
  }

  const keyboardHandler = (event: KeyboardEvent) => {
    const code = event.code

    const isArrow = ['ArrowUp', 'ArrowDown'].includes(code)
    const shouldSelect = ['Enter', 'Space'].includes(code)
    const shouldCloseList = 'Escape' === code && hasListOpened.value

    if (isArrow) {
      arrowHandler(event, tmpModelValueIndex.value)
    } else if (shouldSelect) {
      enterHandler(event, tmpModelValueIndex.value)
    } else if (shouldCloseList) {
      closeList()
    }
  }

  const arrowHandler = (event: KeyboardEvent, currentIndex?: number) => {
    event.preventDefault()
    const code = event.code

    if (!hasListOpened.value) openList(event)

    const optionsLength = optionsList.value?.length

    if (!optionsLength) {
      return
    }

    if (typeof currentIndex === 'number') {
      if (currentIndex === optionsLength - 1 && code === 'ArrowDown') {
        tmpModelValueIndex.value = 0
      } else if (currentIndex === 0 && code === 'ArrowUp') {
        tmpModelValueIndex.value = optionsLength - 1
      } else {
        tmpModelValueIndex.value = code === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1
      }
    } else {
      tmpModelValueIndex.value = code === 'ArrowDown' ? 0 : optionsLength - 1
    }

    scrollToOptionIndex(tmpModelValueIndex.value)
  }

  const enterHandler = (event: KeyboardEvent, currentIndex?: number) => {
    event.preventDefault()

    if (!hasListOpened.value) {
      return openList(event)
    }

    const newValue = currentIndex
      ? optionsList.value?.[currentIndex] ?? optionsList.value?.[0]
      : optionsList.value?.[0]

    if (!isNullOrUndefined(newValue)) {
      updateValue(newValue as Record<string, ModelValueSimple>)
    }
  }

  async function scrollToOptionIndex(index?: number) {
    await nextTick()

    if (typeof index !== 'number') {
      updateTmpModelValueIndex()
    }

    const selectedIndex = index ?? tmpModelValueIndex.value

    if (typeof selectedIndex === 'number' && selectedIndex >= 0) {
      optionsListElement.value
        ?.querySelectorAll('.m-select-list-item')
        [selectedIndex]?.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center',
        })
    }
  }

  function updateTmpModelValueIndex(inputOption?: NormalizedOption) {
    const index = optionsList.value?.findIndex((option) => {
      if (props.multiple && Array.isArray(props.modelValue)) {
        if (inputOption) {
          return inputOption[props.optionValueKey] === option[props.optionValueKey]
        }
        const values = [...props.modelValue].reverse()
        return values[0] === option[props.optionValueKey]
      } else {
        return selectedOptions.value?.[0]?.[props.optionValueKey] === option[props.optionValueKey]
      }
    })

    tmpModelValueIndex.value = index && index >= 0 ? index : 0
  }

  const updateValue = (inputOption: NormalizedOption, mustCloseList = true) => {
    if (mustCloseList && !props.multiple) {
      nextTick(() => closeList())
    }

    searchQuery.value = ''

    const isAlreadySelected = selectedOptions.value?.some(
      (option) => option[props.optionValueKey] === inputOption[props.optionValueKey],
    )

    let newValue = selectedOptions.value

    if (isAlreadySelected && props.multiple) {
      newValue = newValue?.filter(
        (option) => option[props.optionValueKey] !== inputOption[props.optionValueKey],
      )
    } else if (props.multiple) {
      newValue.push(inputOption)
    } else {
      newValue = [inputOption]
    }

    const selectedValues = newValue.map((option) => option[props.optionValueKey])

    emits('update:model-value', props.multiple ? selectedValues : selectedValues[0])
    emits('selected-option', inputOption)
    updateTmpModelValueIndex(inputOption)
    focusMainInput()
  }
</script>

<style lang="postcss" scoped>
  .m-select {
    @apply maz-relative maz-inline-flex maz-align-top;

    &.--mini {
      @apply maz-text-xs;
    }

    &.--xs {
      @apply maz-text-xs;
    }

    &.--sm {
      @apply maz-text-sm;
    }

    &.--md {
      @apply maz-text-base;
    }

    &.--lg {
      @apply maz-text-lg;
    }

    &.--xl {
      @apply maz-text-xl;
    }

    &.--block {
      @apply maz-w-full;
    }

    &:not(.--disabled):deep(.m-input-input) {
      @apply maz-cursor-pointer;
    }

    &-input:deep(.m-input-input) {
      @apply maz-pr-0;
    }

    &-input.--has-label:deep(.m-input-input) {
      @apply maz-pr-0;
    }

    &-input {
      &__toggle-button {
        @apply maz-flex maz-h-full maz-bg-transparent maz-pl-0 maz-flex-center;
      }

      &:deep(input) {
        @apply maz-caret-transparent;
      }
    }

    &-chevron {
      @apply maz-text-[1.2em] maz-text-normal maz-transition-all maz-duration-300 maz-ease-out;
    }

    &.--is-open {
      & .m-select-chevron {
        transform: rotate(180deg);
      }
    }

    .m-select-list {
      @apply maz-absolute maz-z-default-backdrop maz-flex maz-flex-col maz-gap-1 maz-overflow-hidden maz-rounded maz-bg-color maz-p-2 maz-elevation dark:maz-border dark:maz-border-color-light;

      &-optgroup {
        @apply maz-flex-none maz-p-0.5 maz-text-left maz-text-[0.875em] maz-text-muted;
      }

      min-width: 3.5rem;

      &.--top {
        @apply maz-bottom-full;
      }

      &.--left {
        @apply maz-left-0;
      }

      &.--right {
        @apply maz-right-0;
      }

      &.--bottom {
        @apply maz-top-full;
      }

      &__scroll-wrapper {
        @apply maz-flex maz-flex-1 maz-flex-col maz-gap-1 maz-overflow-auto;
      }

      &__no-results {
        @apply maz-flex maz-p-4 maz-flex-center;
      }

      &-item {
        @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-3 maz-truncate maz-rounded maz-bg-transparent maz-px-3 maz-py-[0.5em] maz-text-left maz-text-[1em] maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-color-light hover:maz-bg-color-light;

        span {
          @apply maz-truncate;
        }

        &.--is-keyboard-selected {
          @apply maz-bg-color-light dark:maz-bg-color-lighter;

          &.--is-selected {
            background-color: v-bind('keyboardSelectedBgColor');

            &:hover {
              background-color: v-bind('keyboardSelectedBgColor');
            }
          }
        }

        &.--is-none-value {
          @apply maz-text-muted;
        }

        &.--is-selected {
          color: v-bind('selectedTextColor');
          background-color: v-bind('selectedBgColor');

          &:hover {
            background-color: v-bind('keyboardSelectedBgColor');
          }

          &.--transparent {
            @apply maz-bg-color;
          }
        }
      }
    }

    & button.maz-custom {
      @apply maz-cursor-pointer maz-appearance-none maz-border-none;
    }
  }
</style>
