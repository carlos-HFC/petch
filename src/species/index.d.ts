type TCreateSpecies = {
  name: string;
  size: Omit<TCreateSize, 'speciesId'>[]
};

type TUpdateSpecies = Partial<TCreateSpecies>;

type TFilterSpecies = TUpdateSpecies & {
  inactives?: boolean;
};