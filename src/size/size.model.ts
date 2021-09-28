import { AfterSync, AutoIncrement, BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, PrimaryKey, Table } from 'sequelize-typescript';

import { Species } from '../species/species.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Size extends Model {
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  initWeight: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  endWeight: string;

  @ForeignKey(() => Species)
  @Column({ allowNull: false })
  speciesId: number;

  @BelongsTo(() => Species)
  species: Species;

  @AfterSync
  static async createAll() {
    process.env.NODE_ENV !== 'dev' && await this.bulkCreate([
      {
        id: 1,
        name: "Mini",
        initWeight: "0.5kg",
        endWeight: "6kg",
        speciesId: 1,
      },
      {
        id: 2,
        name: "Pequeno",
        initWeight: "6kg",
        endWeight: "15kg",
        speciesId: 1,
      },
      {
        id: 3,
        name: "Médio",
        initWeight: "15kg",
        endWeight: "25kg",
        speciesId: 1,
      },
      {
        id: 4,
        name: "Grande",
        initWeight: "25kg",
        endWeight: "45kg",
        speciesId: 1,
      },
      {
        id: 5,
        name: "Extra Grande",
        initWeight: "45kg",
        endWeight: "90kg",
        speciesId: 1,
      },
      {
        id: 6,
        name: "Pequeno",
        initWeight: "2kg",
        endWeight: "3kg",
        speciesId: 2,
      },
      {
        id: 7,
        name: "Médio",
        initWeight: "3kg",
        endWeight: "5kg",
        speciesId: 2,
      },
      {
        id: 8,
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
  }
}