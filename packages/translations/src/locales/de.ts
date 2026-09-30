import type { MazUiTranslationsNestedSchema } from '../types'

export default {
  selectCountry: {
    searchPlaceholder: 'Land suchen',
  },
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
    fileMaxSize: 'Maximal {size} MB pro Datei',
    fileTypes: 'Erlaubte Dateitypen: {types}',
    types: {
      image: 'Bilder',
      video: 'Videos',
      audio: 'Audios',
      text: 'Texte',
    },
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
  readMore: {
    expand: 'Mehr lesen',
    collapse: 'Weniger lesen',
    ariaLabel: 'Erweiterbarer Inhalt',
  },
  skeleton: {
    ariaLabel: 'Inhalt wird geladen',
    loadingText: 'Laden...',
  },
  codeHighlight: {
    copyToClipboard: 'In Zwischenablage kopieren',
    copiedToClipboard: 'In Zwischenablage kopiert',
  },
  windowMockup: {
    copyUrlToClipboard: 'URL in Zwischenablage kopieren',
    urlCopiedToClipboard: 'URL in Zwischenablage kopiert',
  },
  markdownEditor: {
    write: 'Schreiben',
    preview: 'Vorschau',
    split: 'Geteilt',
    emptyPreview: 'Nichts zur Vorschau',
    toolbar: {
      heading: 'Überschrift',
      bold: 'Fett',
      italic: 'Kursiv',
      strikethrough: 'Durchgestrichen',
      quote: 'Zitat',
      code: 'Inline-Code',
      codeBlock: 'Codeblock',
      link: 'Link',
      image: 'Bild',
      bulletList: 'Aufzählung',
      orderedList: 'Nummerierte Liste',
      checkList: 'Aufgabenliste',
      table: 'Tabelle',
    },
    headings: {
      h1: 'Überschrift 1',
      h2: 'Überschrift 2',
      h3: 'Überschrift 3',
    },
  },
} satisfies MazUiTranslationsNestedSchema
