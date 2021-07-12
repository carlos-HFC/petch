import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Media extends Model {
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  mimetype: string;

  @Column(DataType.STRING)
  url: string;
}