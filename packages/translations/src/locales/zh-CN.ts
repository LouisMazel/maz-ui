import type { MazUiTranslationsNestedSchema } from '../types'

export default {
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
} satisfies MazUiTranslationsNestedSchema
