export type SimpleValue = string | undefined

export type RangeValue = {
  start: string
  end: string
}

export type PartialRangeValue = Partial<RangeValue>

export type PickerValue = SimpleValue | PartialRangeValue
