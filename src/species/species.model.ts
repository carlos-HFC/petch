import { BeforeSave, Column, DataType, DefaultScope, HasMany, Model, Table } from 'sequelize-typescript';

import { Pet } from '../pet/pet.model';
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

  @HasMany(() => Pet)
  pets: Pet[];

  @BeforeSave
  static async upperFirst(species: Species) {
    return species.name = capitalizeFirstLetter(species.name);
  }
}