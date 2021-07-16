import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Gift extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  size: string;

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  color: string;

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  weight: string;

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  taste: string;

  @BeforeSave
  static async formatSize(gift: Gift) {
    gift.size = gift.size?.toUpperCase();
    gift.weight = gift.weight?.toUpperCase();
    gift.color = gift.color?.charAt(0).toUpperCase() + gift.color?.slice(1);
    gift.taste = gift.taste?.charAt(0).toUpperCase() + gift.taste?.slice(1);
  }
}