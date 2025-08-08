import type { MaybeRef, MaybeRefOrGetter, Ref } from 'vue'

import { isClient } from '@maz-ui/utils/helpers/isClient'

import { onBeforeUnmount, ref, shallowRef, toValue, unref, watch } from 'vue'

export interface UseDropzoneReturn {
  files: Ref<File[] | null>
  isOverDropZone: Ref<boolean>
  isOverError: Ref<boolean>
}

export interface UseDropzoneOptions {
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

export function useDropzone(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseDropzoneOptions | UseDropzoneOptions['onDrop'] = {},
): UseDropzoneReturn {
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
        && !('chrome' in globalThis)
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
        // isOverError.value = true
        // return
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

    const dragEnterHandler = (event: DragEvent) => handleDragEvent(event, 'enter')
    const dragOverHandler = (event: DragEvent) => handleDragEvent(event, 'over')
    const dragLeaveHandler = (event: DragEvent) => handleDragEvent(event, 'leave')
    const dropHandler = (event: DragEvent) => handleDragEvent(event, 'drop')

    function removeEventListeners() {
      const targetElement = toValue(target)
      if (targetElement) {
        targetElement.removeEventListener('dragenter', dragEnterHandler)
        targetElement.removeEventListener('dragover', dragOverHandler)
        targetElement.removeEventListener('dragleave', dragLeaveHandler)
        targetElement.removeEventListener('drop', dropHandler)
      }
    }

    watch(() => toValue(target), (element, oldElement) => {
      // Remove listeners from old element
      if (oldElement) {
        oldElement.removeEventListener('dragenter', dragEnterHandler)
        oldElement.removeEventListener('dragover', dragOverHandler)
        oldElement.removeEventListener('dragleave', dragLeaveHandler)
        oldElement.removeEventListener('drop', dropHandler)
      }

      // Add listeners to new element
      if (element) {
        element.addEventListener('dragenter', dragEnterHandler)
        element.addEventListener('dragover', dragOverHandler)
        element.addEventListener('dragleave', dragLeaveHandler)
        element.addEventListener('drop', dropHandler)
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
