/** Attributes that any element accepts: they are forwarded to the root element of a component */
export const GLOBAL_ATTRIBUTES = new Set([
  'id',
  'class',
  'style',
  'title',
  'role',
  'tabindex',
  'hidden',
  'lang',
  'dir',
  'draggable',
  'translate',
  'inert',
  'popover',
  'slot',
  'part',
  'is',
  'key',
  'ref',
  'name',
  'type',
  'value',
  'placeholder',
  'autocomplete',
  'autofocus',
  'autocapitalize',
  'autocorrect',
  'spellcheck',
  'inputmode',
  'enterkeyhint',
  'maxlength',
  'minlength',
  'max',
  'min',
  'step',
  'pattern',
  'readonly',
  'required',
  'disabled',
  'multiple',
  'accept',
  'capture',
  'form',
  'list',
  'size',
  'rows',
  'cols',
  'wrap',
  'checked',
  'selected',
  'href',
  'target',
  'rel',
  'download',
  'src',
  'srcset',
  'sizes',
  'alt',
  'width',
  'height',
  'loading',
  'decoding',
  'for',
  'label',
  'contenteditable',
  'accesskey',
  'nonce',
])

/** DOM events, they fall through to the root element of a component */
export const NATIVE_EVENTS = new Set([
  'click',
  'dblclick',
  'contextmenu',
  'mousedown',
  'mouseup',
  'mouseenter',
  'mouseleave',
  'mouseover',
  'mouseout',
  'mousemove',
  'pointerdown',
  'pointerup',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointercancel',
  'touchstart',
  'touchend',
  'touchmove',
  'touchcancel',
  'keydown',
  'keyup',
  'keypress',
  'focus',
  'blur',
  'focusin',
  'focusout',
  'input',
  'change',
  'submit',
  'reset',
  'invalid',
  'scroll',
  'wheel',
  'resize',
  'drag',
  'dragstart',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'drop',
  'copy',
  'cut',
  'paste',
  'load',
  'error',
  'animationstart',
  'animationend',
  'transitionend',
  'select',
])

export function isPassthroughAttribute(name: string): boolean {
  return GLOBAL_ATTRIBUTES.has(name) || name.startsWith('data-') || name.startsWith('aria-') || name.startsWith('on')
}

export interface NativeReplacement {
  component: string
  severity: 'warning' | 'info'
}

/** maz-ui replacement of a native element, depending on its `type` for inputs */
export function nativeReplacement(tag: string, type: string | undefined): NativeReplacement | undefined {
  switch (tag) {
    case 'button':
      return { component: 'MazBtn', severity: 'warning' }
    case 'select':
      return { component: 'MazSelect', severity: 'warning' }
    case 'textarea':
      return { component: 'MazTextarea', severity: 'warning' }
    case 'dialog':
      return { component: 'MazDialog', severity: 'warning' }
    case 'table':
      return { component: 'MazTable', severity: 'info' }
    case 'progress':
      return { component: 'MazLoadingBar or MazCircularProgressBar', severity: 'info' }
    case 'details':
      return { component: 'MazAccordion or MazExpandAnimation', severity: 'info' }
    case 'input':
      return inputReplacement(type)
    default:
      return undefined
  }
}

function inputReplacement(type = 'text'): NativeReplacement | undefined {
  switch (type) {
    case 'hidden':
    case 'submit':
    case 'reset':
    case 'image':
    case 'color':
      return undefined
    case 'checkbox':
      return { component: 'MazCheckbox (or MazSwitch for a toggle)', severity: 'warning' }
    case 'radio':
      return { component: 'MazRadio or MazRadioButtons', severity: 'warning' }
    case 'range':
      return { component: 'MazSlider', severity: 'warning' }
    case 'file':
      return { component: 'MazDropzone', severity: 'info' }
    case 'tel':
      return { component: 'MazInputPhoneNumber', severity: 'warning' }
    case 'number':
      return { component: 'MazInputNumber (or MazInputPrice for amounts)', severity: 'warning' }
    case 'date':
    case 'datetime-local':
    case 'month':
    case 'week':
    case 'time':
      return { component: 'MazDatePicker', severity: 'warning' }
    default:
      return { component: 'MazInput', severity: 'warning' }
  }
}
