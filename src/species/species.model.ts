import { AutoIncrement, BeforeSave, Column, DataType, DefaultScope, HasMany, Model, NotEmpty, PrimaryKey, Table } from 'sequelize-typescript';

import { Size } from '../size/size.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  include: [Size],
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Species extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @NotEmpty({ msg: "Campo 'Nome' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column(DataType.STRING)
  image: string;

  @HasMany(() => Size)
  sizes: Size[];

  @BeforeSave
  static async upperFirst(species: Species) {
    return species.name = capitalizeFirstLetter(species.name);
  }
}