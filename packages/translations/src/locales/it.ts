import type { MazTranslationsNestedSchema } from '../types'

export default {
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Codice paese',
      error: 'Scegli paese',
      searchPlaceholder: 'Cerca il paese',
    },
    phoneInput: {
      placeholder: 'Numero di telefono',
      example: 'Esempio: {example}',
    },
  },
  dropzone: {
    dragAndDrop: 'Trascina i tuoi file',
    selectFile: 'Seleziona file',
    divider: 'o',
    fileMaxCount: 'Massimo {count} file',
    fileMaxSize: 'Massimo {size} MB',
    fileTypes: 'Tipi di file consentiti: {types}',
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
} satisfies MazTranslationsNestedSchema
