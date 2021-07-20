import { ApiProperty } from '@nestjs/swagger';
import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Partner extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  })
  id: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fantasyName: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  cnpj: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  stateRegistration: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  responsible: string;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  website: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone1: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  phone2: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  phone3: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  cep: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  district: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  complement: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  uf: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  logo: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

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