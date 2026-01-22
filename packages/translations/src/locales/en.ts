export default {
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
   * This is the translation for the form validation messages.
   * The keys are:
   * - required: The translation for the required field error.
   * - email: The translation for the invalid email error.
   * - minLength: The translation for the minimum length error.
   * - maxLength: The translation for the maximum length error.
   * - min: The translation for the minimum value error.
   * - max: The translation for the maximum value error.
   * - pattern: The translation for the pattern mismatch error.
   * - url: The translation for the invalid URL error.
   * - number: The translation for the invalid number error.
   * - integer: The translation for the invalid integer error.
   * - date: The translation for the invalid date error.
   * - phone: The translation for the invalid phone number error.
   * - custom: The translation for the custom validation error.
   */
  formValidation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    min: 'Must be at least {min}',
    max: 'Must be at most {max}',
    pattern: 'Invalid format',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    integer: 'Please enter a valid integer',
    date: 'Please enter a valid date',
    phone: 'Please enter a valid phone number',
    custom: 'This field is invalid',
  },
}
