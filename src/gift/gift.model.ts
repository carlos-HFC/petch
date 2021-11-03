import { BeforeSave, BelongsTo, Column, DataType, DefaultScope, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Partner } from '../partner/partner.model';
import { capitalizeFirstLetter } from '../utils';

@DefaultScope(() => ({
  include: [
    {
      model: Partner,
      attributes: ['fantasyName'],
    }
  ],
  order: [['id', 'asc']]
}))
@Table({ paranoid: true })
export class Gift extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

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

  @ForeignKey(() => Partner)
  @Column({ allowNull: false })
  partnerId: number;

  @BelongsTo(() => Partner)
  partner: Partner;

  @BeforeSave
  static async formatData(gift: Gift) {
    gift.name = capitalizeFirstLetter(gift.name);
    gift.description = capitalizeFirstLetter(gift.description);
    if (gift.size) gift.size = gift.size.toUpperCase();
    if (gift.weight) gift.weight = gift.weight.toLowerCase();
    if (gift.color) gift.color = capitalizeFirstLetter(gift.color);
    if (gift.taste) gift.taste = capitalizeFirstLetter(gift.taste);
  }
}