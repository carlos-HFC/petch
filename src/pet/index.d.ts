type TCreatePet = {
  breed?: string;
  name?: string;
  age: string;
  color: string;
  description: string;
  weight: string;
  gender: string;
  cut: boolean;
  ongId: number;
  speciesId: number;
};

type TUpdatePet = Partial<TCreatePet>;

type TFilterPet = {
  inactives?: boolean;
  gender?: string;
  age?: string;
  ong?: string;
  species?: string;
};