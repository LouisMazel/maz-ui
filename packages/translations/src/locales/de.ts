import type { MazTranslationsNestedSchema } from '../types'

export default {
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Ländercode',
      error: 'Land wählen',
      searchPlaceholder: 'Land suchen',
    },
    phoneInput: {
      placeholder: 'Telefonnummer',
      example: 'Beispiel: {example}',
    },
  },
  dropzone: {
    dragAndDrop: 'Dateien ablegen',
    selectFile: 'Datei auswählen',
    divider: 'oder',
    fileMaxCount: 'Maximal {count} Dateien',
    fileMaxSize: 'Maximal {size} MB',
    fileTypes: 'Erlaubte Dateitypen: {types}',
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Letzte 7 Tage',
      lastThirtyDays: 'Letzte 30 Tage',
      thisWeek: 'Diese Woche',
      lastWeek: 'Letzte Woche',
      thisMonth: 'Dieser Monat',
      thisYear: 'Dieses Jahr',
      lastYear: 'Letztes Jahr',
    },
  },
  dropdown: {
    screenReaderDescription: 'Dropdown-Menü öffnen',
  },
  select: {
    searchPlaceholder: 'Suchen',
  },
  table: {
    noResults: 'Keine Ergebnisse',
    actionColumnTitle: 'Aktionen',
    searchByInput: {
      all: 'Alle',
      placeholder: 'Suchen nach',
    },
    searchInput: {
      placeholder: 'Suchen',
    },
    pagination: {
      all: 'Alle',
      rowsPerPage: 'Zeilen pro Seite',
      of: 'von',
    },
  },
  pagination: {
    navAriaLabel: 'Seitennavigation',
    screenReader: {
      firstPage: 'Erste Seite, Seite {page}',
      previousPage: 'Vorherige Seite, Seite {page}',
      page: 'Seite {page}',
      nextPage: 'Nächste Seite, Seite {page}',
      lastPage: 'Letzte Seite, Seite {page}',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: 'Zu vorherigen Elementen scrollen',
      nextButton: 'Zu nächsten Elementen scrollen',
    },
  },
  checklist: {
    noResultsFound: 'Keine Ergebnisse gefunden',
    searchInput: {
      placeholder: 'Suchen',
    },
  },
} satisfies MazTranslationsNestedSchema
