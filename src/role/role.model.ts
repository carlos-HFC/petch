import { ApiProperty } from '@nestjs/swagger';
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ paranoid: true })
export class Role extends Model {
  @ApiProperty({ uniqueItems: true, type: 'integer', readOnly: true })
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty({ type: 'string' })
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  createdAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'date', required: false, readOnly: true })
  deletedAt: Date | null;
}