import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Species extends Model {
  @Column({
    type: DataType.STRING
  })
  name: string;

  @BeforeSave
  static async upperFirst(species: Species) {
    return species.name = species.name.charAt(0).toUpperCase() + species.name.slice(1);
  }
}