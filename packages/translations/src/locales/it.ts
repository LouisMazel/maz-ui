import type { MazUiTranslationsNestedSchema } from '../types'

export default {
  selectCountry: {
    searchPlaceholder: 'Cerca paese',
  },
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Codice paese',
      error: 'Scegli paese',
      searchPlaceholder: 'Cerca paese',
    },
    phoneInput: {
      placeholder: 'Numero di telefono',
      example: 'Esempio: {example}',
    },
  },
  dropzone: {
    dragAndDrop: 'Trascina i tuoi file',
    selectFile: 'seleziona file',
    divider: 'o',
    fileMaxCount: 'Massimo {count} file',
    fileMaxSize: 'Massimo {size} MB per file',
    fileTypes: 'Tipi di file consentiti: {types}',
    types: {
      image: 'immagini',
      video: 'video',
      audio: 'audio',
      text: 'testi',
    },
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Ultimi 7 giorni',
      lastThirtyDays: 'Ultimi 30 giorni',
      thisWeek: 'Questa settimana',
      lastWeek: 'Settimana scorsa',
      thisMonth: 'Questo mese',
      thisYear: 'Quest\'anno',
      lastYear: 'Anno scorso',
    },
  },
  dropdown: {
    screenReaderDescription: 'Apri menu a discesa',
  },
  select: {
    searchPlaceholder: 'Cerca',
  },
  table: {
    noResults: 'Nessun risultato',
    actionColumnTitle: 'Azioni',
    searchByInput: {
      all: 'Tutti',
      placeholder: 'Cerca per',
    },
    searchInput: {
      placeholder: 'Cerca',
    },
    pagination: {
      all: 'Tutti',
      rowsPerPage: 'Righe per pagina',
      of: 'di',
    },
  },
  pagination: {
    navAriaLabel: 'navigazione pagine',
    screenReader: {
      firstPage: 'Prima pagina, pagina {page}',
      previousPage: 'Pagina precedente, pagina {page}',
      page: 'Pagina {page}',
      nextPage: 'Pagina successiva, pagina {page}',
      lastPage: 'Ultima pagina, pagina {page}',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: 'Scorri agli elementi precedenti',
      nextButton: 'Scorri agli elementi successivi',
    },
  },
  checklist: {
    noResultsFound: 'Nessun risultato trovato',
    searchInput: {
      placeholder: 'Cerca',
    },
  },
  readMore: {
    expand: 'Leggi di più',
    collapse: 'Leggi di meno',
    ariaLabel: 'Contenuto espandibile',
  },
  skeleton: {
    ariaLabel: 'Contenuto in caricamento',
    loadingText: 'Caricamento...',
  },
  codeHighlight: {
    copyToClipboard: 'Copia negli appunti',
    copiedToClipboard: 'Copiato negli appunti',
  },
  windowMockup: {
    copyUrlToClipboard: 'Copia URL negli appunti',
    urlCopiedToClipboard: 'URL copiato negli appunti',
  },
  markdownEditor: {
    write: 'Scrivi',
    preview: 'Anteprima',
    split: 'Diviso',
    emptyPreview: 'Niente da visualizzare',
    toolbar: {
      heading: 'Titolo',
      bold: 'Grassetto',
      italic: 'Corsivo',
      strikethrough: 'Barrato',
      quote: 'Citazione',
      code: 'Codice in linea',
      codeBlock: 'Blocco di codice',
      link: 'Link',
      image: 'Immagine',
      bulletList: 'Elenco puntato',
      orderedList: 'Elenco numerato',
      checkList: 'Elenco attività',
      table: 'Tabella',
    },
    headings: {
      h1: 'Titolo 1',
      h2: 'Titolo 2',
      h3: 'Titolo 3',
    },
  },
} satisfies MazUiTranslationsNestedSchema
