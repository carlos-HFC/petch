type TCreateUser = {
  isAdmin?: boolean;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cpf: string;
  birthday: string;
  gender: string;
  cep: string;
  address: string;
  district: string;
  city: string;
  uf: string;
  phone: string;
  complement?: string;
};

type TUpdateUser = Partial<TCreateUser> & {
  oldPassword?: string;
};