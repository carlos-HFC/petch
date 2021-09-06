type TCreateScheduling = {
  date: string;
  schedulingTypesId: number;
};

type TUpdateScheduling = Partial<TCreateScheduling>;

type TFilterScheduling = {
  inactives?: boolean;
  schedulingTypes?: string;
};