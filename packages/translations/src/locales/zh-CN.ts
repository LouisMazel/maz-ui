import type { MazUiTranslationsNestedSchema } from '../types.ts'

export default {
  aria: {
    close: '关闭',
    increment: '增加',
    decrement: '减少',
    character: '字符',
    value: '值',
    options: '选项',
    noResults: '无结果',
    showOptions: '显示选项',
    hideOptions: '隐藏选项',
    previousMonth: '上个月',
    nextMonth: '下个月',
    previousYears: '前几年',
    nextYears: '后几年',
    selectAll: '选择所有行',
    selectRow: '选择行',
    rowDetails: '行详情',
    removeFile: '删除文件',
    remove: '删除',
    sidebar: '侧边栏',
    openSidebar: '打开侧边栏',
    closeSidebar: '关闭侧边栏',
    resizeSheet: '调整面板大小',
  },
  selectCountry: {
    searchPlaceholder: '搜索国家',
  },
  inputPhoneNumber: {
    countrySelect: {
      placeholder: '国家代码',
      error: '选择国家',
      searchPlaceholder: '搜索国家',
    },
    phoneInput: {
      placeholder: '电话号码',
      example: '示例：{example}',
    },
  },
  dropzone: {
    dragAndDrop: '拖放文件',
    selectFile: '选择文件',
    divider: '或',
    fileMaxCount: '最多 {count} 个文件',
    fileMaxSize: '最大 {size} MB 每个文件',
    fileTypes: '允许的文件类型：{types}',
    types: {
      image: '图片',
      video: '视频',
      audio: '音频',
      text: '文本',
    },
  },
  datePicker: {
    shortcuts: {
      lastSevenDays: '最近7天',
      lastThirtyDays: '最近30天',
      thisWeek: '本周',
      lastWeek: '上周',
      thisMonth: '本月',
      thisYear: '今年',
      lastYear: '去年',
    },
  },
  dropdown: {
    screenReaderDescription: '打开下拉菜单',
  },
  select: {
    searchPlaceholder: '搜索',
  },
  inputAutocomplete: {
    noResults: '无结果',
    loading: '加载中...',
    error: '发生错误，请重试',
    results: '结果：{count}',
    freeEntry: '使用 "{query}"',
  },
  table: {
    noResults: '无结果',
    actionColumnTitle: '操作',
    searchByInput: {
      all: '全部',
      placeholder: '搜索条件',
    },
    searchInput: {
      placeholder: '搜索',
    },
    pagination: {
      all: '全部',
      rowsPerPage: '每页行数',
      of: '共',
    },
  },
  pagination: {
    navAriaLabel: '页面导航',
    screenReader: {
      firstPage: '第一页，第 {page} 页',
      previousPage: '上一页，第 {page} 页',
      page: '第 {page} 页',
      nextPage: '下一页，第 {page} 页',
      lastPage: '最后一页，第 {page} 页',
    },
  },
  carousel: {
    ariaLabel: {
      previousButton: '滚动到上一项',
      nextButton: '滚动到下一项',
    },
  },
  checklist: {
    noResultsFound: '未找到结果',
    searchInput: {
      placeholder: '搜索',
    },
  },
  inputKeyValue: {
    key: '键',
    value: '值',
    add: '添加',
    duplicateKey: '此键已被使用',
  },
  input: {
    clear: '清除',
  },
  inputSecret: {
    saved: '已保存',
    replace: '替换',
    clear: '清除',
    cancel: '取消',
    savedDescription: '值已保存并隐藏',
    strengthLabel: '密码强度',
    strengthVeryWeak: '非常弱',
    strengthWeak: '弱',
    strengthFair: '一般',
    strengthGood: '良好',
    strengthStrong: '强',
    ruleLength: '至少 {minLength} 个字符',
    ruleLowercase: '包含小写字母',
    ruleUppercase: '包含大写字母',
    ruleNumber: '包含数字',
    ruleSymbol: '包含符号',
    ruleMet: '规则已满足',
    ruleNotMet: '规则未满足',
  },
  readMore: {
    expand: '阅读更多',
    collapse: '阅读更少',
    ariaLabel: '可展开内容',
  },
  pullToRefresh: {
    pull: '下拉刷新',
    release: '释放刷新',
    refreshing: '正在刷新…',
  },
  skeleton: {
    ariaLabel: '内容加载中',
    loadingText: '加载中...',
  },
  codeHighlight: {
    copyToClipboard: '复制到剪贴板',
    copiedToClipboard: '已复制到剪贴板',
    scrollToBottom: '滚动到底部',
    diff: {
      additions: '新增行数：{count}',
      deletions: '删除行数：{count}',
      identical: '没有差异',
      expand: '显示未更改的行 ({count})',
    },
  },
  colorPicker: {
    openPicker: '打开颜色选择器',
    area: '饱和度和亮度',
    areaValue: '饱和度 {saturation}%，亮度 {brightness}%',
    hue: '色相',
    alpha: '不透明度',
    eyeDropper: '从屏幕取色',
    swatches: '预设颜色',
    selectSwatch: '选择 {color}',
  },
  windowMockup: {
    copyUrlToClipboard: '复制 URL 到剪贴板',
    urlCopiedToClipboard: 'URL 已复制到剪贴板',
  },
  btn: {
    holdDescription: '长按以确认',
  },
  btnClipboard: {
    copy: '复制',
    copied: '已复制',
  },
  btnScroll: {
    top: '返回顶部',
    bottom: '滚动到底部',
  },
  markdownEditor: {
    write: '编辑',
    preview: '预览',
    split: '分屏',
    emptyPreview: '没有可预览的内容',
    toolbar: {
      heading: '标题',
      bold: '加粗',
      italic: '斜体',
      strikethrough: '删除线',
      quote: '引用',
      code: '行内代码',
      codeBlock: '代码块',
      link: '链接',
      image: '图片',
      bulletList: '无序列表',
      orderedList: '有序列表',
      checkList: '任务列表',
      table: '表格',
    },
    headings: {
      h1: '标题 1',
      h2: '标题 2',
      h3: '标题 3',
    },
  },
  dialogConfirm: {
    confirmationLabel: '输入“{text}”以确认',
  },
  /**
   * Image viewer (lightbox) labels: label, open (thumbnail), close, previous, next, loading.
   */
  lightbox: {
    label: '图片查看器',
    open: '放大图片',
    close: '关闭',
    previous: '上一张图片',
    next: '下一张图片',
    loading: '加载中...',
  },
} satisfies MazUiTranslationsNestedSchema
