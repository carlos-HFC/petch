type TCreateSpecies = {
  name: string;
};

type TUpdateSpecies = Partial<TCreateSpecies>;

type TFilterSpecies = TUpdateSpecies & {
  inactives?: boolean;
};