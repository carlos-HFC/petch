import { BeforeSave, BelongsTo, Column, DataType, ForeignKey, Model, NotEmpty, Table } from 'sequelize-typescript';

import { Species } from '../species/species.model';
import { capitalizeFirstLetter } from '../utils';

@Table({ paranoid: true })
export class Size extends Model {
  @NotEmpty({ msg: "Campo 'Nome' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @NotEmpty({ msg: "Campo 'Peso Inicial' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  initWeight: string;

  @NotEmpty({ msg: "Campo 'Peso Final' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  endWeight: string;
  
  @NotEmpty({ msg: "Campo 'Espécie' não pode ser vazio" })
  @ForeignKey(() => Species)
  @Column({ allowNull: false })
  speciesId: number;

  @BelongsTo(() => Species)
  species: Species;

  @BeforeSave
  static async format(size: Size) {
    size.name = capitalizeFirstLetter(size.name);
    size.initWeight = size.initWeight.toLowerCase();
    size.endWeight = size.endWeight.toLowerCase();
  }
}