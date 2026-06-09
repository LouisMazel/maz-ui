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
    selectFile: 'selecionar arquivo',
    divider: 'ou',
    fileMaxCount: 'Máximo {count} arquivos',
    fileMaxSize: 'Máximo {size} MB por arquivo',
    fileTypes: 'Tipos de arquivo permitidos: {types}',
    types: {
      image: 'imagens',
      video: 'vídeos',
      audio: 'audios',
      text: 'textos',
    },
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
  readMore: {
    expand: 'Ler mais',
    collapse: 'Ler menos',
    ariaLabel: 'Conteúdo expansível',
  },
  skeleton: {
    ariaLabel: 'Conteúdo em carregamento',
    loadingText: 'Carregando...',
  },
  codeHighlight: {
    copyToClipboard: 'Copiar para a área de transferência',
    copiedToClipboard: 'Copiado para a área de transferência',
  },
  windowMockup: {
    copyUrlToClipboard: 'Copiar URL para a área de transferência',
    urlCopiedToClipboard: 'URL copiada para a área de transferência',
  },
  markdownEditor: {
    write: 'Escrever',
    preview: 'Pré-visualizar',
    emptyPreview: 'Nada para pré-visualizar',
    toolbar: {
      bold: 'Negrito',
      italic: 'Itálico',
      list: 'Lista com marcadores',
      link: 'Link',
      code: 'Código',
    },
  },
} satisfies MazUiTranslationsNestedSchema
