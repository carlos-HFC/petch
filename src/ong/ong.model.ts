import { BeforeSave, Column, DataType, Model, NotEmpty, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Ong extends Model {
  @NotEmpty({ msg: "Campo 'Nome' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @NotEmpty({ msg: "Campo 'E-mail' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @NotEmpty({ msg: "Campo 'Responsável' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  responsible: string;

  @Column(DataType.STRING)
  image: string;

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

  @NotEmpty({ msg: "Campo 'Abrangência' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coverage: string;

  @BeforeSave
  static async formatData(ong: Ong) {
    ong.coverage = ong.coverage.toUpperCase();
    ong.uf = ong.uf.toUpperCase();
    ong.cep = ong.cep.replace(/[\s-]/g, '');
    ong.phone1 = ong.phone1.replace(/[\s()-]/g, '');
    if (ong.phone2) ong.phone2 = ong.phone2.replace(/[\s()-]/g, '');
    if (ong.phone3) ong.phone3 = ong.phone3.replace(/[\s()-]/g, '');
  }
}