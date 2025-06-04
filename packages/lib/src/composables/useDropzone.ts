import type { MaybeRef, MaybeRefOrGetter, Ref } from 'vue'

import { onBeforeUnmount, ref, shallowRef, toValue, unref, watch } from 'vue'

import { isClient } from '../helpers/isClient'

export interface UseDropZoneReturn {
  files: Ref<File[] | null>
  isOverDropZone: Ref<boolean>
  isOverError: Ref<boolean>
}

export interface UseDropZoneOptions {
  /**
   * Allowed data types, if not set, all data types are allowed.
   * Also can be a function to check the data types.
   */
  dataTypes?: MaybeRef<string[]> | ((types: readonly string[]) => boolean)
  onDrop?: (files: File[] | null, event: DragEvent) => unknown
  onEnter?: (files: File[] | null, event: DragEvent) => unknown
  onLeave?: (files: File[] | null, event: DragEvent) => unknown
  onOver?: (files: File[] | null, event: DragEvent) => unknown
  onError?: (files: File[] | null, event: DragEvent) => unknown
  /**
   * Allow multiple files to be dropped. Defaults to true.
   */
  multiple?: boolean
  /**
   * Prevent default behavior for unhandled events. Defaults to false.
   */
  preventDefaultForUnhandled?: boolean
}

export function useDropZone(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  const isOverError = ref(false)
  const files = shallowRef<File[] | null>(null)
  let counter = 0
  let isValid = true

  if (isClient()) {
    const _options = typeof options === 'function' ? { onDrop: options } : options
    const multiple = _options.multiple ?? true
    const preventDefaultForUnhandled = _options.preventDefaultForUnhandled ?? false

    function getFiles(event: DragEvent) {
      const list = Array.from(event.dataTransfer?.files ?? [])
      return list.length === 0 ? null : (multiple ? list : [list[0]])
    }

    function checkDataTypes(types: string[]) {
      const dataTypes = unref(_options.dataTypes)

      if (typeof dataTypes === 'function')
        return dataTypes(types)

      if (!dataTypes || dataTypes?.length === 0)
        return true

      if (types.length === 0)
        return false

      return types.every(type =>
        dataTypes?.some(allowedType => type.includes(allowedType)),
      )
    }

    function checkValidity(items: DataTransferItemList) {
      const types = Array.from(items ?? []).map(item => item.type)

      const dataTypesValid = checkDataTypes(types)
      const multipleFilesValid = multiple || items.length <= 1
      return dataTypesValid && multipleFilesValid
    }

    function isSafari() {
      return (
        /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent)
        && !('chrome' in window)
      )
    }

    function handleDragEvent(event: DragEvent, eventType: 'enter' | 'over' | 'leave' | 'drop') {
      const dataTransferItemList = event.dataTransfer?.items
      isValid = (dataTransferItemList && checkValidity(dataTransferItemList)) ?? false

      if (preventDefaultForUnhandled) {
        event.preventDefault()
      }

      const currentFiles = getFiles(event)

      if (!isSafari() && !isValid) {
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'none'
        }
        return
      }

      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
      }

      switch (eventType) {
        case 'enter':
          counter += 1
          isOverDropZone.value = true
          isOverError.value = !isValid
          _options.onEnter?.(null, event)
          break
        case 'over':
          _options.onOver?.(null, event)
          break
        case 'leave':
          counter -= 1
          if (counter === 0) {
            isOverDropZone.value = false
            isOverError.value = false
          }
          _options.onLeave?.(null, event)
          break
        case 'drop':
          counter = 0
          isOverDropZone.value = false
          isOverError.value = false
          if (isValid) {
            files.value = currentFiles
            _options.onDrop?.(currentFiles, event)
          }
          else {
            _options.onError?.(currentFiles, event)
          }
          break
      }
    }

    function removeEventListeners() {
      const targetElement = toValue(target)
      if (targetElement) {
        targetElement.removeEventListener('dragenter', event => handleDragEvent(event, 'enter'))
        targetElement.removeEventListener('dragover', event => handleDragEvent(event, 'over'))
        targetElement.removeEventListener('dragleave', event => handleDragEvent(event, 'leave'))
        targetElement.removeEventListener('drop', event => handleDragEvent(event, 'drop'))
      }
    }

    watch(() => toValue(target), (element) => {
      if (element) {
        element.addEventListener('dragenter', event => handleDragEvent(event, 'enter'))
        element.addEventListener('dragover', event => handleDragEvent(event, 'over'))
        element.addEventListener('dragleave', event => handleDragEvent(event, 'leave'))
        element.addEventListener('drop', event => handleDragEvent(event, 'drop'))
      }
    }, { immediate: true })

    onBeforeUnmount(() => {
      removeEventListeners()
    })
  }

  return {
    files,
    isOverDropZone,
    isOverError,
  }
}
