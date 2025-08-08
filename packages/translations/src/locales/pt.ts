import type { MazUiTranslationsNestedSchema } from '../types'

export default {
  selectCountry: {
    searchPlaceholder: 'Pesquisar país',
  },
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Código do país',
      error: 'Escolher país',
      searchPlaceholder: 'Pesquisar país',
    },
    phoneInput: {
      placeholder: 'Número de telefone',
      example: 'Exemplo: {example}',
    },
  },
  dropzone: {
    dragAndDrop: 'Solte seus arquivos',
    selectFile: 'Selecionar arquivo',
    divider: 'ou',
    fileMaxCount: 'Máximo {count} arquivos',
    fileMaxSize: 'Máximo {size} MB',
    fileTypes: 'Tipos de arquivo permitidos: {types}',
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Últimos 7 dias',
      lastThirtyDays: 'Últimos 30 dias',
      thisWeek: 'Esta semana',
      lastWeek: 'Semana passada',
      thisMonth: 'Este mês',
      thisYear: 'Este ano',
      lastYear: 'Ano passado',
    },
  },
  dropdown: {
    screenReaderDescription: 'Abrir menu suspenso',
  },
  select: {
    searchPlaceholder: 'Pesquisar',
  },
  table: {
    noResults: 'Sem resultados',
    actionColumnTitle: 'Ações',
    searchByInput: {
      all: 'Todos',
      placeholder: 'Pesquisar por',
    },
    searchInput: {
      placeholder: 'Pesquisar',
    },
    pagination: {
      all: 'Todos',
      rowsPerPage: 'Linhas por página',
      of: 'de',
    },
  },
  pagination: {
    navAriaLabel: 'navegação de páginas',
    screenReader: {
      firstPage: 'Primeira página, página {page}',
      previousPage: 'Página anterior, página {page}',
      page: 'Página {page}',
      nextPage: 'Próxima página, página {page}',
      lastPage: 'Última página, página {page}',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: 'Rolar para itens anteriores',
      nextButton: 'Rolar para próximos itens',
    },
  },
  checklist: {
    noResultsFound: 'Nenhum resultado encontrado',
    searchInput: {
      placeholder: 'Pesquisar',
    },
  },
} satisfies MazUiTranslationsNestedSchema
