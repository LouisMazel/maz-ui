import {
  computeDeletion,
  countSignificantBefore,
  extractSignificant,
  formatWithCaret,
  getCaretInRewrittenValue,
  getPositionAfterSignificant,
} from '@components/MazInputPhoneNumber/caret.ts'

describe('components/MazInputPhoneNumber/caret.ts', () => {
  describe('given extractSignificant', () => {
    describe('when the value has punctuation', () => {
      it('then keeps only the digits', () => {
        expect(extractSignificant('(06) 12-34 56')).toBe('06123456')
      })
    })

    describe('when the value starts with a plus', () => {
      it('then keeps the leading plus', () => {
        expect(extractSignificant('+33 6 12')).toBe('+33612')
      })
    })

    describe('when a plus is not leading', () => {
      it('then drops it', () => {
        expect(extractSignificant('06+12')).toBe('0612')
      })
    })

    describe('when the value has several leading plus', () => {
      it('then keeps only the first one', () => {
        expect(extractSignificant('++33')).toBe('+33')
      })
    })

    describe('when the value has arabic indic digits', () => {
      it('then converts them to ascii digits', () => {
        expect(extractSignificant('٠٦۱۲')).toBe('0612')
      })
    })

    describe('when the value is empty', () => {
      it('then returns an empty string', () => {
        expect(extractSignificant('')).toBe('')
      })
    })
  })

  describe('given countSignificantBefore', () => {
    describe('when the caret is after punctuation', () => {
      it('then counts only the digits before it', () => {
        expect(countSignificantBefore('06 66 77', 5)).toBe(4)
      })
    })

    describe('when the position is negative', () => {
      it('then returns 0', () => {
        expect(countSignificantBefore('06', -3)).toBe(0)
      })
    })

    describe('when the value starts with a plus', () => {
      it('then counts the plus', () => {
        expect(countSignificantBefore('+33 6', 3)).toBe(3)
      })
    })
  })

  describe('given getPositionAfterSignificant', () => {
    describe('when the count is 0', () => {
      it('then returns 0', () => {
        expect(getPositionAfterSignificant('06 66', 0)).toBe(0)
      })
    })

    describe('when the count targets a digit before a space', () => {
      it('then returns the position right after the digit', () => {
        expect(getPositionAfterSignificant('06 66 77', 2)).toBe(2)
      })
    })

    describe('when the count targets the digit after a space', () => {
      it('then returns the position after that digit', () => {
        expect(getPositionAfterSignificant('06 66 77', 3)).toBe(4)
      })
    })

    describe('when the count exceeds the significant characters', () => {
      it('then returns the end of the value', () => {
        expect(getPositionAfterSignificant('06 66', 9)).toBe(5)
      })
    })
  })

  describe('given formatWithCaret', () => {
    const format = (significant: string) => significant.replaceAll(/(\d{2})(?=\d)/g, '$1 ')

    describe('when a digit is typed in the middle', () => {
      it('then keeps the caret after the typed digit', () => {
        expect(formatWithCaret('06 666 77 66', 5, format)).toEqual({ value: '06 66 67 76 6', caret: 5 })
      })
    })

    describe('when the format returns nothing', () => {
      it('then falls back to the significant characters', () => {
        expect(formatWithCaret('06 66', 5, () => undefined)).toEqual({ value: '0666', caret: 4 })
      })
    })

    describe('when the caret is at the start', () => {
      it('then keeps it at the start', () => {
        expect(formatWithCaret('0666', 0, format).caret).toBe(0)
      })
    })
  })

  describe('given computeDeletion', () => {
    describe('when the selection is not collapsed', () => {
      it('then removes the selection', () => {
        expect(computeDeletion({ value: '06 66 77', selectionStart: 1, selectionEnd: 5, direction: 'backward' }))
          .toEqual({ value: '0 77', caret: 1 })
      })
    })

    describe('when backspace follows a digit', () => {
      it('then leaves the native behavior', () => {
        expect(computeDeletion({ value: '06 66', selectionStart: 2, selectionEnd: 2, direction: 'backward' })).toBeUndefined()
      })
    })

    describe('when backspace is at the start', () => {
      it('then leaves the native behavior', () => {
        expect(computeDeletion({ value: '06 66', selectionStart: 0, selectionEnd: 0, direction: 'backward' })).toBeUndefined()
      })
    })

    describe('when backspace follows a space', () => {
      it('then removes the digit before the space with it', () => {
        expect(computeDeletion({ value: '06 66', selectionStart: 3, selectionEnd: 3, direction: 'backward' }))
          .toEqual({ value: '066', caret: 1 })
      })
    })

    describe('when backspace follows a closing parenthesis', () => {
      it('then removes the digit before the parenthesis', () => {
        expect(computeDeletion({ value: '(555) 12', selectionStart: 5, selectionEnd: 5, direction: 'backward' }))
          .toEqual({ value: '(55 12', caret: 3 })
      })
    })

    describe('when backspace follows only punctuation', () => {
      it('then leaves the native behavior', () => {
        expect(computeDeletion({ value: '(', selectionStart: 1, selectionEnd: 1, direction: 'backward' })).toBeUndefined()
      })
    })

    describe('when delete precedes a digit', () => {
      it('then leaves the native behavior', () => {
        expect(computeDeletion({ value: '06 66', selectionStart: 3, selectionEnd: 3, direction: 'forward' })).toBeUndefined()
      })
    })

    describe('when delete is at the end', () => {
      it('then leaves the native behavior', () => {
        expect(computeDeletion({ value: '06 66', selectionStart: 5, selectionEnd: 5, direction: 'forward' })).toBeUndefined()
      })
    })

    describe('when delete precedes a space', () => {
      it('then removes the digit after the space with it', () => {
        expect(computeDeletion({ value: '06 66', selectionStart: 2, selectionEnd: 2, direction: 'forward' }))
          .toEqual({ value: '066', caret: 2 })
      })
    })

    describe('when delete precedes only punctuation', () => {
      it('then leaves the native behavior', () => {
        expect(computeDeletion({ value: '06 )', selectionStart: 2, selectionEnd: 2, direction: 'forward' })).toBeUndefined()
      })
    })
  })
  describe('given getCaretInRewrittenValue', () => {
    describe('when only the formatting changed', () => {
      it('then keeps the caret after the same digits', () => {
        expect(getCaretInRewrittenValue({ previousValue: '06 66 7 66 66', previousCaret: 6, value: '06 66 76 66 6' })).toBe(5)
        expect(getCaretInRewrittenValue({ previousValue: '06668 76 66 6', previousCaret: 5, value: '06 66 87 66 66' })).toBe(7)
      })
    })

    describe('when the caret is before every digit', () => {
      it('then returns 0', () => {
        expect(getCaretInRewrittenValue({ previousValue: '0666', previousCaret: 0, value: '06 66' })).toBe(0)
      })
    })

    describe('when the digits changed', () => {
      it('then returns undefined', () => {
        expect(getCaretInRewrittenValue({ previousValue: '+33 6', previousCaret: 5, value: '06' })).toBeUndefined()
      })
    })
  })
})
