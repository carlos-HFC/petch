import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Ong extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  actingStates: string;

  @BeforeSave
  static async formatData(ong: Ong) {
    ong.actingStates = ong.actingStates.toUpperCase();
    ong.uf = ong.uf.toUpperCase();
  }
}