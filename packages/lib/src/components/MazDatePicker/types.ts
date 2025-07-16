export interface MazDatePickerRangeValue {
  start: string
  end: string
}

export type MazDatePickerPartialRangeValue = Partial<MazDatePickerRangeValue>

export type MazDatePickerValue = string | undefined | MazDatePickerPartialRangeValue

export interface MazDatePickerShortcut {
  identifier: string
  label: string
  value: {
    start: string
    end: string
  }
}
