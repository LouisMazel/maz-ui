import type { MazUiTranslationsNestedSchema } from '../types'

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
    fileMaxSize: '最大 {size} MB / ファイル',
    fileTypes: '許可されるファイルタイプ：{types}',
    types: {
      image: '画像',
      video: 'ビデオ',
      audio: '音声',
      text: 'テキスト',
    },
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
  readMore: {
    expand: 'もっと読む',
    collapse: '閉じる',
    ariaLabel: '展開可能なコンテンツ',
  },
  skeleton: {
    ariaLabel: 'コンテンツの読み込み中',
    loadingText: '読み込み中...',
  },
  codeHighlight: {
    copyToClipboard: 'クリップボードにコピー',
    copiedToClipboard: 'クリップボードにコピーされました',
  },
  windowMockup: {
    copyUrlToClipboard: 'URLをクリップボードにコピー',
    urlCopiedToClipboard: 'URLがクリップボードにコピーされました',
  },
  markdownEditor: {
    write: '編集',
    preview: 'プレビュー',
    split: '分割',
    emptyPreview: 'プレビューする内容がありません',
    toolbar: {
      heading: '見出し',
      bold: '太字',
      italic: '斜体',
      strikethrough: '取り消し線',
      quote: '引用',
      code: 'インラインコード',
      codeBlock: 'コードブロック',
      link: 'リンク',
      image: '画像',
      bulletList: '箇条書き',
      orderedList: '番号付きリスト',
      checkList: 'タスクリスト',
      table: 'テーブル',
    },
    headings: {
      h1: '見出し1',
      h2: '見出し2',
      h3: '見出し3',
    },
  },
} satisfies MazUiTranslationsNestedSchema
