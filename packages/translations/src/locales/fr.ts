import type { MazUiTranslationsNestedSchema } from '../types'

export default {
  selectCountry: {
    searchPlaceholder: 'Rechercher un pays',
  },
  inputPhoneNumber: {
    countrySelect: {
      placeholder: 'Code pays',
      error: 'Choisir le pays',
      searchPlaceholder: 'Rechercher un pays',
    },
    phoneInput: {
      placeholder: 'Numéro de téléphone',
      example: 'Exemple: {example}',
    },
  },
  dropzone: {
    dragAndDrop: 'Déposer vos fichiers',
    selectFile: 'Sélectionner un fichier',
    divider: 'ou',
    fileMaxCount: 'Maximum {count} fichiers',
    fileMaxSize: 'Maximum {size} MB',
    fileTypes: 'Types de fichiers autorisés: {types}',
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: 'Derniers 7 jours',
      lastThirtyDays: 'Derniers 30 jours',
      thisWeek: 'Cette semaine',
      lastWeek: 'Semaine précédente',
      thisMonth: 'Ce mois',
      thisYear: 'Cette année',
      lastYear: 'Année précédente',
    },
  },
  checklist: {
    noResultsFound: 'Aucun résultat trouvé',
    searchInput: {
      placeholder: 'Rechercher...',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: 'Scroller vers la gauche',
      nextButton: 'Scroller vers la droite',
    },
  },
  dropdown: {
    screenReaderDescription: 'Ouvrir le menu déroulant',
  },
  select: {
    searchPlaceholder: 'Rechercher',
  },
  pagination: {
    navAriaLabel: 'Navigation',
    screenReader: {
      firstPage: 'Première page',
      previousPage: 'Page précédente',
      page: 'Page {page}',
      nextPage: 'Page suivante',
      lastPage: 'Dernière page',
    },
  },
  table: {
    actionColumnTitle: 'Actions',
    noResults: 'Aucun résultat',
    searchByInput: {
      all: 'Tous',
      placeholder: 'Rechercher par',
    },
    searchInput: {
      placeholder: 'Rechercher',
    },
    pagination: {
      all: 'Tous',
      rowsPerPage: 'Lignes par page',
      of: 'sur',
    },
  },
} satisfies MazUiTranslationsNestedSchema
