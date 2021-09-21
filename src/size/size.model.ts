import { AfterSync, AutoIncrement, BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, PrimaryKey, Table } from 'sequelize-typescript';

import { Species } from '../species/species.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Size extends Model {
  id: number;

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

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      {
        name: "Mini",
        initWeight: "0.5kg",
        endWeight: "6kg",
        speciesId: 1,
      },
      {
        name: "Pequeno",
        initWeight: "6kg",
        endWeight: "15kg",
        speciesId: 1,
      },
      {
        name: "Médio",
        initWeight: "15kg",
        endWeight: "25kg",
        speciesId: 1,
      },
      {
        name: "Grande",
        initWeight: "25kg",
        endWeight: "45kg",
        speciesId: 1,
      },
      {
        name: "Extra Grande",
        initWeight: "45kg",
        endWeight: "90kg",
        speciesId: 1,
      },
      {
        name: "Pequeno",
        initWeight: "2kg",
        endWeight: "3kg",
        speciesId: 2,
      },
      {
        name: "Médio",
        initWeight: "3kg",
        endWeight: "5kg",
        speciesId: 2,
      },
      {
        name: "Grande",
        initWeight: "5kg",
        endWeight: "7kg",
        speciesId: 2,
      },
    ], { ignoreDuplicates: true });
  }

  @BeforeSave
  static async format(size: Size) {
    size.name = capitalizeFirstLetter(size.name);
    size.initWeight = size.initWeight.toLowerCase();
    size.endWeight = size.endWeight.toLowerCase();
  }
}