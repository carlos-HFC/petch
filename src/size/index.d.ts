type TCreateSize = {
  name: string;
  initWeight: string;
  endWeight: string;
  speciesId: number;
};

type TUpdateSize = Omit<Partial<TCreateSize>, 'speciesId'>;