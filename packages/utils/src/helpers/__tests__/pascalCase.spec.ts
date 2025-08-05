import { pascalCase } from '../pascalCase'

describe('Given pascalCase', () => {
  describe('When string is empty', () => {
    it('Then return empty string', () => {
      expect(pascalCase('')).toBe('')
    })
  })

  describe('When string is not empty', () => {
    it('Then return pascal case string', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld')
    })

    describe('When string is kebab case', () => {
      it('Then return pascal case string', () => {
        expect(pascalCase('hello-world')).toBe('HelloWorld')
      })
    })

    describe('When string is snake case', () => {
      it('Then return pascal case string', () => {
        expect(pascalCase('hello_world')).toBe('HelloWorld')
      })
    })

    describe('When string is camel case', () => {
      it('Then return pascal case string', () => {
        expect(pascalCase('helloWorld')).toBe('HelloWorld')
      })
    })

    describe('When string is pascal case', () => {
      it('Then return pascal case string', () => {
        expect(pascalCase('HelloWorld')).toBe('HelloWorld')
      })
    })

    describe('When string is uppercase', () => {
      it('Then return pascal case string', () => {
        expect(pascalCase('HELLO_WORLD')).toBe('HelloWorld')
      })
    })
  })
})
