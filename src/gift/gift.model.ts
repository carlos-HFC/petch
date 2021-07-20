import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

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
  media: string;

  @BeforeSave
  static async formatSize(gift: Gift) {
    if (gift.size) gift.size = gift.size.toUpperCase();
    if (gift.weight) gift.weight = gift.weight.toUpperCase();
    if (gift.color) gift.color = gift.color.charAt(0).toUpperCase() + gift.color.slice(1);
    if (gift.taste) gift.taste = gift.taste.charAt(0).toUpperCase() + gift.taste.slice(1);
  }
}