import { BeforeSave, Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript';

import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Species extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column(DataType.STRING)
  image: string;

  @BeforeSave
  static async upperFirst(species: Species) {
    return species.name = capitalizeFirstLetter(species.name);
  }
}