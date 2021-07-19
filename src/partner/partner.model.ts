import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Partner extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fantasyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  cnpj: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  stateRegistration: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  responsible: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  website: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone1: string;

  @Column(DataType.STRING)
  phone2: string;

  @Column(DataType.STRING)
  phone3: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  cep: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  district: string;

  @Column(DataType.STRING)
  complement: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city: string;

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
    partner.phone2 = partner.phone2?.replace(/[\s()-]/g, '');
    partner.phone3 = partner.phone3?.replace(/[\s()-]/g, '');
    if (!partner.website.includes('https://')) partner.website = `https://${partner.website}`;
  }
}