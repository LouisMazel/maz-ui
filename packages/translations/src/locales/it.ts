import type { MazUiTranslationsNestedSchema } from '../types.ts'

export default {
  aria: {
    close: 'Chiudi',
    increment: 'Aumenta',
    decrement: 'Diminuisci',
    character: 'Carattere',
    value: 'Valore',
    options: 'Opzioni',
    noResults: 'Nessun risultato',
    showOptions: 'Mostra opzioni',
    hideOptions: 'Nascondi opzioni',
    previousMonth: 'Mese precedente',
    nextMonth: 'Mese successivo',
    previousYears: 'Anni precedenti',
    nextYears: 'Anni successivi',
    selectAll: 'Seleziona tutte le righe',
    selectRow: 'Seleziona riga',
    rowDetails: 'Dettagli della riga',
    removeFile: 'Rimuovi file',
    remove: 'Rimuovi',
    sidebar: 'Barra laterale',
    openSidebar: 'Apri la barra laterale',
    closeSidebar: 'Chiudi la barra laterale',
    resizeSheet: 'Ridimensiona il foglio',
  },
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
  inputAutocomplete: {
    noResults: 'Nessun risultato',
    loading: 'Caricamento...',
    error: 'Si è verificato un errore, riprova',
    results: 'Risultati: {count}',
    freeEntry: 'Usa "{query}"',
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
  inputKeyValue: {
    key: 'Chiave',
    value: 'Valore',
    add: 'Aggiungi',
    duplicateKey: 'Questa chiave è già in uso',
  },
  inputSecret: {
    saved: 'Salvato',
    replace: 'Sostituisci',
    clear: 'Cancella',
    cancel: 'Annulla',
    savedDescription: 'Il valore è salvato e nascosto',
  },
  readMore: {
    expand: 'Leggi di più',
    collapse: 'Leggi di meno',
    ariaLabel: 'Contenuto espandibile',
  },
  pullToRefresh: {
    pull: 'Trascina per aggiornare',
    release: 'Rilascia per aggiornare',
    refreshing: 'Aggiornamento…',
  },
  skeleton: {
    ariaLabel: 'Contenuto in caricamento',
    loadingText: 'Caricamento...',
  },
  codeHighlight: {
    copyToClipboard: 'Copia negli appunti',
    copiedToClipboard: 'Copiato negli appunti',
    scrollToBottom: 'Scorri in fondo',
    diff: {
      additions: 'Righe aggiunte: {count}',
      deletions: 'Righe rimosse: {count}',
      identical: 'Nessuna differenza',
      expand: 'Mostra le righe invariate ({count})',
    },
  },
  colorPicker: {
    openPicker: 'Apri il selettore di colore',
    area: 'Saturazione e luminosità',
    areaValue: 'Saturazione {saturation}%, luminosità {brightness}%',
    hue: 'Tonalità',
    alpha: 'Opacità',
    eyeDropper: 'Preleva un colore dallo schermo',
    swatches: 'Colori predefiniti',
    selectSwatch: 'Seleziona {color}',
  },
  windowMockup: {
    copyUrlToClipboard: 'Copia URL negli appunti',
    urlCopiedToClipboard: 'URL copiato negli appunti',
  },
  btnClipboard: {
    copy: 'Copia',
    copied: 'Copiato',
  },
  btnScroll: {
    top: 'Torna su',
    bottom: 'Vai in fondo',
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
  dialogConfirm: {
    confirmationLabel: 'Digita «{text}» per confermare',
  },
  /**
   * Image viewer (lightbox) labels: label, open (thumbnail), close, previous, next, loading.
   */
  lightbox: {
    label: 'Visualizzatore di immagini',
    open: 'Ingrandisci immagine',
    close: 'Chiudi',
    previous: 'Immagine precedente',
    next: 'Immagine successiva',
    loading: 'Caricamento...',
  },
} satisfies MazUiTranslationsNestedSchema
