import type { MazUiTranslationsNestedSchema } from '../types'

export default {
  selectCountry: {
    searchPlaceholder: 'Buscar país',
  },
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Código de país',
      error: 'Elegir país',
      searchPlaceholder: 'Buscar país',
    },
    phoneInput: {
      placeholder: 'Número de teléfono',
      example: 'Ejemplo: {example}',
    },
  },
  dropzone: {
    dragAndDrop: 'Arrastra tus archivos',
    selectFile: 'Seleccionar archivo',
    divider: 'o',
    fileMaxCount: 'Máximo {count} archivos',
    fileMaxSize: 'Máximo {size} MB',
    fileTypes: 'Tipos de archivo permitidos: {types}',
    types: {
      image: 'imágenes',
      video: 'vídeos',
      audio: 'audios',
      text: 'textos',
    },
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Últimos 7 días',
      lastThirtyDays: 'Últimos 30 días',
      thisWeek: 'Esta semana',
      lastWeek: 'Semana pasada',
      thisMonth: 'Este mes',
      thisYear: 'Este año',
      lastYear: 'Año pasado',
    },
  },
  dropdown: {
    screenReaderDescription: 'Abrir menú desplegable',
  },
  select: {
    searchPlaceholder: 'Buscar',
  },
  table: {
    noResults: 'Sin resultados',
    actionColumnTitle: 'Acciones',
    searchByInput: {
      all: 'Todos',
      placeholder: 'Buscar por',
    },
    searchInput: {
      placeholder: 'Buscar',
    },
    pagination: {
      all: 'Todos',
      rowsPerPage: 'Filas por página',
      of: 'de',
    },
  },
  pagination: {
    navAriaLabel: 'navegación de páginas',
    screenReader: {
      firstPage: 'Primera página, página {page}',
      previousPage: 'Página anterior, página {page}',
      page: 'Página {page}',
      nextPage: 'Página siguiente, página {page}',
      lastPage: 'Última página, página {page}',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: 'Desplazar a elementos anteriores',
      nextButton: 'Desplazar a elementos siguientes',
    },
  },
  checklist: {
    noResultsFound: 'No se encontraron resultados',
    searchInput: {
      placeholder: 'Buscar',
    },
  },
} satisfies MazUiTranslationsNestedSchema
