import { describe, expect, it } from 'vitest'
import { snakeCase } from '../snakeCase'

describe('snakeCase', () => {
  it('should convert PascalCase to snake_case', () => {
    expect(snakeCase('MazBtn')).toBe('maz_btn')
    expect(snakeCase('MazInputText')).toBe('maz_input_text')
    expect(snakeCase('XMLHttpRequest')).toBe('xml_http_request')
  })

  it('should convert camelCase to snake_case', () => {
    expect(snakeCase('mazBtn')).toBe('maz_btn')
    expect(snakeCase('mazInputText')).toBe('maz_input_text')
    expect(snakeCase('xmlHttpRequest')).toBe('xml_http_request')
  })

  it('should handle spaces and dashes', () => {
    expect(snakeCase('Maz Btn')).toBe('maz_btn')
    expect(snakeCase('maz-btn')).toBe('maz_btn')
    expect(snakeCase('Maz Input Text')).toBe('maz_input_text')
    expect(snakeCase('maz-input-text')).toBe('maz_input_text')
  })

  it('should handle already snake_case strings', () => {
    expect(snakeCase('maz_btn')).toBe('maz_btn')
    expect(snakeCase('maz_input_text')).toBe('maz_input_text')
  })

  it('should handle mixed formats', () => {
    expect(snakeCase('MazBtn Component')).toBe('maz_btn_component')
    expect(snakeCase('maz-BtnComponent')).toBe('maz_btn_component')
    expect(snakeCase('XML-HTTPRequest')).toBe('xml_http_request')
  })

  it('should handle edge cases', () => {
    expect(snakeCase('')).toBe('')
    expect(snakeCase('A')).toBe('a')
    expect(snakeCase('AB')).toBe('ab')
    expect(snakeCase('ABC')).toBe('abc')
  })

  it('should clean up multiple underscores', () => {
    expect(snakeCase('maz__btn')).toBe('maz_btn')
    expect(snakeCase('maz   btn')).toBe('maz_btn')
    expect(snakeCase('maz---btn')).toBe('maz_btn')
  })

  it('should handle leading/trailing spaces and underscores', () => {
    expect(snakeCase(' MazBtn ')).toBe('maz_btn')
    expect(snakeCase('_maz_btn_')).toBe('maz_btn')
    expect(snakeCase('  maz btn  ')).toBe('maz_btn')
  })
})
