export interface DaySlot {
  start: string
  end: string
  options?: {
    badge?: number
    highlighted?: boolean
    warning?: boolean
    blocked?: boolean
    disabled?: boolean
  }
  extra?: Record<string, any>
}

export interface Day {
  date: string
  slots?: DaySlot[]
}
