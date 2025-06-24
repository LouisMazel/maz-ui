import type { MazTranslationsNestedSchema } from '../types'

export default {
  selectCountry: {
    searchPlaceholder: '国を検索',
  },
  inputPhoneNumber: {
    countrySelect: {
      placeholder: '国番号',
      error: '国を選択',
      searchPlaceholder: '国を検索',
    },
    phoneInput: {
      placeholder: '電話番号',
      example: '例：{example}',
    },
  },
  dropzone: {
    dragAndDrop: 'ファイルをドロップ',
    selectFile: 'ファイルを選択',
    divider: 'または',
    fileMaxCount: '最大 {count} ファイル',
    fileMaxSize: '最大 {size} MB',
    fileTypes: '許可されるファイルタイプ：{types}',
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: '過去7日間',
      lastThirtyDays: '過去30日間',
      thisWeek: '今週',
      lastWeek: '先週',
      thisMonth: '今月',
      thisYear: '今年',
      lastYear: '昨年',
    },
  },
  dropdown: {
    screenReaderDescription: 'ドロップダウンメニューを開く',
  },
  select: {
    searchPlaceholder: '検索',
  },
  table: {
    noResults: '結果なし',
    actionColumnTitle: 'アクション',
    searchByInput: {
      all: 'すべて',
      placeholder: '検索条件',
    },
    searchInput: {
      placeholder: '検索',
    },
    pagination: {
      all: 'すべて',
      rowsPerPage: 'ページあたりの行数',
      of: '/',
    },
  },
  pagination: {
    navAriaLabel: 'ページナビゲーション',
    screenReader: {
      firstPage: '最初のページ、ページ {page}',
      previousPage: '前のページ、ページ {page}',
      page: 'ページ {page}',
      nextPage: '次のページ、ページ {page}',
      lastPage: '最後のページ、ページ {page}',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: '前のアイテムにスクロール',
      nextButton: '次のアイテムにスクロール',
    },
  },
  checklist: {
    noResultsFound: '結果が見つかりません',
    searchInput: {
      placeholder: '検索',
    },
  },
} satisfies MazTranslationsNestedSchema
