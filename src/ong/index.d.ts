type TCreateOng = {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  cep: string;
  address: string;
  district: string;
  complement?: string;
  city: string;
  uf: string;
  coverage: string;
};

type TUpdateOng = Partial<TCreateOng>;

type TFilterOng = {
  inactives?: boolean;
  name?: string;
  uf?: string;
  coverage?: string;
};