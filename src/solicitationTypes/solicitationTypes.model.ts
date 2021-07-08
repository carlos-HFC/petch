import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class SolicitationTypes extends Model {
  @Column({
    type: DataType.STRING
  })
  name: string;

  @BeforeSave
  static async upperFirst(solicitationTypes: SolicitationTypes) {
    return solicitationTypes.name = solicitationTypes.name.charAt(0).toUpperCase() + solicitationTypes.name.slice(1);
  }
}