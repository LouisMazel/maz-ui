export interface MazPickerRangeValue {
  start: string
  end: string
}

export type MazPickerPartialRangeValue = Partial<MazPickerRangeValue>

export type MazPickerValue = string | undefined | MazPickerPartialRangeValue

export interface MazPickerShortcut {
  identifier: string
  label: string
  value: {
    start: string
    end: string
  }
}
