import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Gift extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column(DataType.STRING)
  size: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: string;

  @BeforeSave
  static async formatSize(gift: Gift) {
    gift.size = gift?.size.toUpperCase();
  }
}