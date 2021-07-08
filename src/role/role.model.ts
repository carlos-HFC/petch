import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Role extends Model {
  @Column({
    type: DataType.STRING
  })
  name: string;
}