import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, NotEmpty, Table } from 'sequelize-typescript';

import { Partner } from '../partner/partner.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  include: [
    {
      model: Partner,
      attributes: ['fantasyName']
    }
  ]
}))
@Table({ paranoid: true })
export class Gift extends Model {
  @NotEmpty({ msg: "Campo 'Nome' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @NotEmpty({ msg: "Campo 'Descrição' não pode ser vazio" })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column(DataType.STRING)
  size: string;

  @Column(DataType.STRING)
  color: string;

  @Column(DataType.STRING)
  weight: string;

  @Column(DataType.STRING)
  taste: string;

  @Column(DataType.STRING)
  image: string;

  @NotEmpty({ msg: "Campo 'Abrangência' não pode ser vazio" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coverage: string;

  @ForeignKey(() => Partner)
  @Column
  partnerId: number;

  @BelongsTo(() => Partner)
  partner: Partner;

  @BeforeSave
  static async formatData(gift: Gift) {
    if (gift.size) gift.size = gift.size.toUpperCase();
    if (gift.weight) gift.weight = gift.weight.toUpperCase();
    if (gift.color) gift.color = capitalizeFirstLetter(gift.color);
    if (gift.taste) gift.taste = capitalizeFirstLetter(gift.taste);
    if (gift.coverage) gift.coverage = gift.coverage.toUpperCase();
  }
}