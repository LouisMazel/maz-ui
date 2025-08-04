import { describe, expect, it } from 'vitest'
import { kebabCase } from '../kebabCase'

describe('kebabCase', () => {
  it('should convert PascalCase to kebab-case', () => {
    expect(kebabCase('MazBtn')).toBe('maz-btn')
    expect(kebabCase('MazInputText')).toBe('maz-input-text')
    expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request')
  })

  it('should convert camelCase to kebab-case', () => {
    expect(kebabCase('mazBtn')).toBe('maz-btn')
    expect(kebabCase('mazInputText')).toBe('maz-input-text')
    expect(kebabCase('xmlHttpRequest')).toBe('xml-http-request')
  })

  it('should handle spaces and underscores', () => {
    expect(kebabCase('Maz Btn')).toBe('maz-btn')
    expect(kebabCase('maz_btn')).toBe('maz-btn')
    expect(kebabCase('Maz Input Text')).toBe('maz-input-text')
    expect(kebabCase('maz_input_text')).toBe('maz-input-text')
  })

  it('should handle already kebab-case strings', () => {
    expect(kebabCase('maz-btn')).toBe('maz-btn')
    expect(kebabCase('maz-input-text')).toBe('maz-input-text')
  })

  it('should handle mixed formats', () => {
    expect(kebabCase('MazBtn Component')).toBe('maz-btn-component')
    expect(kebabCase('maz_BtnComponent')).toBe('maz-btn-component')
    expect(kebabCase('XML_HTTPRequest')).toBe('xml-http-request')
  })

  it('should handle edge cases', () => {
    expect(kebabCase('')).toBe('')
    expect(kebabCase('A')).toBe('a')
    expect(kebabCase('AB')).toBe('ab')
    expect(kebabCase('ABC')).toBe('abc')
  })

  it('should clean up multiple dashes', () => {
    expect(kebabCase('maz--btn')).toBe('maz-btn')
    expect(kebabCase('maz   btn')).toBe('maz-btn')
    expect(kebabCase('maz___btn')).toBe('maz-btn')
  })

  it('should handle leading/trailing spaces and dashes', () => {
    expect(kebabCase(' MazBtn ')).toBe('maz-btn')
    expect(kebabCase('-maz-btn-')).toBe('maz-btn')
    expect(kebabCase('  maz btn  ')).toBe('maz-btn')
  })
})
