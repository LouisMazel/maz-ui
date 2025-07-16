import type { BaseFormPayload, ExtractModelKey, FieldState, FormSchema, StrictOptions } from './types'
import { CONFIG } from './config'
import { hasModeIncludes } from './state-management'

export function scrollToError(selector = CONFIG.scrollToErrorSelector) {
  const element = document.querySelector(selector)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export function findInteractiveElements(el: HTMLElement): HTMLElement[] {
  if (isInteractiveElement(el)) {
    return [el]
  }

  // Otherwise, find all interactive elements within it
  const selector = [
    // Standard form elements
    'input',
    'select',
    'textarea',
    'button',
    // Focusable elements
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    // Elements with interactive ARIA roles
    '[role="button"]',
    '[role="textbox"]',
    '[role="combobox"]',
    '[role="listbox"]',
    '[role="slider"]',
    '[role="spinbutton"]',
    '[role="switch"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="menuitem"]',
    '[role="option"]',
    // Contenteditable elements
    '[contenteditable="true"]',
    // Custom interactive elements (common patterns)
    '[data-interactive]',
    '.interactive',
    '[data-clickable]',
  ].join(', ')

  return Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(isInteractiveElement)
}

function isInteractiveElement(el: HTMLElement): boolean {
  // Exclude elements with tabindex="-1" (not focusable)
  if (el.getAttribute('tabindex') === '-1') {
    return false
  }

  // Standard form elements
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement
    || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement) {
    return true
  }

  // Links with href
  if (el instanceof HTMLAnchorElement && el.href) {
    return true
  }

  // Elements with tabindex (focusable)
  if (el.hasAttribute('tabindex') && el.getAttribute('tabindex') !== '-1') {
    return true
  }

  // Elements with interactive ARIA roles
  const interactiveRoles = [
    'button',
    'textbox',
    'combobox',
    'listbox',
    'slider',
    'spinbutton',
    'switch',
    'checkbox',
    'radio',
    'menuitem',
    'option',
  ]
  const role = el.getAttribute('role')
  if (role && interactiveRoles.includes(role)) {
    return true
  }

  // Contenteditable elements
  if (el.getAttribute('contenteditable') === 'true') {
    return true
  }

  // Custom interactive markers
  return el.hasAttribute('data-interactive') || el.hasAttribute('data-clickable')
    || el.classList.contains('interactive')
}

// Track active listeners to prevent memory leaks
const activeListeners = new WeakMap<HTMLElement, Map<string, EventListener>>()

export function addEventToInteractiveElements({
  interactiveElements,
  onBlur,
  mode,
}: {
  interactiveElements: HTMLElement[]
  onBlur: () => void
  mode: StrictOptions<BaseFormPayload, ExtractModelKey<FormSchema<BaseFormPayload>>>['mode']
}) {
  interactiveElements.forEach((element) => {
    if (hasModeIncludes(['eager', 'blur', 'progressive'], mode)) {
      // Clean up existing listeners first
      const existingListeners = activeListeners.get(element)
      if (existingListeners?.has('blur')) {
        element.removeEventListener('blur', existingListeners.get('blur')!)
      }

      // Add new listener
      element.addEventListener('blur', onBlur)

      // Track the listener
      if (!activeListeners.has(element)) {
        activeListeners.set(element, new Map())
      }
      activeListeners.get(element)!.set('blur', onBlur)
    }
  })
}

export function removeEventFromInteractiveElements({
  interactiveElements,
  onBlur,
}: {
  interactiveElements: HTMLElement[]
  onBlur: () => void
}) {
  interactiveElements.forEach((element) => {
    const existingListeners = activeListeners.get(element)
    if (existingListeners?.has('blur')) {
      element.removeEventListener('blur', onBlur)
      existingListeners.delete('blur')

      // Clean up WeakMap entry if no more listeners
      if (existingListeners.size === 0) {
        activeListeners.delete(element)
      }
    }
  })
}

export function getValidationEvents<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
  F extends FieldState<Model, ModelKey, Model[ModelKey]>,
>({
  hasRef,
  fieldState,
  onBlur,
}: {
  hasRef?: boolean
  fieldState: F
  onBlur: () => void
}) {
  if (hasRef || hasModeIncludes(['aggressive', 'lazy'], fieldState.mode)) {
    return
  }

  return {
    onBlur,
  }
}
