import { ApiProperty } from '@nestjs/swagger';
import { BeforeSave, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Gift extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  })
  id: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  size: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  color: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  weight: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  taste: string;

  @ApiProperty({ type: 'string', required: false })
  @Column(DataType.STRING)
  media: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;

  @BeforeSave
  static async formatSize(gift: Gift) {
    if (gift.size) gift.size = gift.size.toUpperCase();
    if (gift.weight) gift.weight = gift.weight.toUpperCase();
    if (gift.color) gift.color = gift.color.charAt(0).toUpperCase() + gift.color.slice(1);
    if (gift.taste) gift.taste = gift.taste.charAt(0).toUpperCase() + gift.taste.slice(1);
  }
}