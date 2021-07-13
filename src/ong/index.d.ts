type TCreateOng = {
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  cep: string;
  address: string;
  city: string;
  uf: string;
  actingStates: string;
}

type TUpdateOng = Partial<TCreateOng>