import { ApiProperty } from '@nestjs/swagger';
import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Ong extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  })
  id: number;

  @ApiProperty({ type: 'string', uniqueItems: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

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

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  actingStates: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @BeforeSave
  static async formatData(ong: Ong) {
    ong.actingStates = ong.actingStates.toUpperCase();
    ong.uf = ong.uf.toUpperCase();
    ong.cep = ong.cep.replace(/[\s-]/g, '');
    ong.phone1 = ong.phone1.replace(/[\s()-]/g, '');
    ong.phone2 = ong.phone2?.replace(/[\s()-]/g, '');
    ong.phone3 = ong.phone3?.replace(/[\s()-]/g, '');
  }
}