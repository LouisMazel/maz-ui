export default {
  /**
   * Generic accessibility labels reused across components (aria-label,
   * screen-reader-only text). One namespace to avoid duplicating common
   * labels like "close" in every component.
   */
  aria: {
    close: 'Close',
    increment: 'Increment',
    decrement: 'Decrement',
    character: 'Character',
    value: 'Value',
    options: 'Options',
    noResults: 'No results',
    showOptions: 'Show options',
    hideOptions: 'Hide options',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    previousYears: 'Previous years',
    nextYears: 'Next years',
    selectAll: 'Select all rows',
    selectRow: 'Select row',
    removeFile: 'Remove file',
    remove: 'Remove',
    sidebar: 'Sidebar',
    openSidebar: 'Open sidebar',
    closeSidebar: 'Close sidebar',
  },
  /**
   * This is the translation for the input phone number component.
   * The keys are:
   * - countrySelect: The translation for the country select.
   * - phoneInput: The translation for the phone input.
   */
  selectCountry: {
    searchPlaceholder: 'Search country',
  },
  inputPhoneNumber: {
    /**
     * This is the translation for the country select component.
     * The keys are:
     * - placeholder: The translation for the placeholder text.
     * - error: The translation for the error text.
     * - searchPlaceholder: The translation for the search placeholder text.
     */
    countrySelect: {
      placeholder: 'Country code',
      error: 'Choose country',
      searchPlaceholder: 'Search the country',
    },
    /**
     * This is the translation for the phone input component.
     * The keys are:
     * - placeholder: The translation for the placeholder text.
     * - example: The translation for the example text.
     */
    phoneInput: {
      placeholder: 'Phone number',
      example: 'Example: {example}',
    },
  },
  /**
   * This is the translation for the dropzone component.
   * The keys are:
   * - dragAndDrop: The translation for the drag and drop text.
   * - selectFile: The translation for the select file button.
   * - divider: The translation for the divider text.
   * - fileMaxCount: The translation for the maximum number of files.
   * - fileMaxSize: The translation for the maximum size of the files.
   * - fileTypes: The translation for the allowed file types.
   */
  dropzone: {
    dragAndDrop: 'Drop your files',
    selectFile: 'select file',
    divider: 'or',
    fileMaxCount: 'Maximum {count} files',
    fileMaxSize: 'Maximum {size} MB per file',
    fileTypes: 'Allowed file types: {types}',
    types: {
      image: 'images',
      video: 'videos',
      audio: 'audios',
      text: 'texts',
    },
  },
  /**
   * This is the translation for the date picker component.
   * The keys are:
   * - shortcuts: The translation for the shortcuts.
   */
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Last 7 days',
      lastThirtyDays: 'Last 30 days',
      thisWeek: 'This week',
      lastWeek: 'Last week',
      thisMonth: 'This month',
      thisYear: 'This year',
      lastYear: 'Last year',
    },
  },
  /**
   * This is the translation for the dropdown component.
   * The keys are:
   * - screenReaderDescription: The translation for the screen reader description.
   */
  dropdown: {
    screenReaderDescription: 'Open menu dropdown',
  },
  /**
   * This is the translation for the select component.
   * The keys are:
   * - searchPlaceholder: The translation for the search placeholder text.
   */
  select: {
    searchPlaceholder: 'Search',
  },
  /**
   * This is the translation for the input autocomplete component.
   * The keys are:
   * - noResults: The translation for the no results text.
   * - loading: The translation for the loading text.
   * - error: The translation for the error text, when the source fails.
   * - results: The number of results announced to the screen readers.
   */
  inputAutocomplete: {
    noResults: 'No results',
    loading: 'Loading...',
    error: 'An error occurred, try again',
    results: 'Results: {count}',
  },
  /**
   * This is the translation for the table component.
   * The keys are:
   * - noResults: The translation for the no results text.
   * - actionColumnTitle: The translation for the action column title.
   * - searchByInput: The translation for the search by input.
   * - searchInput: The translation for the search input.
   * - pagination: The translation for the pagination component.
   */
  table: {
    noResults: 'No results',
    actionColumnTitle: 'Actions',
    searchByInput: {
      all: 'All',
      placeholder: 'Search by',
    },
    searchInput: {
      placeholder: 'Search',
    },
    pagination: {
      all: 'All',
      rowsPerPage: 'Rows per page',
      of: 'of',
    },
  },
  /**
   * This is the translation for the pagination component.
   * The keys are:
   * - navAriaLabel: The aria-label for the navigation (nav) element.
   * - screenReader.firstPage: The translation for the first page button (screen reader).
   * - screenReader.previousPage: The translation for the previous page button (screen reader).
   * - screenReader.page: The translation for the current page button (screen reader).
   * - screenReader.nextPage: The translation for the next page button (screen reader).
   * - screenReader.lastPage: The translation for the last page button (screen reader).
   */
  pagination: {
    navAriaLabel: 'page navigation',
    screenReader: {
      firstPage: 'First Page, page {page}',
      previousPage: 'Previous Page, page {page}',
      page: 'Page {page}',
      nextPage: 'Next Page, page {page}',
      lastPage: 'Last Page, page {page}',
    },
  },
  /**
   * This is the translation for the carousel component.
   * The keys are:
   * - ariaLabel.previousButton: The aria-label for the previous button.
   * - ariaLabel.nextButton: The aria-label for the next button.
   */
  carousel: {
    ariaLabel: {
      previousButton: 'Scroll to previous items',
      nextButton: 'Scroll to next items',
    },
  },
  /**
   * This is the translation for the checklist component.
   * The keys are:
   * - noResultsFound: The translation for the no results found text.
   * - searchInput.placeholder: The translation for the search input placeholder.
   */
  checklist: {
    noResultsFound: 'No results found',
    searchInput: {
      placeholder: 'Search',
    },
  },
  /**
   * This is the translation for the read more component.
   * The keys are:
   * - expand: The translation for the expand text.
   * - collapse: The translation for the collapse text.
   * - ariaLabel: The translation for the aria label.
   */
  readMore: {
    expand: 'Read more',
    collapse: 'Read less',
    ariaLabel: 'Expandable content',
  },
  /**
   * This is the translation for the pull to refresh component.
   * The keys are:
   * - pull: Hint shown while the user pulls down.
   * - release: Hint shown once the pull is long enough to refresh.
   * - refreshing: Text shown and announced to screen readers while refreshing.
   */
  pullToRefresh: {
    pull: 'Pull to refresh',
    release: 'Release to refresh',
    refreshing: 'Refreshing…',
  },
  /**
   * This is the translation for the skeleton component.
   * The keys are:
   * - ariaLabel: The translation for the aria label.
   * - loadingText: The translation for the loading text.
   */
  skeleton: {
    ariaLabel: 'Loading content',
    loadingText: 'Loading...',
  },
  /**
   * This is the translation for the code highlight component.
   * The keys are:
   * - copyToClipboard: Label/tooltip for the copy button (default state).
   * - copiedToClipboard: Label/tooltip for the copy button after a successful copy.
   * - scrollToBottom: Label/tooltip for the button that scrolls a long block back to its last line.
   */
  codeHighlight: {
    copyToClipboard: 'Copy to clipboard',
    copiedToClipboard: 'Copied to clipboard',
    scrollToBottom: 'Scroll to bottom',
  },
  /**
   * This is the translation for the color picker component.
   * The keys are:
   * - openPicker: Accessible label of the button that opens the picker.
   * - area / areaValue: Name and value of the saturation and brightness area.
   * - hue / alpha: Names of the hue and opacity sliders.
   * - eyeDropper: Label of the button that picks a color on the screen.
   * - swatches / selectSwatch: Name of the presets list and label of a preset.
   */
  colorPicker: {
    openPicker: 'Open the color picker',
    area: 'Saturation and brightness',
    areaValue: 'Saturation {saturation}%, brightness {brightness}%',
    hue: 'Hue',
    alpha: 'Opacity',
    eyeDropper: 'Pick a color on the screen',
    swatches: 'Color presets',
    selectSwatch: 'Select {color}',
  },
  /**
   * This is the translation for the window mockup component.
   * The keys are:
   * - copyUrlToClipboard: Label/tooltip for the URL copy button (default state).
   * - urlCopiedToClipboard: Label/tooltip for the URL copy button after a successful copy.
   */
  windowMockup: {
    copyUrlToClipboard: 'Copy URL to clipboard',
    urlCopiedToClipboard: 'URL copied to clipboard',
  },
  /**
   * This is the translation for the markdown editor component.
   * The keys are:
   * - write/preview/split: Labels for the editor mode tabs.
   * - emptyPreview: Text shown in the preview pane when there is nothing to render.
   * - toolbar.*: Accessible labels for the formatting toolbar buttons.
   * - headings.h1/h2/h3: Labels for the heading dropdown options.
   */
  markdownEditor: {
    write: 'Write',
    preview: 'Preview',
    split: 'Split',
    emptyPreview: 'Nothing to preview',
    toolbar: {
      heading: 'Heading',
      bold: 'Bold',
      italic: 'Italic',
      strikethrough: 'Strikethrough',
      quote: 'Quote',
      code: 'Inline code',
      codeBlock: 'Code block',
      link: 'Link',
      image: 'Image',
      bulletList: 'Bulleted list',
      orderedList: 'Numbered list',
      checkList: 'Task list',
      table: 'Table',
    },
    headings: {
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
    },
  },
}
