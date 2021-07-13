type TCreatePartner = {
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  cep: string;
  address: string;
  city: string;
  uf: string;
  services: string;
}

type TUpdatePartner = Partial<TCreatePartner>