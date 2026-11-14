import type { MazUiTranslationsNestedSchema } from '../types'

export default {
  aria: {
    close: 'Schließen',
    increment: 'Erhöhen',
    decrement: 'Verringern',
    character: 'Zeichen',
    value: 'Wert',
    options: 'Optionen',
    noResults: 'Keine Ergebnisse',
    showOptions: 'Optionen anzeigen',
    hideOptions: 'Optionen ausblenden',
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    previousYears: 'Vorherige Jahre',
    nextYears: 'Nächste Jahre',
    selectAll: 'Alle Zeilen auswählen',
    selectRow: 'Zeile auswählen',
    removeFile: 'Datei entfernen',
    remove: 'Entfernen',
    sidebar: 'Seitenleiste',
    openSidebar: 'Seitenleiste öffnen',
    closeSidebar: 'Seitenleiste schließen',
  },
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
  inputAutocomplete: {
    noResults: 'Keine Ergebnisse',
    loading: 'Wird geladen...',
    error: 'Ein Fehler ist aufgetreten, bitte erneut versuchen',
    results: 'Ergebnisse: {count}',
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
  pullToRefresh: {
    pull: 'Zum Aktualisieren ziehen',
    release: 'Zum Aktualisieren loslassen',
    refreshing: 'Wird aktualisiert…',
  },
  skeleton: {
    ariaLabel: 'Inhalt wird geladen',
    loadingText: 'Laden...',
  },
  codeHighlight: {
    copyToClipboard: 'In Zwischenablage kopieren',
    copiedToClipboard: 'In Zwischenablage kopiert',
    scrollToBottom: 'Nach unten scrollen',
  },
  colorPicker: {
    openPicker: 'Farbwähler öffnen',
    area: 'Sättigung und Helligkeit',
    areaValue: 'Sättigung {saturation} %, Helligkeit {brightness} %',
    hue: 'Farbton',
    alpha: 'Deckkraft',
    eyeDropper: 'Farbe vom Bildschirm aufnehmen',
    swatches: 'Vordefinierte Farben',
    selectSwatch: '{color} auswählen',
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
