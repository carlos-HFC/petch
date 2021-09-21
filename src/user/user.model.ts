import { compare, hash } from 'bcrypt';
import { format, parseISO } from 'date-fns';
import { AfterSync, BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, Table } from 'sequelize-typescript';

import { Role } from '../role/role.model';

@DefaultScope(() => ({
  include: [
    {
      model: Role,
      attributes: ['name']
    }
  ],
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    defaultValue: null
  })
  googleId: string;

  @NotEmpty({ msg: "Campo 'Nome' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING)
  avatar: string;

  @NotEmpty({ msg: "Campo 'E-mail' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  emailVerified: boolean;

  @Column(DataType.STRING)
  tokenVerificationEmail: string;

  @Column(DataType.STRING)
  hash: string;

  @Column(DataType.VIRTUAL)
  password: string;

  @NotEmpty({ msg: "Campo 'CPF' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  cpf: string;

  @NotEmpty({ msg: "Campo 'Data de Nascimento' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  birthday: string;

  @NotEmpty({ msg: "Campo 'Gênero' não pode ser vazio" })
  @Column({
    type: DataType.ENUM('M', 'F', 'O'),
    allowNull: false,
  })
  gender: string;

  @NotEmpty({ msg: "Campo 'CEP' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cep: string;

  @NotEmpty({ msg: "Campo 'Endereço' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column(DataType.STRING)
  complement: string;

  @NotEmpty({ msg: "Campo 'Bairro' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  district: string;

  @NotEmpty({ msg: "Campo 'Cidade' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @NotEmpty({ msg: "Campo 'UF' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uf: string;

  @NotEmpty({ msg: "Campo 'Telefone' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPassword: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null
  })
  tokenResetPasswordExpires: string;

  @ForeignKey(() => Role)
  @Column({ allowNull: false })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @BeforeSave
  static async hashPass(user: User) {
    if (user.password) return user.hash = await hash(user.password, 10);
  }

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      {
        name: 'Luara Silva Oliveira',
        email: 'luara.oliveira8@gmail.com',
        emailVerified: true,
        password: 'C@ju1208',
        cpf: '55122610029',
        birthday: '1996-08-12',
        gender: 'F',
        cep: '13841155',
        address: 'Rua Carlos Manoel Franco de Campos, 130',
        district: 'Jardim Nova Mogi Guaçu',
        city: 'Mogi Guaçu',
        uf: 'SP',
        phone: '19997111194',
        roleId: 1,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Carlos Henrique Faustino Cardoso',
        email: 'chfcchfc96@gmail.com',
        emailVerified: true,
        password: 'Chfc@1234',
        cpf: '06105014880',
        birthday: '1996-12-21',
        gender: 'M',
        cep: '05372100',
        address: 'Rua Deolinda Rodrigues, 592',
        district: 'Jardim Ester',
        city: 'São Paulo',
        uf: 'SP',
        phone: '11994034599',
        roleId: 2,
        avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fHBlcnNvbnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Mirella Letícia Drumond',
        email: 'mirella@teste.com',
        emailVerified: true,
        password: 'Mld@1991',
        cpf: '80997271850',
        birthday: '1991-01-04',
        gender: 'F',
        cep: '03174080',
        address: 'Rua Francisco Gouveia, 717',
        district: 'Quarta Parada',
        city: 'São Paulo',
        uf: 'SP',
        phone: '11999008029',
        roleId: 2,
        avatar: 'https://imagesunsplash.com/photo-1544005313-94ddf0286df2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Guilherme Sérgio Araújo',
        email: 'guilherme@teste.com',
        emailVerified: true,
        password: 'Gsa@1999',
        cpf: '21821882822',
        birthday: '1999-05-05',
        gender: 'M',
        cep: '14808546',
        address: 'Rua Manoel Cervan Vidal, 231',
        district: 'Jardim Marialice',
        city: 'Araraquara',
        uf: 'SP',
        phone: '16989586008',
        roleId: 2,
        avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcnNvbnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Luiz Nathan das Neves',
        email: 'luiz@teste.com',
        emailVerified: true,
        password: 'Lnn@1996',
        cpf: '84056829888',
        birthday: '1996-09-20',
        gender: 'M',
        cep: '14161152',
        address: 'Rua Antero Luchiari, 856',
        district: 'Shangri-Lá',
        city: 'Sertãozinho',
        uf: 'SP',
        phone: '16992974392',
        roleId: 2,
        avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Liz Lúcia Santos',
        email: 'liz@teste.com',
        emailVerified: true,
        password: 'Lls@1993',
        cpf: '800.179.428-88',
        birthday: '1993-02-27',
        gender: 'F',
        cep: '03682-120',
        address: 'Rua Benjamim Novais, 314',
        district: 'Burgo Paulista',
        city: 'São Paulo',
        uf: 'SP',
        phone: '(11) 98163-1442',
        roleId: 2,
        avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Débora Benedita Allana Ramos',
        email: 'debora@teste.com',
        emailVerified: true,
        password: 'Dba@1986',
        cpf: '323.687.108-33',
        birthday: '1986-08-18',
        gender: 'F',
        cep: '18701-809',
        address: 'Rua Luiz Sanches Peres, 363',
        district: 'Conjunto Habitacional Mario Emílio Bannwart',
        city: 'Avaré',
        uf: 'SP',
        phone: '(14) 98768-1027',
        roleId: 2,
        avatar: 'https://images.unsplash.com/photo-1619312676557-aa9fe05ef190?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29uJTIwbWlkJTIwYWdlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'Danilo Leonardo Fogaça',
        email: 'danilo@teste.com',
        emailVerified: true,
        password: 'Dlf@1964',
        cpf: '841.952.018-70',
        birthday: '1964-11-18',
        gender: 'M',
        cep: '14056-490',
        address: 'Rua José Gussi, 312',
        district: 'Planalto Verde',
        city: 'Ribeirão Preto',
        uf: 'SP',
        phone: '(16) 98172-1371',
        roleId: 2,
        avatar: 'https://images.unsplash.com/photo-1535643302794-19c3804b874b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29uJTIwbWlkJTIwYWdlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
    ], { ignoreDuplicates: true });
  }

  @BeforeSave
  static async formatData(user: User) {
    user.email = user.email.toLowerCase();
    user.birthday = format(parseISO(user.birthday), 'yyyy-MM-dd');
    user.uf = user.uf.toUpperCase();
    user.gender = user.gender.toUpperCase();
    user.cpf = user.cpf.replace(/[\s.-]/g, '');
    user.cep = user.cep.replace(/[\s-]/g, '');
    user.phone = user.phone.replace(/(55)?[\s-+()]/g, '');
  }

  checkPass(password: string) {
    return compare(password, this.hash);
  }
}