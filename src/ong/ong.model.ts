import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Ong extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

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
    ong.cep = ong.cep.replace(/[-]/g, '');
    ong.phone1 = ong.phone1.replace(/[()-]/g, '');
    ong.phone2 = ong.phone2?.replace(/[()-]/g, '');
    ong.phone3 = ong.phone3?.replace(/[()-]/g, '');
  }
}