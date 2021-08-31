type TCreateScheduling = {
  date: string
  initHour: string
  endHour: string
  schedulingTypesId: number
}

type TUpdateScheduling = Partial<TCreateScheduling>