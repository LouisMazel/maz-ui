export type SimpleValue = string | undefined

export interface RangeValue {
  start: string
  end: string
}

export type PartialRangeValue = Partial<RangeValue>

export type PickerValue = SimpleValue | PartialRangeValue

export interface PickerShortcut {
  identifier: string
  label: string
  value: {
    start: string
    end: string
  }
}
