import { BeforeSave, Column, DataType, Model, NotEmpty, Table } from 'sequelize-typescript';

import { capitalizeFirstLetter } from '../utils';

@Table({ paranoid: true })
export class Species extends Model {
  @NotEmpty({ msg: "Campo 'Nome' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column(DataType.STRING)
  avatar: string;

  @BeforeSave
  static async upperFirst(species: Species) {
    return species.name = capitalizeFirstLetter(species.name);
  }
}