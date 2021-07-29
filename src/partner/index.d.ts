type TCreatePartner = {
  fantasyName: string;
  companyName: string;
  cnpj: string;
  stateRegistration: string;
  responsible: string;
  email: string;
  website: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  cep: string;
  address: string;
  district: string;
  complement?: string;
  city: string;
  uf: string;
};

type TUpdatePartner = Partial<TCreatePartner>;

type TFilterPartner = {
  inactives?: boolean
  fantasyName?: string
  uf?: string
}