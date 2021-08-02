import { BeforeSave, Column, DataType, Model, NotEmpty, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Partner extends Model {
  @NotEmpty({ msg: "Campo 'Nome Fantasia' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fantasyName: string;

  @NotEmpty({ msg: "Campo 'Razão Social' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;

  @NotEmpty({ msg: "Campo 'CNPJ' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  cnpj: string;

  @NotEmpty({ msg: "Campo 'Inscrição Estadual' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  stateRegistration: string;

  @NotEmpty({ msg: "Campo 'Responsável' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  responsible: string;

  @NotEmpty({ msg: "Campo 'E-mail' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @NotEmpty({ msg: "Campo 'Website' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  website: string;

  @NotEmpty({ msg: "Campo 'Telefone 1' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone1: string;

  @Column(DataType.STRING)
  phone2: string;

  @Column(DataType.STRING)
  phone3: string;

  @NotEmpty({ msg: "Campo 'CEP' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  cep: string;

  @NotEmpty({ msg: "Campo 'Endereço' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address: string;

  @NotEmpty({ msg: "Campo 'Bairro' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  district: string;

  @Column(DataType.STRING)
  complement: string;

  @NotEmpty({ msg: "Campo 'Cidade' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city: string;

  @NotEmpty({ msg: "Campo 'UF' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  uf: string;

  @Column(DataType.STRING)
  logo: string;

  @BeforeSave
  static async formatData(partner: Partner) {
    partner.email = partner.email.toLowerCase();
    partner.uf = partner.uf.toUpperCase();
    partner.cep = partner.cep.replace(/[\s-]/g, '');
    partner.stateRegistration = partner.stateRegistration.replace(/[\s.]/g, '');
    partner.cnpj = partner.cnpj.replace(/[\/\s-.]/g, '');
    partner.phone1 = partner.phone1.replace(/[\s()-]/g, '');
    if (partner.phone2) partner.phone2 = partner.phone2.replace(/[\s()-]/g, '');
    if (partner.phone3) partner.phone3 = partner.phone3.replace(/[\s()-]/g, '');
    if (!partner.website.includes('https://')) partner.website = `https://${partner.website}`;
  }
}