import type { MazUiTranslationsNestedSchema } from '../types.ts'

export default {
  aria: {
    close: '閉じる',
    increment: '増やす',
    decrement: '減らす',
    character: '文字',
    value: '値',
    options: 'オプション',
    noResults: '結果がありません',
    showOptions: 'オプションを表示',
    hideOptions: 'オプションを隠す',
    previousMonth: '前の月',
    nextMonth: '次の月',
    previousYears: '前の年',
    nextYears: '次の年',
    selectAll: 'すべての行を選択',
    selectRow: '行を選択',
    rowDetails: '行の詳細',
    removeFile: 'ファイルを削除',
    remove: '削除',
    sidebar: 'サイドバー',
    openSidebar: 'サイドバーを開く',
    closeSidebar: 'サイドバーを閉じる',
    resizeSheet: 'シートのサイズを変更',
  },
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
  inputAutocomplete: {
    noResults: '結果がありません',
    loading: '読み込み中...',
    error: 'エラーが発生しました。もう一度お試しください',
    results: '結果: {count}',
    freeEntry: '"{query}" を使用',
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
  inputKeyValue: {
    key: 'キー',
    value: '値',
    add: '追加',
    duplicateKey: 'このキーはすでに使われています',
  },
  inputSecret: {
    saved: '保存済み',
    replace: '置き換える',
    clear: 'クリア',
    cancel: 'キャンセル',
    savedDescription: '値は保存され、非表示です',
  },
  readMore: {
    expand: 'もっと読む',
    collapse: '閉じる',
    ariaLabel: '展開可能なコンテンツ',
  },
  pullToRefresh: {
    pull: '引っ張って更新',
    release: '指を離して更新',
    refreshing: '更新中…',
  },
  skeleton: {
    ariaLabel: 'コンテンツの読み込み中',
    loadingText: '読み込み中...',
  },
  codeHighlight: {
    copyToClipboard: 'クリップボードにコピー',
    copiedToClipboard: 'クリップボードにコピーされました',
    scrollToBottom: '一番下へスクロール',
    diff: {
      additions: '追加された行: {count}',
      deletions: '削除された行: {count}',
      identical: '差分はありません',
      expand: '変更のない行を表示 ({count})',
    },
  },
  colorPicker: {
    openPicker: 'カラーピッカーを開く',
    area: '彩度と明度',
    areaValue: '彩度 {saturation}%、明度 {brightness}%',
    hue: '色相',
    alpha: '不透明度',
    eyeDropper: '画面から色を取得',
    swatches: 'プリセットカラー',
    selectSwatch: '{color} を選択',
  },
  windowMockup: {
    copyUrlToClipboard: 'URLをクリップボードにコピー',
    urlCopiedToClipboard: 'URLがクリップボードにコピーされました',
  },
  btnClipboard: {
    copy: 'コピー',
    copied: 'コピーしました',
  },
  btnScroll: {
    top: 'トップへ戻る',
    bottom: '一番下へ',
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
  dialogConfirm: {
    confirmationLabel: '確認するには「{text}」と入力してください',
  },
  /**
   * Image viewer (lightbox) labels: label, open (thumbnail), close, previous, next, loading.
   */
  lightbox: {
    label: '画像ビューア',
    open: '画像を拡大',
    close: '閉じる',
    previous: '前の画像',
    next: '次の画像',
    loading: '読み込み中...',
  },
} satisfies MazUiTranslationsNestedSchema
